import { MarketingLayout, MarketingHero, FeaturesGrid, CTASection, ComplianceBadges } from "./shared"
import { useLocale } from "@/contexts/locale-context"

export default function PlatformPage() {
  const { locale } = useLocale()
  const ar = locale === "ar"

  return (
    <MarketingLayout>
      <MarketingHero
        eyebrow={ar ? "المنصة" : "Platform"}
        title={ar ? "مركز القيادة الماليّ الواحد" : "One Financial Command Center"}
        subtitle={ar
          ? "نظام محاسبيّ متكامل وفق IFRS، يعمل فيه الذكاء الاصطناعيّ من الأساس — لا كإضافة سطحيّة. من أوّل فاتورة إلى آخر قائمة ماليّة جاهزة للتدقيق."
          : "A complete IFRS-compliant accounting system with AI at its core — not bolted on. From your first invoice to audit-ready financial statements."}
      />

      <ComplianceBadges items={["IFRS", "IFRS 15", "IFRS 16", "PEPPOL", "EN 16931"]} />

      <FeaturesGrid features={ar ? [
        { icon: "🧠", title: "ذكاء اصطناعيّ في القلب", description: "يقرأ الفاتورة، يصنّفها، يقترح القيد الصحيح وفق IFRS، ويتعلّم من تعديلاتك — دون تدخّل يدويّ." },
        { icon: "📊", title: "قوائم ماليّة فوريّة", description: "الميزانيّة العموميّة، قائمة الدخل، والتدفّقات النقديّة — جاهزة للتدقيق في لحظة." },
        { icon: "🌍", title: "حزم قُطريّة لـ MENA والعالم", description: "ضريبة القيمة المضافة، التأمينات الاجتماعيّة، مكافأة نهاية الخدمة — مُنمذَجة لكلّ حزمة قُطريّة." },
        { icon: "🔐", title: "أمان على مستوى المؤسّسات", description: "عزل بيانات بسياسات RLS، أسرار من جهة الخادم، TLS أثناء النقل، وأثر تدقيق لا يقبل التعديل. قيد التطوير — لم نحصل على شهادات بعد." },
        { icon: "🔗", title: "تكاملات عالميّة", description: "الفوترة الإلكترونيّة العالميّة (PEPPOL) متاحة اليوم؛ وقنوات البنوك والمدفوعات محاكاة تجريبيّة لا شراكات مباشرة." },
        { icon: "👥", title: "تعدّد الشركات والعملات", description: "أدر مجموعةً من الشركات في دول وعملات مختلفة — نظرة موحَّدة على الجميع." },
      ] : [
        { icon: "🧠", title: "AI at the core", description: "Reads invoices, classifies them, proposes correct IFRS entries, and learns from your corrections — no manual work." },
        { icon: "📊", title: "Instant financial statements", description: "Balance sheet, income statement, and cash flow — audit-ready in an instant." },
        { icon: "🌍", title: "MENA & global country packs", description: "VAT, social insurance, end-of-service — modeled per country pack." },
        { icon: "🔐", title: "Enterprise-grade security", description: "RLS data isolation, server-side secrets, TLS in transit, and an immutable audit trail. In development — not yet certified." },
        { icon: "🔗", title: "Global integrations", description: "Global e-invoicing (PEPPOL) today; bank and payment rails are simulated demos, not live partnerships." },
        { icon: "👥", title: "Multi-entity & currency", description: "Manage a group of companies across countries and currencies — consolidated view of all." },
      ]} />

      <CTASection
        title={ar ? "جاهز لتجربة المنصة؟" : "Ready to try the platform?"}
        subtitle={ar ? "ابدأ مجّاناً لمدة ١٤ يوماً. بدون بطاقة ائتمان." : "Start free for 14 days. No credit card required."}
        primaryLabel={ar ? "ابدأ مجّاناً" : "Start free"}
        primaryHref="/app"
        secondaryLabel={ar ? "تواصل معنا" : "Contact sales"}
        secondaryHref="/contact"
      />
    </MarketingLayout>
  )
}
