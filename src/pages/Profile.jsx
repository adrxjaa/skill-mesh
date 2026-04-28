import { useState } from "react";
import { Card, CardContent, CardHeaders } from "../components/Card";

const sections = [
  { id: "basic", label: "Basic Profile" },
  { id: "bio", label: "Bio & Links" },
  { id: "posts", label: "Posts & Analytics" },
  { id: "experience", label: "Experience" },
];

const analytics = [
  { label: "Projects completed", value: 18, width: "90%" },
  { label: "People connected", value: 46, width: "76%" },
  { label: "Collab requests", value: 29, width: "64%" },
  { label: "Mentorship calls", value: 11, width: "42%" },
];

const links = [
  { label: "Portfolio", value: "www.ananyabuilds.dev" },
  { label: "GitHub", value: "github.com/ananyabuilds" },
  { label: "LinkedIn", value: "linkedin.com/in/ananyabuilds" },
];

const posts = [
  {
    title: "Looking for a backend collaborator",
    description:
      "Building a student skill exchange app and need help refining the matching logic and API structure.",
    tag: "Open for collaboration",
  },
  {
    title: "Recently finished the design system",
    description:
      "Created reusable onboarding, profile, and dashboard components for faster team iteration.",
    tag: "Completed project",
  },
];

const experiences = [
  {
    role: "Product Designer + Frontend Developer",
    place: "SkillMesh Community",
    period: "2024 - Present",
    summary:
      "Designing clean community workflows, profile systems, and collaboration spaces for student builders.",
  },
  {
    role: "Freelance UI Developer",
    place: "Independent Projects",
    period: "2022 - 2024",
    summary:
      "Built landing pages, startup MVPs, and polished profile flows for early-stage teams.",
  },
];

function ChatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 10h10M7 14h6" strokeLinecap="round" />
      <path
        d="M21 11.5C21 6.806 16.97 3 12 3S3 6.806 3 11.5C3 14.07 4.203 16.374 6.103 17.93V21l3.096-1.762A10.1 10.1 0 0 0 12 20c4.97 0 9-3.806 9-8.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 19h16" strokeLinecap="round" />
      <path d="M7 16V9" strokeLinecap="round" />
      <path d="M12 16V5" strokeLinecap="round" />
      <path d="M17 16v-4" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 16V5" strokeLinecap="round" />
      <path d="m8.5 8.5 3.5-3.5 3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function renderSection(section) {
  if (section === "basic") {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="h-20 bg-slate-100" />
          <CardContent className="-mt-14 px-6 pb-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-orange-100 text-2xl font-semibold text-orange-600">
                  AB
                </div>
                <div className="pb-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                    SkillMesh profile
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">Ananya Bhat</h2>
                  <p className="mt-1 text-sm text-slate-500">Bengaluru, India</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Edit photo
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                  <ChatIcon className="h-4 w-4" />
                  Message profile
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Full name</span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400"
                  defaultValue="Ananya Bhat"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Location</span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400"
                  defaultValue="Bengaluru, India"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Headline</span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400"
                  defaultValue="Frontend developer helping founders shape polished product experiences."
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600">
                Save profile
              </button>
              <button className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Preview public view
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeaders className="justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Quick profile stats</h3>
                <p className="text-sm text-slate-500">A compact view for visitors.</p>
              </div>
              <ChartIcon className="h-9 w-9 rounded-2xl bg-orange-50 p-2 text-orange-500" />
            </CardHeaders>
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Projects</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">18</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Connections</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">46</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Response rate</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">93%</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Availability</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-600">Open</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeaders>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Change password</h3>
                <p className="text-sm text-slate-500">Keep your account secure.</p>
              </div>
            </CardHeaders>
            <CardContent className="space-y-4">
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400" placeholder="Current password" type="password" />
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400" placeholder="New password" type="password" />
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400" placeholder="Confirm new password" type="password" />
              <button className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                Update password
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (section === "bio") {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeaders>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Detailed bio</h3>
              <p className="text-sm text-slate-500">Tell collaborators how you work and what you enjoy building.</p>
            </div>
          </CardHeaders>
          <CardContent className="space-y-4">
            <textarea
              className="min-h-56 w-full rounded-lg border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-orange-400"
              defaultValue="I am a frontend-focused builder who enjoys turning rough ideas into polished, human-centered experiences. I usually collaborate with startup teams and student founders who need interface systems, clearer product flows, and quick iteration while validating their projects."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Primary role</span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400"
                  defaultValue="Frontend Developer"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Collaboration style</span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400"
                  defaultValue="Async-first, design-driven"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeaders>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Links</h3>
              <p className="text-sm text-slate-500">Share places where people can learn more about your work.</p>
            </div>
          </CardHeaders>
          <CardContent className="space-y-4">
            {links.map((link) => (
              <label key={link.label} className="space-y-2">
                <span className="text-sm font-medium text-slate-700">{link.label}</span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400"
                  defaultValue={link.value}
                />
              </label>
            ))}
            <button className="w-full rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600">
              Add another link
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (section === "posts") {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeaders className="justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">About this profile</h3>
                <p className="text-sm text-slate-500">Show what you are building so others can join the right projects.</p>
              </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                Public section
              </span>
            </CardHeaders>
            <CardContent className="space-y-4">
              {posts.map((post) => (
                <div key={post.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">{post.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{post.description}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                      {post.tag}
                    </span>
                  </div>
                </div>
              ))}
              <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                Add new post
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeaders className="justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Collaboration analytics</h3>
                <p className="text-sm text-slate-500">A quick visual summary of your impact.</p>
              </div>
              <ChartIcon className="h-10 w-10 rounded-2xl bg-slate-100 p-2 text-slate-700" />
            </CardHeaders>
            <CardContent className="space-y-5">
              {analytics.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-slate-900"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-slate-900 text-white shadow-sm">
            <CardHeaders className="justify-between">
              <div>
                <h3 className="text-xl font-semibold">Talk to this creator</h3>
                <p className="text-sm text-slate-300">Let profile visitors start a conversation quickly.</p>
              </div>
              <ChatIcon className="h-10 w-10 rounded-2xl bg-white/10 p-2 text-orange-300" />
            </CardHeaders>
            <CardContent>
              <button className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-orange-50">
                <ChatIcon className="h-4 w-4" />
                Open chat
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeaders>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Experience</h3>
            <p className="text-sm text-slate-500">Highlight the work that proves you can ship collaborative projects.</p>
          </div>
        </CardHeaders>
        <CardContent className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.role} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{experience.role}</h4>
                  <p className="mt-1 text-sm font-medium text-orange-600">{experience.place}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                  {experience.period}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{experience.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeaders className="justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Resume</h3>
              <p className="text-sm text-slate-500">Upload a resume for founders or teammates who want the full picture.</p>
            </div>
            <UploadIcon className="h-10 w-10 rounded-2xl bg-orange-50 p-2 text-orange-500" />
          </CardHeaders>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <UploadIcon className="mx-auto h-10 w-10 text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-700">Drop your resume here or browse files</p>
              <p className="mt-1 text-xs text-slate-500">PDF preferred, up to 10MB</p>
            </div>
            <button className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-600">
              Upload resume
            </button>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeaders>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Open to</h3>
              <p className="text-sm text-slate-500">Set clear expectations for incoming collaboration requests.</p>
            </div>
          </CardHeaders>
          <CardContent className="flex flex-wrap gap-3">
            {[
              "Startup MVPs",
              "Hackathon teams",
              "UI audits",
              "Frontend collaboration",
            ].map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                {item}
              </span>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Profile() {
  const [activeSection, setActiveSection] = useState("basic");
  const activeItem = sections.find((section) => section.id === activeSection);

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white p-5 lg:sticky lg:top-20 lg:h-[calc(100vh-7rem)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">SkillMesh</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Profile</h1>
            <p className="mt-2 text-sm text-slate-500">Edit your public profile and details.</p>
          </div>

          <div className="mt-5 space-y-2">
            {sections.map((section) => {
              const isActive = section.id === activeSection;

              return (
                <button
                  key={section.id}
                  className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  onClick={() => setActiveSection(section.id)}
                  type="button"
                >
                  {section.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            <p className="font-medium text-slate-700">Profile strength</p>
            <p className="mt-2">82% complete. Add your resume and one more post to improve discoverability.</p>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-col gap-4 border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-orange-500">Profile editor</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">{activeItem?.label}</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Build a profile that helps people understand your skills, current work, and the best way to reach you.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Save draft
              </button>
              <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                Publish profile
              </button>
            </div>
          </div>

          {renderSection(activeSection)}
        </main>
      </div>
    </div>
  );
}

export default Profile;
