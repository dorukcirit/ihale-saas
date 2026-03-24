import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const firmaId = data.id;

    if (!firmaId) {
      return NextResponse.json({ error: "Firma ID gerekli" }, { status: 400 });
    }

    // Ana veri klasörü
    const dbDir = path.join(process.cwd(), "local_database");
    const firmalarDir = path.join(dbDir, "firmalar");
    const firmaDir = path.join(firmalarDir, String(firmaId));

    // Klasörleri oluştur (eğer yoksa)
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    if (!fs.existsSync(firmalarDir)) fs.mkdirSync(firmalarDir, { recursive: true });
    if (!fs.existsSync(firmaDir)) fs.mkdirSync(firmaDir, { recursive: true });

    // Veriyi kaydet (JSON olarak)
    const filePath = path.join(firmaDir, "kayit_bilgileri.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    // Sahte belgeler oluştur (dosyalama yapısını görmesi için)
    const vergiLevhasiPath = path.join(firmaDir, "vergi_levhasi_sistematik.txt");
    fs.writeFileSync(
      vergiLevhasiPath,
      `Bu dosya, sisteme yüklenen ve ${firmaId} koduyla şifrelenen örnek Vergi Levhası (PDF/JPG) verisini temsil eder.\n\nSistem VKN ile eşleştirme yapmıştır.\nFirma Adı: ${data.detay.firma.name}\nVergi No: ${data.detay.firma.tax_number}`,
      "utf-8"
    );

    const taahhutnamePath = path.join(firmaDir, "kullanici_sozlesmesi.txt");
    fs.writeFileSync(
      taahhutnamePath,
      "Kabul edilen kullanıcı ve KVKK sözleşmesi elektronik imza kayıtları.",
      "utf-8"
    );

    return NextResponse.json({ success: true, path: firmaDir });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
