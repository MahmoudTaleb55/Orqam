import { MarketingLayout, MarketingHero } from "./shared"
import { useLocale } from "@/contexts/locale-context"

export default function PrivacyPage() {
  const { locale } = useLocale()
  const ar = locale === "ar"

  const sections = ar ? [
    {
      title: "١. البيانات التي نجمعها",
      body: "نجمع المعلومات التي تزوّدنا بها مباشرةً عند التسجيل، كالاسم والبريد الإلكترونيّ ومعلومات الشركة. نجمع أيضاً بيانات الاستخدام التقنيّة (عناوين IP، المتصفّح، توقيت الجلسات) لتحسين أداء المنصّة.",
    },
    {
      title: "٢. كيف نستخدم بياناتك",
      body: "نستخدم بياناتك لتقديم الخدمة وتحسينها، وإرسال الإشعارات المتعلّقة بحسابك، والتواصل معك بشأن التحديثات والعروض (يمكنك إلغاء الاشتراك في أيّ وقت). لا نبيع بياناتك لأيّ طرف ثالث بأيّ حال.",
    },
    {
      title: "٣. مشاركة البيانات",
      body: "قد نشارك بياناتك مع موفّري خدمات موثوقين يساعدوننا في تشغيل المنصّة (مثل البنية التحتيّة السحابيّة والمدفوعات)، وذلك بموجب اتفاقيّات سرّيّة صارمة. لن نشارك بياناتك مع أطراف ثالثة لأغراض تسويقيّة.",
    },
    {
      title: "٤. أمان البيانات",
      body: "نقدّم حركة البيانات عبر TLS 1.3 أثناء النقل، ونُبقي الأسرار على جهة الخادم. التشفير المُدار للبيانات المخزّنة على خارطة الطريق. نُجري مراجعات أمنيّة داخليّة دوريّة.",
    },
    {
      title: "٥. حقوقك",
      body: "يحقّ لك طلب الاطّلاع على بياناتك، تصحيحها، حذفها، أو تصديرها في أيّ وقت. يمكنك ممارسة هذه الحقوق عبر لوحة الإعدادات أو التواصل معنا على hello@orqam.example.",
    },
    {
      title: "٦. الاحتفاظ بالبيانات",
      body: "نحتفظ ببياناتك طوال مدّة اشتراكك وبعدها لمدّة ٩٠ يوماً تُتاح لك خلالها استعادتها. بعد ذلك تُحذَف نهائيّاً من أنظمتنا.",
    },
    {
      title: "٧. ملفّات تعريف الارتباط",
      body: "نستخدم ملفّات تعريف ارتباط ضروريّة لتشغيل المنصّة وتذكّر تفضيلاتك. يمكنك التحكّم في ملفّات الارتباط الاختياريّة من خلال إعدادات المتصفّح.",
    },
    {
      title: "٨. التغييرات على هذه السياسة",
      body: "سنُبلّغك بأيّ تغييرات جوهريّة على هذه السياسة عبر البريد الإلكترونيّ أو إشعار داخل التطبيق قبل نفاذها بـ ٣٠ يوماً على الأقلّ.",
    },
  ] : [
    {
      title: "1. Data we collect",
      body: "We collect information you provide directly when registering, such as name, email, and company details. We also collect technical usage data (IP addresses, browser, session timestamps) to improve platform performance.",
    },
    {
      title: "2. How we use your data",
      body: "We use your data to provide and improve the service, send account-related notifications, and communicate updates and offers (you can unsubscribe anytime). We never sell your data to any third party.",
    },
    {
      title: "3. Data sharing",
      body: "We may share your data with trusted service providers who help us run the platform (e.g., cloud infrastructure and payments), under strict confidentiality agreements. We will not share your data with third parties for marketing purposes.",
    },
    {
      title: "4. Data security",
      body: "We serve traffic over TLS 1.3 in transit and keep secrets server-side. Managed encryption at rest is on our roadmap. We run periodic internal security reviews.",
    },
    {
      title: "5. Your rights",
      body: "You may request access, correction, deletion, or export of your data at any time. Exercise these rights through the settings panel or by contacting us at hello@orqam.example.",
    },
    {
      title: "6. Data retention",
      body: "We retain your data for the duration of your subscription and 90 days afterward, during which you can recover it. After that, it is permanently deleted from our systems.",
    },
    {
      title: "7. Cookies",
      body: "We use necessary cookies to operate the platform and remember your preferences. You can control optional cookies through your browser settings.",
    },
    {
      title: "8. Changes to this policy",
      body: "We will notify you of any material changes to this policy by email or in-app notice at least 30 days before they take effect.",
    },
  ]

  return (
    <MarketingLayout>
      <MarketingHero
        eyebrow={ar ? "الخصوصيّة" : "Privacy"}
        title={ar ? "سياسة الخصوصيّة" : "Privacy Policy"}
        subtitle={ar
          ? "هذه سياسة نموذجيّة لنموذج أوّليّ طلّابيّ، وليست اتفاقيّة قانونيّة ملزِمة. تشرح ما نجمعه، كيف نستخدمه، وكيف نحميه."
          : "This is a sample policy for a student prototype, not a binding legal agreement. It explains what we collect, how we use it, and how we protect it."}
      />

      <div className="py-8 text-small text-muted-foreground mb-8">
        {ar ? "آخر تحديث: ١٥ مايو ٢٠٢٦" : "Last updated: May 15, 2026"}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 pb-16">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold text-foreground mb-3">{s.title}</h2>
            <p className="text-foreground/75 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </MarketingLayout>
  )
}
