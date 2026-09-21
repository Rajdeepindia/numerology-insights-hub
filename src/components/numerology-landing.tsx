import { useState, type FormEvent, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Compass,
  Gem,
  Heart,
  LockKeyhole,
  Menu,
  MoonStar,
  Orbit,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@/assets/numerology-hero.jpg";
import consultantImage from "@/assets/consultant-placeholder.jpg";

type LeadData = {
  name: string;
  phone: string;
  email: string;
  reason_for_report: string;
};

type Errors = Partial<Record<keyof LeadData, string>>;

const benefits = [
  ["Core Numerology Numbers", "Explore the key numbers derived from your birth information.", Orbit],
  ["Personality Insights", "Understand patterns associated with your personality and natural tendencies.", UserRound],
  ["Career & Business Insights", "Explore areas of professional strength and potential direction.", BriefcaseBusiness],
  ["Relationship Insights", "Discover numerological perspectives around relationships and compatibility.", Heart],
  ["Strengths & Growth Areas", "Identify patterns that may support thoughtful personal development.", Sparkles],
  ["Personal Cycles", "Explore interpretations of important personal cycles and changing seasons.", MoonStar],
] as const;

const services = [
  ["Detailed Numerology Consultation", "A deeper one-on-one numerology session."],
  ["Career & Business Numerology", "Explore perspectives around professional and business direction."],
  ["Relationship Compatibility", "A considered numerology-based compatibility reading."],
  ["Name Analysis", "Explore the numerological interpretations within names."],
  ["Detailed Numerology Report", "A more comprehensive personalized written report."],
] as const;

const faqs = [
  ["What is numerology?", "Numerology is a reflective practice that interprets symbolic patterns connected with numbers, names and birth information. It can offer a fresh perspective, but it does not determine your future."],
  ["What information do I need to provide?", "For your initial request, share your name, phone number, email address and what you would like guidance about. Any additional birth details can be collected securely when your report is prepared."],
  ["How will I receive my free report?", "We will contact you using the details you provide and confirm the best way to share your personalized report."],
  ["Is numerology a guaranteed prediction of the future?", "No. Numerology is intended for reflection and guidance. It cannot guarantee events, outcomes or future results."],
  ["Is my information private?", "Your information is used only to respond to your request and prepare your report. It is not intended for unrelated use."],
  ["Can I book a detailed consultation later?", "Yes. After exploring your free report, you can choose a deeper consultation if it feels useful to you."],
  ["How long does it take to receive the report?", "Preparation time depends on the details shared. We will confirm an expected timeline when we contact you."],
] as const;

const perspectiveCards: ReadonlyArray<readonly [string, string, LucideIcon]> = [
  ["Career & Direction", "Explore patterns connected to your strengths, interests and professional direction.", Compass],
  ["Relationships", "Understand personality patterns and compatibility through numerological interpretation.", Heart],
  ["Personal Growth", "Reflect on your strengths, challenges and recurring patterns.", Sparkles],
  ["Business & Decisions", "Explore perspectives around business identity and important decisions.", BriefcaseBusiness],
];

const trustItems: ReadonlyArray<readonly [string, LucideIcon]> = [
  ["Personalized interpretation", Gem],
  ["Confidential information handling", LockKeyhole],
  ["Clear, transparent process", Compass],
  ["Human consultation", UsersRound],
  ["Thoughtful analysis", Sparkles],
  ["No exaggerated promises", ShieldCheck],
];

function validate(data: LeadData): Errors {
  const errors: Errors = {};
  if (data.name.trim().length < 2) errors.name = "Please enter your name.";
  const digits = data.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) errors.phone = "Please enter a valid phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Please enter a valid email address.";
  if (data.reason_for_report.trim().length < 10) errors.reason_for_report = "Please tell us what you'd like guidance on.";
  return errors;
}

function LeadCaptureModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [data, setData] = useState<LeadData>({ name: "", phone: "", email: "", reason_for_report: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const update = (field: keyof LeadData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(data);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setStatus("submitting");
    try {
      await Promise.resolve();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const close = () => {
    onOpenChange(false);
    window.setTimeout(() => {
      setStatus("idle");
      setErrors({});
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border-border/80 bg-card p-5 shadow-2xl sm:p-8">
        {status === "success" ? (
          <div className="py-8 text-center" role="status" aria-live="polite">
            <span className="mx-auto grid size-16 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary"><Check className="size-7" /></span>
            <DialogTitle className="mt-6 font-display text-3xl text-foreground">You're All Set <span aria-hidden="true">✦</span></DialogTitle>
            <DialogDescription className="mx-auto mt-3 max-w-sm text-base leading-7 text-muted-foreground">
              Thank you, {data.name.trim()}. We've received your request and will use the details you shared to prepare your personalized report.
            </DialogDescription>
            <p className="mt-5 text-sm text-foreground">We'll contact you using the details you provided.</p>
            <Button onClick={close} size="lg" className="mt-7 min-h-12 w-full sm:w-auto">Close</Button>
          </div>
        ) : (
          <>
            <div className="pr-8">
              <p className="section-kicker">Your complimentary reading</p>
              <DialogTitle className="mt-2 font-display text-2xl leading-tight text-foreground sm:text-3xl">Get Your Free Personalized Numerology Report</DialogTitle>
              <DialogDescription className="mt-3 leading-6 text-muted-foreground">
                Share a few details and tell us what you'd like to understand better. Your report will be prepared from the information you provide.
              </DialogDescription>
            </div>
            <form className="mt-2 space-y-4" onSubmit={submit} noValidate>
              <FormField id="name" label="Full Name" error={errors.name}>
                <Input id="name" name="name" autoComplete="name" autoFocus value={data.name} onChange={(event) => update("name", event.target.value)} placeholder="Enter your full name" className="h-12 bg-background/60" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} maxLength={100} />
              </FormField>
              <FormField id="phone" label="Phone Number" error={errors.phone}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)]">
                  <span className="grid h-12 place-items-center rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm text-muted-foreground">+91</span>
                  <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Enter your phone number" className="h-12 rounded-l-none bg-background/60" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} maxLength={14} />
                </div>
              </FormField>
              <FormField id="email" label="Email Address" error={errors.email}>
                <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={data.email} onChange={(event) => update("email", event.target.value)} placeholder="Enter your email address" className="h-12 bg-background/60" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} maxLength={255} />
              </FormField>
              <FormField id="reason_for_report" label="Why would you like to receive your free numerology report?" error={errors.reason_for_report}>
                <Textarea id="reason_for_report" name="reason_for_report" value={data.reason_for_report} onChange={(event) => update("reason_for_report", event.target.value)} placeholder="Tell us what you’re currently looking for clarity or guidance about—career, relationships, business, personal growth, or any specific question you’d like to explore." className="min-h-28 resize-y bg-background/60" aria-invalid={Boolean(errors.reason_for_report)} aria-describedby={errors.reason_for_report ? "reason_for_report-error" : "reason-help"} maxLength={500} />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span id="reason-help">Share at least a short sentence.</span><span>{data.reason_for_report.length}/500</span></div>
              </FormField>
              {status === "error" && <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">Something went wrong while submitting your request. Please try again.</div>}
              <Button type="submit" size="lg" className="min-h-12 w-full" disabled={status === "submitting"}>
                {status === "submitting" ? "Preparing your request…" : status === "error" ? "Try Again" : "Get My Free Numerology Report"}
                {status !== "submitting" && <ArrowRight />}
              </Button>
              <p className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-muted-foreground"><LockKeyhole className="mt-0.5 size-3.5 shrink-0" />Your information is kept private and used only to provide your requested report.</p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FormField({ id, label, error, children }: { id: string; label: string; error: string | undefined; children: ReactNode }) {
  return <div><Label htmlFor={id} className="mb-2 block text-foreground">{label}</Label>{children}{error && <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive" role="alert">{error}</p>}</div>;
}

function SectionHeading({ kicker, title, copy, center = false }: { kicker: string; title: string; copy?: string; center?: boolean }) {
  return <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}><p className="section-kicker">{kicker}</p><h2 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>{copy && <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">{copy}</p>}</div>;
}

function Navbar({ openReport }: { openReport: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [["Home", "#home"], ["How It Works", "#how-it-works"], ["About", "#about"], ["Services", "#services"], ["FAQ", "#faq"]] as const;
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <nav className="container-shell grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center" aria-label="Main navigation">
        <a href="#home" className="flex min-w-0 items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary/50 bg-primary/10 text-primary"><Orbit className="size-5" /></span>
          <span className="truncate font-display text-xl text-foreground">NUMINA</span>
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map(([label, href]) => <a key={href} href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</a>)}
          <Button size="sm" onClick={openReport}>Get Free Report</Button>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((current) => !current)} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"}>{mobileOpen ? <X /> : <Menu />}</Button>
      </nav>
      {mobileOpen && <div id="mobile-menu" className="border-t border-border bg-background px-4 py-4 lg:hidden"><div className="mx-auto flex max-w-7xl flex-col">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileOpen(false)} className="flex min-h-12 items-center border-b border-border/60 text-sm text-foreground">{label}</a>)}<Button className="mt-4 min-h-12 w-full" onClick={() => { setMobileOpen(false); openReport(); }}>Get My Free Numerology Report</Button></div></div>}
    </header>
  );
}

export function NumerologyLanding() {
  const [modalOpen, setModalOpen] = useState(false);
  const openReport = () => setModalOpen(true);
  return (
    <div className="overflow-x-clip bg-background text-foreground">
      <Navbar openReport={openReport} />
      <main>
        <section id="home" className="relative flex min-h-[92svh] items-end overflow-hidden pt-24">
          <img src={heroImage} alt="Celestial numerology wheel formed from delicate numbers and geometric orbits" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[66%_center]" />
          <div className="hero-veil absolute inset-0" />
          <div className="container-shell relative z-10 pb-16 pt-24 sm:pb-24 lg:pb-28 lg:pt-32">
            <div className="max-w-2xl">
              <p className="section-kicker">Personalized numerology • thoughtfully interpreted</p>
              <h1 className="mt-5 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">Discover What Your Numbers <span className="text-primary">Reveal About You</span></h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-foreground/75 sm:text-lg">Get a personalized numerology report designed to help you explore your personality, strengths, relationships, career direction and important life cycles.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={openReport} className="min-h-12 px-6">Get My Free Numerology Report <ArrowRight /></Button>
                <Button variant="outline" size="lg" asChild className="min-h-12 border-foreground/20 bg-background/20 px-6 backdrop-blur-sm"><a href="#how-it-works">Explore How It Works <ChevronRight /></a></Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-foreground/65"><span className="flex items-center gap-2"><Check className="size-3.5 text-primary" />Personalized insights</span><span className="flex items-center gap-2"><Check className="size-3.5 text-primary" />Private & confidential</span><span className="flex items-center gap-2"><Check className="size-3.5 text-primary" />No guaranteed claims</span></div>
            </div>
          </div>
        </section>

        <section className="section-space border-y border-border bg-secondary/40">
          <div className="container-shell">
            <SectionHeading kicker="A new point of view" title="Sometimes, You Just Need a Different Perspective." copy="There are moments when you feel uncertain about your next step, your relationships, your career, or the direction you're taking in life. Numerology offers another way to reflect on your patterns, strengths and personal cycles." />
            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {perspectiveCards.map(([title, copy, Icon]) => <article key={title} className="bg-card p-6 sm:p-7"><Icon className="size-6 text-primary" /><h3 className="mt-6 font-display text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="container-shell">
            <SectionHeading center kicker="Inside your free report" title="Your Numbers. Your Patterns. Your Personalized Report." copy="Discover insights based on your birth details and the questions that matter most to you." />
            <div className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map(([title, copy, Icon], index) => <article key={title} className="group grid grid-cols-[auto_minmax(0,1fr)] gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"><Icon className="size-5" /></span><div className="min-w-0"><p className="mb-2 text-xs text-primary">0{index + 1}</p><h3 className="font-display text-xl">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div></article>)}
            </div>
            <div className="mt-12 text-center"><Button size="lg" onClick={openReport} className="min-h-12">Get My Free Numerology Report <ArrowRight /></Button></div>
          </div>
        </section>

        <section id="how-it-works" className="section-space border-y border-border bg-secondary/40">
          <div className="container-shell"><SectionHeading center kicker="A simple, human process" title="Your Free Report in 3 Simple Steps" />
            <div className="relative mt-12 grid gap-5 md:grid-cols-3">
              <div className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-border md:block" />
              {[["01", "Share Your Details", "Enter your name, phone number, email and what you'd like guidance on."], ["02", "We Prepare Your Report", "Your information is used to create a personalized numerology interpretation."], ["03", "Receive Your Insights", "Get your report and explore the insights relevant to your questions."]].map(([number, title, copy]) => <article key={number} className="relative border-l border-border pl-6 md:border-l-0 md:pt-16 md:text-center"><span className="absolute -left-5 top-0 z-10 grid size-10 place-items-center rounded-full border border-primary/50 bg-secondary font-display text-sm text-primary md:left-1/2 md:-translate-x-1/2">{number}</span><h3 className="font-display text-xl">{title}</h3><p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="container-shell grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div><SectionHeading kicker="A glimpse inside" title="A Report Designed Around You" copy="Clear, structured insights turn symbolic number patterns into useful prompts for reflection." /><ul className="mt-7 space-y-3 text-sm text-muted-foreground">{["Your core numbers explained", "Insights connected to your questions", "Balanced, non-deterministic guidance"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul></div>
            <article className="report-sheet relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-2xl sm:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-border pb-5"><div><p className="section-kicker">Sample Report Preview</p><h3 className="mt-2 font-display text-2xl">Aditi Sharma</h3></div><Orbit className="size-9 text-primary" /></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3"><ReportNumber label="Life Path" number="7" /><ReportNumber label="Expression" number="3" /><ReportNumber label="Personal Cycle" number="9" /></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">{[["Personality insights", "Reflective, observant and drawn toward deeper understanding."], ["Career insights", "Patterns may favor research, analysis and thoughtful creative work."], ["Relationship insights", "Values trust, meaningful conversation and personal space."], ["Key observation", "Balance contemplation with consistent outward action."]].map(([title, copy]) => <div key={title} className="border-l border-primary/40 pl-4"><h4 className="text-sm font-medium">{title}</h4><p className="mt-1 text-xs leading-5 text-muted-foreground">{copy}</p></div>)}</div>
            </article>
          </div>
        </section>

        <section className="section-space border-y border-border bg-secondary/40">
          <div className="container-shell"><SectionHeading center kicker="Made for thoughtful seekers" title="Is This Report Right For You?" />
            <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">{["People exploring career direction", "People seeking personal clarity", "Entrepreneurs and business owners", "People interested in relationships", "People exploring personal growth", "People curious about numerology"].map((item) => <div key={item} className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-4 text-sm"><Star className="size-4 shrink-0 text-primary" />{item}</div>)}</div>
          </div>
        </section>

        <section id="about" className="section-space">
          <div className="container-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div className="relative mx-auto w-full max-w-md"><div className="absolute -inset-3 rounded-lg border border-primary/20" /><img src={consultantImage} alt="Placeholder portrait for your numerology consultant" width={1024} height={1280} loading="lazy" className="relative aspect-[4/5] w-full rounded-lg object-cover" /><span className="absolute bottom-4 left-4 rounded-md border border-border bg-background/90 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">Consultant portrait placeholder</span></div>
            <div><SectionHeading kicker="Guidance • Reflection • Perspective" title="Meet Your Numerology Consultant" copy="Your consultant introduction will appear here. Share your experience, philosophy and the thoughtful approach you bring to every reading." /><div className="mt-8 grid gap-5 sm:grid-cols-2"><div className="border-l border-primary/40 pl-4"><h3 className="font-display text-lg">A human approach</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Interpretation grounded in listening, context and your personal questions.</p></div><div className="border-l border-primary/40 pl-4"><h3 className="font-display text-lg">Empowering guidance</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Insights designed to support reflection—not prescribe or guarantee outcomes.</p></div></div></div>
          </div>
        </section>

        <section className="section-space border-y border-border bg-secondary/40">
          <div className="container-shell"><SectionHeading center kicker="Trust, without theatrics" title="A Clear and Considered Experience" />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{trustItems.map(([title, Icon]) => <div key={title} className="flex items-center gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-primary"><Icon className="size-4" /></span><h3 className="text-sm font-medium">{title}</h3></div>)}</div>
          </div>
        </section>

        <section className="section-space">
          <div className="container-shell"><SectionHeading kicker="Client experiences" title="Stories Shared With Permission" copy="We only publish genuine feedback from real clients." />
            <div className="mt-10 grid gap-5 md:grid-cols-3">{[1,2,3].map((item) => <blockquote key={item} className="rounded-lg border border-dashed border-border bg-card p-6"><p className="font-display text-lg text-muted-foreground">“Your real client testimonial will appear here.”</p><footer className="mt-5 text-xs uppercase text-primary">Verified testimonial placeholder</footer></blockquote>)}</div>
          </div>
        </section>

        <section id="services" className="section-space border-y border-border bg-secondary/40">
          <div className="container-shell"><SectionHeading kicker="Go deeper, when you're ready" title="Want a Deeper Reading?" copy="Choose a more focused interpretation after your free report. Pricing will be added when your service details are finalized." />
            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">{services.map(([title, copy]) => <article key={title} className="flex min-h-60 flex-col bg-card p-6"><h3 className="font-display text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p><p className="mt-5 text-sm font-medium text-primary">Price to be confirmed</p><div className="mt-auto flex items-center gap-2 pt-6"><Button variant="outline" size="sm">Learn More</Button><Button variant="ghost" size="sm" onClick={openReport}>Book Consultation</Button></div></article>)}</div>
          </div>
        </section>

        <section id="faq" className="section-space">
          <div className="container-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><SectionHeading kicker="Clear answers" title="Frequently Asked Questions" copy="Everything you need to know before requesting your first report." /><Accordion type="single" collapsible className="border-t border-border">{faqs.map(([question, answer], index) => <AccordionItem value={`faq-${index}`} key={question}><AccordionTrigger className="py-5 text-base hover:no-underline">{question}</AccordionTrigger><AccordionContent className="max-w-2xl pb-5 leading-6 text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></div>
        </section>

        <section className="relative overflow-hidden border-y border-primary/20 py-20 sm:py-24"><div className="cta-aura absolute inset-0" /><div className="container-shell relative text-center"><p className="section-kicker">Begin with curiosity</p><h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">Curious About What Your Numbers Reveal?</h2><p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">Start with your free personalized numerology report and explore the insights your numbers may offer.</p><Button size="lg" onClick={openReport} className="mt-8 min-h-12">Get My Free Numerology Report <ArrowRight /></Button></div></section>
      </main>

      <footer className="bg-card py-12">
        <div className="container-shell"><div className="grid gap-10 border-b border-border pb-10 sm:grid-cols-2 lg:grid-cols-4"><div><a href="#home" className="flex items-center gap-3 font-display text-xl"><Orbit className="size-6 text-primary" />NUMINA</a><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">Personalized numerology for thoughtful reflection, perspective and self-discovery.</p></div><FooterLinks title="Navigate" links={[["How It Works", "#how-it-works"], ["About", "#about"], ["Services", "#services"], ["FAQ", "#faq"]]} /><FooterLinks title="Services" links={[["Free Numerology Report", "#home"], ["Career Numerology", "#services"], ["Relationship Reading", "#services"], ["Name Analysis", "#services"]]} /><div><h3 className="text-sm font-medium">Contact</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">Contact details will be added here.</p><div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground"><a href="#privacy">Privacy Policy</a><a href="#terms">Terms & Conditions</a></div></div></div><p id="privacy" className="pt-7 text-xs leading-5 text-muted-foreground">Numerology is intended for personal reflection, guidance and entertainment. It should not be considered a substitute for professional medical, legal, financial or mental-health advice, and no specific outcome is guaranteed.</p><p className="mt-5 text-xs text-muted-foreground">© 2026 NUMINA. All rights reserved.</p></div>
      </footer>
      <LeadCaptureModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

function ReportNumber({ label, number }: { label: string; number: string }) { return <div className="rounded-md border border-border bg-secondary/60 p-4 text-center"><span className="font-display text-4xl text-primary">{number}</span><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>; }

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) { return <div><h3 className="text-sm font-medium">{title}</h3><ul className="mt-4 space-y-3">{links.map(([label, href]) => <li key={label}><a href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</a></li>)}</ul></div>; }