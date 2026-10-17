import { MarketingLayout, MarketingHero, CTASection } from "./shared"
import { useLocale } from "@/contexts/locale-context"

const SEGMENTS = [
  {
    icon: "🚀",
    titleAr: "الشركات الناشئة والصغيرة والمتوسّطة", titleEn: "SMEs & startups",
    descAr: "محاسبة وفق IFRS تنمو مع عملك دون تعقيد أنظمة ERP التقليديّة.",
    descEn: "IFRS-first accounting that scales with your business, without the complexity of legacy ERP.",
  },
  {
    icon: "📊",
    titleAr: "الفرق الماليّة", titleEn: "Finance teams",
    descAr: "أتمتة الاعتمادات وإدخال البيانات وسير المستندات، مع أثر تدقيق لكلّ تغيير.",
    descEn: "Automate approvals, data entry, and document workflow, with an audit trail on every change.",
  },
  {
    icon: "🏢",
    titleAr: "المؤسّسات متعدّدة الكيانات", titleEn: "Multi-entity groups",
    descAr: "توحيد متعدّد الكيانات وفق IFRS 10 ورؤية موحّدة عبر الشركات.",
    descEn: "IFRS 10 multi-entity consolidation and a unified view across companies.",
  },
  {
    icon: "🌍",
    titleAr: "أسواق MENA والعالم", titleEn: "MENA & global",
    descAr: "حزم قُطريّة لمنطقة الشرق الأوسط وشمال أفريقيا وأسواق عالميّة.",
    descEn: "Country packs for MENA and global markets.",
  },
]

export default function CustomersPage() {
  const { locale } = useLocale()
  const ar = locale === "ar"

  return (
    <MarketingLayout>
      <MarketingHero
        eyebrow={ar ? "العملاء" : "Customers"}
        title={ar ? "لِمن بُني أرقام" : "Who Orqam is built for"}
        subtitle={ar
          ? "من ناشئات القطاع التقنيّ إلى مجموعات متعدّدة الكيانات — أرقام يعمل حيث تعمل أنت."
          : "From tech startups to multi-entity groups — Orqam works where you work."}
      />

      <section className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEGMENTS.map((s) => (
            <div key={s.titleEn} className="rounded-xl border border-card-border bg-card p-6">
              <div className="text-3xl mb-4">{s.icon}</div>
              <div className="font-semibold text-foreground mb-2">{ar ? s.titleAr : s.titleEn}</div>
              <p className="text-small text-muted-foreground leading-relaxed">{ar ? s.descAr : s.descEn}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        title={ar ? "ابدأ اليوم" : "Start today"}
        subtitle={ar ? "ابدأ مجّاناً لمدة ١٤ يوماً. بدون بطاقة ائتمان." : "Start free for 14 days. No credit card required."}
        primaryLabel={ar ? "ابدأ مجّاناً" : "Start free"}
        primaryHref="/app"
        secondaryLabel={ar ? "تواصل مع فريق المبيعات" : "Talk to sales"}
        secondaryHref="/contact"
      />
    </MarketingLayout>
  )
}
