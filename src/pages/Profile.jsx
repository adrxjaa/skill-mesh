import { useState } from "react";
import BasicProfile from "../components/profile/BasicProfile";
import BioLinks from "../components/profile/BioLinks";
import PostsAnalytics from "../components/profile/PostsAnalytics";
import ExperienceSection from "../components/profile/ExperienceSection";

const sections = [
  { id: "basic", label: "Basic Profile" },
  { id: "bio", label: "Bio & Links" },
  { id: "posts", label: "Posts & Analytics" },
  { id: "experience", label: "Experience" },
];

function renderSection(section) {
  switch (section) {
    case "basic":
      return <BasicProfile />;
    case "bio":
      return <BioLinks />;
    case "posts":
      return <PostsAnalytics />;
    case "experience":
      return <ExperienceSection />;
    default:
      return <ExperienceSection />;
  }
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
