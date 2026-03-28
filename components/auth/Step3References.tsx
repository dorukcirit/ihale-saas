"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { referanslarVeMaliSemasi, type FormReferans } from "@/lib/validations";
import { Plus, Trash2, ArrowLeft, ArrowRight, UserCheck, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

interface Props {
  varsayilan: {
    references?: FormReferans[];
    balance_sheet?: string;
    balance_sheet_shared: boolean;
    risk_report?: string;
    risk_report_shared: boolean;
  };
  onBack: () => void;
  onSubmit: (data: any) => void;
}

const KATEGORI_AGACI = [
  { id: "1", name: "Zemin ve Altyapı Taşeronları (Ağır İşler)" },
  { id: "2", name: "Kaba Yapı Taşeronları" },
  { id: "3", name: "Dış Cephe ve Çatı Taşeronları (Kabuk)" },
  { id: "4", name: "İnce İnşaat ve Dekorasyon Taşeronları (İç Mekan)" },
  { id: "5", name: "Mekanik, Elektrik ve Asansör (MEP)" },
  { id: "6", name: "Peyzaj ve Çevre Düzenleme Taşeronları" },
  { id: "7", name: "Tamamlayıcı ve Yardımcı Taşeronlar" },
];

export default function Step3References({ varsayilan, onBack, onSubmit }: Props) {
  // Ensure we have at least 5 default empty rows to enforce the min 5 rule visually
  const defaultRefs = varsayilan.references && varsayilan.references.length >= 5 
    ? varsayilan.references 
    : Array(5).fill({ employer: "", project_name: "", project_location: "", project_date: "", scope: "", category_id: "" });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(referanslarVeMaliSemasi),
    defaultValues: { 
      references: defaultRefs,
      balance_sheet_shared: varsayilan.balance_sheet_shared || false,
      risk_report_shared: varsayilan.risk_report_shared || false
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "references",
  });

  const watchBalanceShared = watch("balance_sheet_shared");
  const watchRiskShared = watch("risk_report_shared");

  const submitGecisi = (data: any) => {
    onSubmit(data);
  };

  const inputStyle = (hata: boolean): React.CSSProperties => ({
    width: "100%", height: 42, padding: "0 14px",
    background: "var(--steel-50)",
    border: `1px solid ${hata ? "var(--accent-red)" : "var(--steel-200)"}`,
    borderRadius: 8, color: "var(--navy-900)", fontSize: "0.85rem",
    outline: "none", transition: "all 0.2s", boxSizing: "border-box",
  });

  return (
    <form onSubmit={handleSubmit(submitGecisi)} style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      <div style={{ background: "rgba(30, 77, 140, 0.04)", border: "1px solid var(--navy-100)", borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <UserCheck size={18} color="var(--navy-500)" />
          Referanslar <span style={{ color: "var(--accent-red)" }}>*</span>
        </h3>
        <p style={{ color: "var(--steel-500)", fontSize: "0.85rem", marginBottom: 16 }}>
          Lütfen son 5 yıl içinde tamamladığınız en az 5 adet projeyi giriniz. Bu bilgiler, ihale değerlendirmelerinde yeterliliğiniz için kritik öneme sahiptir.
        </p>

        {fields.map((field, index) => (
          <div key={field.id} style={{
            background: "white", padding: 20, borderRadius: 12, marginBottom: 16,
            border: "1px solid var(--steel-200)", position: "relative"
          }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--navy-700)", marginBottom: 12 }}>{index + 1}. Referans Proje</h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>İşveren</label>
                <input {...register(`references.${index}.employer`)} placeholder="Örn: X İnşaat A.Ş." style={inputStyle(!!errors?.references?.[index]?.employer)} />
                {errors?.references?.[index]?.employer && <p className="form-error" style={{ fontSize: "0.7rem" }}>{errors.references[index]?.employer?.message}</p>}
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Proje Adı</label>
                <input {...register(`references.${index}.project_name`)} placeholder="Örn: Yılmaz Plaza" style={inputStyle(!!errors?.references?.[index]?.project_name)} />
                {errors?.references?.[index]?.project_name && <p className="form-error" style={{ fontSize: "0.7rem" }}>{errors.references[index]?.project_name?.message}</p>}
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Proje Yeri</label>
                <input {...register(`references.${index}.project_location`)} placeholder="Örn: İstanbul, Türkiye" style={inputStyle(!!errors?.references?.[index]?.project_location)} />
                {errors?.references?.[index]?.project_location && <p className="form-error" style={{ fontSize: "0.7rem" }}>{errors.references[index]?.project_location?.message}</p>}
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Proje Tarihi (Tamamlanma Yılı/Ayı)</label>
                <input type="month" {...register(`references.${index}.project_date`)} style={inputStyle(!!errors?.references?.[index]?.project_date)} />
                {errors?.references?.[index]?.project_date && <p className="form-error" style={{ fontSize: "0.7rem" }}>{errors.references[index]?.project_date?.message}</p>}
              </div>
              <div style={{ gridColumn: "1 / -1", display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
                <div>
                  <label className="form-label" style={{ fontSize: "0.8rem" }}>İşin Kapsamı</label>
                  <input {...register(`references.${index}.scope`)} placeholder="Örn: 50.000m2 kaba yapı işleri" style={inputStyle(!!errors?.references?.[index]?.scope)} />
                  {errors?.references?.[index]?.scope && <p className="form-error" style={{ fontSize: "0.7rem" }}>{errors.references[index]?.scope?.message}</p>}
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "0.8rem" }}>Kategori</label>
                  <select {...register(`references.${index}.category_id`)} style={inputStyle(!!errors?.references?.[index]?.category_id)}>
                    <option value="">Seçiniz</option>
                    {/* Dummy UUIDs or real mapping to UI */}
                    <option value="a1000000-0000-0000-0000-000000000001">Zemin ve Altyapı Taşeronları</option>
                    <option value="a1000000-0000-0000-0000-000000000002">Kaba Yapı Taşeronları</option>
                    <option value="a1000000-0000-0000-0000-000000000003">Dış Cephe ve Çatı Taşeronları</option>
                    <option value="a1000000-0000-0000-0000-000000000004">İnce İnşaat ve Dekorasyon Taşeronları</option>
                    <option value="a1000000-0000-0000-0000-000000000005">Mekanik, Elektrik ve Asansör</option>
                  </select>
                  {errors?.references?.[index]?.category_id && <p className="form-error" style={{ fontSize: "0.7rem" }}>{errors.references[index]?.category_id?.message}</p>}
                </div>
              </div>
            </div>

            {fields.length > 5 && (
              <button type="button" onClick={() => remove(index)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--accent-red)", cursor: "pointer", padding: 4, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        {errors.references?.root?.message && <p className="form-error" style={{ marginBottom: 16, textAlign: 'center', fontSize: '0.9rem' }}>{errors.references.root.message}</p>}

        <button type="button" onClick={() => append({ employer: "", project_name: "", project_location: "", project_date: "", scope: "", category_id: "" })}
          style={{ width: "100%", padding: "12px", background: "white", border: "1px dashed var(--navy-300)", color: "var(--navy-600)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}>
          <Plus size={18} /> Yeni Referans Ekle
        </button>
      </div>

      <div style={{ background: "rgba(16, 185, 129, 0.04)", border: "1px solid var(--accent-green)", borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={18} color="var(--accent-green)" />
          Güven ve Risk Raporları (Opsiyonel)
        </h3>
        <p style={{ color: "var(--steel-500)", fontSize: "0.85rem", marginBottom: 20 }}>
          Ekleyeceğiniz bilanço ve risk raporları sizi daha güvenilir bir çözüm ortağı yapacaktır. Sadece tarafınızca onay verilmesi halinde ihale sahipleri ile paylaşılır.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Bilanço */}
          <div>
            <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Cari Bilanço Özeti</label>
            <div style={{ background: "white", border: "1px dashed var(--steel-300)", padding: 16, borderRadius: 12, textAlign: "center", cursor: "pointer", marginBottom: 12 }}>
              <FileText size={24} color="var(--steel-400)" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: "0.8rem", color: "var(--steel-500)" }}>PDF/JPG yüklemek için tıklayın</p>
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <div style={{ paddingTop: 2 }}>
                <input type="checkbox" {...register("balance_sheet_shared")} style={{ width: 16, height: 16, accentColor: "var(--accent-green)" }} />
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--steel-600)", lineHeight: 1.4 }}>
                Bilanço verilerimin yalnızca ilgili olduğum ihale sahipleri ve yetkili tedarikçilerle paylaşılmasını onaylıyorum.
              </span>
            </label>
          </div>

          {/* Risk Raporu */}
          <div>
            <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Risk Raporu / Teminat Durumu</label>
            <div style={{ background: "white", border: "1px dashed var(--steel-300)", padding: 16, borderRadius: 12, textAlign: "center", cursor: "pointer", marginBottom: 12 }}>
              <FileText size={24} color="var(--steel-400)" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: "0.8rem", color: "var(--steel-500)" }}>PDF/JPG yüklemek için tıklayın</p>
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <div style={{ paddingTop: 2 }}>
                <input type="checkbox" {...register("risk_report_shared")} style={{ width: 16, height: 16, accentColor: "var(--accent-green)" }} />
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--steel-600)", lineHeight: 1.4 }}>
                Risk raporumun yalnızca ilgili olduğum ihale sahipleri ve yetkili tedarikçilerle paylaşılmasını onaylıyorum.
              </span>
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <button type="button" onClick={onBack} className="btn-secondary" style={{ flex: 1 }}>
          <ArrowLeft size={18} /> Geri Dön
        </button>
        <button type="submit" className="btn-primary" style={{ flex: 2 }}>
          Kaydı Tamamla <CheckCircle2 size={18} />
        </button>
      </div>
    </form>
  );
}
