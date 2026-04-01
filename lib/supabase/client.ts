/**
 * Supabase istemci yapılandırması.
 * Geliştirme sürecinde çevrimdışı/mock (dummy) çalışabilmesi için geçici bir katman içerir.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key && url !== "https://dummy-project.supabase.co" && url.trim() !== "") {
    // ---- GERÇEK SUPABASE BAĞLANTISI ----
    return createBrowserClient(url, key);
  }

  // ---- DUMMY SUPABASE BAĞLANTISI (LOCALSTORAGE MOCK) ----
  // Sistem Supabase .env ayarlarını alana kadar geliştiricinin akışını durdurmaz.
  
  if (typeof window === "undefined") {
    // Sunucu tarafında dummy (hydration çökmemesi için)
    return mockClient();
  }

  return mockClient();
}

// ------ MOCK (DUMMY) İŞLEMLER ------
function mockClient() {
  const listeners: Array<(event: string, session: any) => void> = [];

  const getMockSession = () => {
    if (typeof window === "undefined") return null;
    const s = localStorage.getItem("mock_session");
    return s ? JSON.parse(s) : null;
  };

  const dispatchSessionChange = (event: string, session: any) => {
    listeners.forEach((listener) => listener(event, session));
  };

  return {
    auth: {
      async getSession() {
        return { data: { session: getMockSession() }, error: null };
      },
      onAuthStateChange(callback: any) {
        listeners.push(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                const idx = listeners.indexOf(callback);
                if (idx > -1) listeners.splice(idx, 1);
              }
            }
          }
        };
      },
      async signInWithPassword({ email, password }: any) {
        // LocalStorage'dan "yeni_kayitlar" tablosuna bak ("kayit_bilgileri" vb.)
        const kayitlar = JSON.parse(localStorage.getItem("yeni_kayitlar") || "[]");
        const found = kayitlar.find((k: any) => {
          const fEmail = k.detay?.firma?.email || k.email;
          const pwd = k.detay?.auth?.password || k.password;
          return fEmail === email && pwd === password;
        });

        if (found) {
          const session = { 
            user: { id: found.id || "dummy_user_1", email, membership_type: found.uyelik },
            access_token: "mock_token" 
          };
          localStorage.setItem("mock_session", JSON.stringify(session));
          dispatchSessionChange("SIGNED_IN", session);
          return { data: { user: session.user, session }, error: null };
        } else {
          return { data: { user: null, session: null }, error: new Error("Kullanıcı adı veya şifre hatalı") };
        }
      },
      async signOut() {
        localStorage.removeItem("mock_session");
        dispatchSessionChange("SIGNED_OUT", null);
        return { error: null };
      },
      async resetPasswordForEmail(email: string, options?: any) {
        // Mock — sadece simülasyon, gerçek e-posta göndermez
        console.log("[MOCK] Şifre sıfırlama e-postası gönderildi:", email);
        return { data: {}, error: null };
      },
      async getUser() {
        const session = getMockSession();
        return { data: { user: session?.user || null }, error: null };
      }
    },
    from(table: string) {
      // Zincirlenebilir sahte sorgu (chain mock)
      let queryResult: any = null;
      let isSingle = false;

      const kayitlar = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("yeni_kayitlar") || "[]") : [];

      const chain = {
        select(cols?: string) {
          // Tablo simülasyonu
          if (table === "firms") {
            queryResult = kayitlar.map((k: any) => ({
              id: k.id,
              auth_id: "dummy_user_1",
              name: k.detay?.firma?.name || k.ad || "Bilinmiyor",
              tax_number: k.detay?.firma?.tax_number || "Bilinmiyor",
              email: k.detay?.firma?.email || k.email,
              phone: k.detay?.firma?.phone || "Bilinmiyor",
              membership_type: k.uyelik === "Premium" ? 3 : (k.uyelik === "Standart" ? 2 : 1),
              show_phone: true
            }));
          } else if (table === "firm_references") {
            const son = kayitlar.find((k: any) => k.detay?.references);
            if (son && son.detay.references) {
              queryResult = son.detay.references.map((r: any) => ({
                id: Math.random(),
                firm_id: son.id,
                project_name: r.subject || r.project_name,
                employer: r.employer,
                project_date: r.year ? `${r.year}-01-01` : r.project_date,
                scope: r.scope || ""
              }));
            } else {
              queryResult = [];
            }
          }
          return chain;
        },
        eq(col: string, val: any) {
          // Çok basit eşleşme filtresi (sadece string/number)
          if (Array.isArray(queryResult)) {
            // Şimdilik mock için id/auth_id eşleşmesini ciddiye almamıza gerek yok
            // Ancak single testini geçmesi için ilk elemanı döndürebiliriz
          }
          return chain;
        },
        single() {
          isSingle = true;
          return chain;
        },
        then(resolve: (value: any) => void) {
          // Async taklidi için Promise mock'lanır
          setTimeout(() => {
            let data = queryResult;
            if (isSingle && Array.isArray(queryResult)) {
               data = queryResult.length > 0 ? queryResult[0] : null;
            }
            // Başarısızmış gibi dönerek, CompanyPanel'ın kendi fallback 'loadFromLocal' sistemini devreye sokarız
            // Bu sayede sistem orijinal yapısında çalışır.
            resolve({ data: null, error: new Error("Mock database force error execution") });
          }, 50);
        }
      };

      return chain;
    }
  };
}
