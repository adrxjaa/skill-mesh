import { ArrowRight, Users, Target, Rocket, Zap, Bookmark } from "lucide-react";

function Home() {
  return (
    <main className="min-h-screen bg-surface text-on-surface">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Full-bleed gradient backdrop */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {/* Top orange glow */}
          <div className="absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(242,113,33,0.22)_0%,transparent_70%)]" />
          {/* Soft secondary glow */}
          <div className="absolute left-[10%] top-[15%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
          {/* Horizontal gradient line at top */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[85vh] max-w-[1600px] flex-col items-center justify-center px-8 lg:px-12 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2.5 rounded-full border border-surface-container-high bg-surface-container-low/60 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-on-surface-variant backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            V2.0 Beta Live
          </span>

          {/* Headline */}
          <h1 className="mt-10 max-w-4xl font-heading text-5xl font-bold leading-[1.1] tracking-tight text-on-surface sm:text-6xl md:text-7xl">
            Built for builders who need a{" "}
            <span className="bg-gradient-to-r from-primary to-[#FF9A5C] bg-clip-text text-transparent">
              team.
            </span>
          </h1>

          {/* Sub-copy */}
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Stop swiping on generic profiles. SkillMesh uses semantic matching
            to connect you with co-founders, developers, and designers based on
            actual skills and project requirements.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button className="group flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_16px_40px_rgba(242,113,33,0.3)] transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_20px_50px_rgba(242,113,33,0.4)]">
              Start Building Free
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
            <button className="rounded-lg border border-outline/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-on-surface transition-all duration-300 hover:border-on-surface-variant hover:bg-surface-container-high/40">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Showcase cards ────────────────────────────────────────────────── */}
      <section className="relative mx-auto grid max-w-[1600px] gap-6 px-8 lg:px-12 pb-28 md:grid-cols-[1.6fr_1fr]">
        {/* Profile card */}
        <div className="group rounded-2xl border border-surface-container-high/80 bg-surface-container/60 p-7 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_40px_rgba(242,113,33,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-surface-container-high to-surface-bright text-lg font-bold text-on-surface-variant">
                E
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Elena R.
                </p>
                <p className="text-xs text-text-secondary">
                  Senior Frontend Engineer
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-muted px-3.5 py-1.5 text-xs font-bold text-primary">
              <Zap size={12} />
              94% Match
            </span>
          </div>

          <div className="mt-6 border-l-2 border-primary pl-4 text-sm leading-relaxed text-text-secondary">
            Looking for a Backend dev (Node/Postgres) to co-found a devtools
            startup. I have the MVP UI built.
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {["React", "TypeScript", "Figma"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-outline-variant/60 px-3.5 py-1.5 text-xs text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary-light"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_8px_24px_rgba(242,113,33,0.3)]">
              <Users size={14} />
              Connect
            </button>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-outline-variant/60 text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Bookmark"
            >
              <Bookmark size={16} />
            </button>
          </div>
        </div>

        {/* Semantic engine card */}
        <div className="group flex flex-col justify-center rounded-2xl border border-surface-container-high/80 bg-surface-container/60 p-7 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_40px_rgba(242,113,33,0.06)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary-muted text-primary transition-colors group-hover:bg-primary/20">
            <Target size={22} />
          </div>
          <h3 className="mt-6 font-heading text-xl font-semibold text-on-surface">
            Semantic Engine
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            We parse your repositories, design files, and previous work to
            understand your true capabilities beyond simple tags.
          </p>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-8 lg:px-12 pb-32">
        <h2 className="text-center font-heading text-3xl font-bold text-on-surface">
          How it works
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Users,
              step: "1",
              title: "Build Profile",
              desc: "Connect your GitHub, Dribbble, or portfolio. Define your tech stack and what you're looking to build next.",
            },
            {
              icon: Target,
              step: "2",
              title: "Get Matched",
              desc: "Our engine ranks potential teammates based on complementary skills, timezone overlap, and shared goals.",
            },
            {
              icon: Rocket,
              step: "3",
              title: "Connect & Build",
              desc: "Send a connection request with context. Once accepted, move straight into planning your next big project.",
            },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-surface-container-high/80 bg-surface-container/60 px-7 py-8 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_40px_rgba(242,113,33,0.06)]"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary-muted text-primary transition-colors group-hover:bg-primary/20">
                <Icon size={22} />
              </div>
              <h3 className="mt-6 font-heading text-base font-semibold text-on-surface">
                {step}. {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
