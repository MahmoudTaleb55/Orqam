import { MarketingLayout, MarketingHero, FeaturesGrid, CTASection } from "./shared"
import { useLocale } from "@/contexts/locale-context"

export default function AboutPage() {
  const { locale } = useLocale()
  const ar = locale === "ar"

  return (
    <MarketingLayout>
      <MarketingHero
        eyebrow={ar ? "من نحن" : "About"}
        title={ar ? "مبنيّون للشركة الحديثة في كلّ مكان" : "Built for the modern business, everywhere"}
        subtitle={ar
          ? "فريق متعدّد الثقافات والجنسيّات، يؤمن بأنّ الشركات في منطقة الشرق الأوسط وشمال أفريقيا وخارجها تستحقّ نظاماً ماليّاً بمستوى ما يُستخدَم في فرانكفورت ونيويورك."
          : "A multicultural team that believes businesses in MENA and beyond deserve a financial system at the level of what's used in Frankfurt and New York."}
      />

      <div className="py-12">
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-10 text-center mb-12">
          <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto">
            {ar
              ? "نموذج أوّليّ بناه طلاب وفق أنماط الإنتاج — محاسبة وفق IFRS أوّلاً، متعدّد المستأجرين، ومدعوم بالذكاء الاصطناعيّ."
              : "A student-built prototype engineered to production patterns — IFRS-first, multi-tenant, AI-assisted."}
          </p>
        </div>
      </div>

      <FeaturesGrid features={ar ? [
        { icon: "🎯", title: "مهمّتنا", description: "نجعل الإدارة الماليّة الاحترافيّة في متناول كلّ شركة — بصرف النظر عن حجمها أو موقعها." },
        { icon: "👁️", title: "رؤيتنا", description: "عالَم تعمل فيه الشركات الصغيرة والمتوسّطة بنفس كفاءة المؤسّسات الكبرى ماليّاً." },
        { icon: "🌍", title: "تنوّعنا", description: "فريقنا من أكثر من ١٢ جنسيّة. نبني لعالَم متعدّد اللغات والثقافات لأنّنا نُجسّده بأنفسنا." },
        { icon: "🔬", title: "منهجيّتنا", description: "كلّ ميزة تبدأ بسؤال: هل تُحلّ مشكلة حقيقيّة؟ ثمّ نُصمّمها وفق أدقّ المعايير الدوليّة." },
        { icon: "🤝", title: "منهجيّتنا تجاه المعايير", description: "نُصمّم كلّ ميزة وفق معايير IFRS وقواعد الحزم المحليّة؛ ولا ندّعي شراكاتٍ لا نملكها." },
        { icon: "🔐", title: "التزامنا بالأمان", description: "عزل بيانات بسياسات RLS، أسرار من جهة الخادم، وأثر تدقيق لا يقبل التعديل — قيد التطوير، ولم نحصل على شهادات بعد." },
      ] : [
        { icon: "🎯", title: "Our mission", description: "Make professional financial management accessible to every company — regardless of size or location." },
        { icon: "👁️", title: "Our vision", description: "A world where SMBs operate with the same financial efficiency as large enterprises." },
        { icon: "🌍", title: "Our diversity", description: "Our team comes from 12+ nationalities. We build for a multilingual world because we embody it ourselves." },
        { icon: "🔬", title: "Our approach", description: "Every feature starts with a question: does it solve a real problem? Then we design it to the strictest international standards." },
        { icon: "🤝", title: "Our approach to standards", description: "We design each feature to IFRS and local-pack rules; we don't claim partnerships we don't have." },
        { icon: "🔐", title: "Our security commitment", description: "RLS data isolation, server-side secrets, and an immutable audit trail — in development, not yet certified." },
      ]} />

      <CTASection
        title={ar ? "انضم إلى مجتمع المحاسبة الذكيّة" : "Join the smart accounting community"}
        primaryLabel={ar ? "ابدأ مجّاناً" : "Start free"}
        primaryHref="/app"
        secondaryLabel={ar ? "تواصل معنا" : "Contact us"}
        secondaryHref="/contact"
      />
    </MarketingLayout>
  )
}
