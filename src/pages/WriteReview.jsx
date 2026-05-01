import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ChevronDown,
  Send,
  ShieldCheck,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";

const STRENGTH_OPTIONS = [
  "Technical Skill",
  "Communication",
  "Reliable",
  "Creative Problem Solving",
  "Leadership",
  "Meets Deadlines",
];

// Mock data — later these come from API / route params
const MOCK_REVIEWER_TARGET = {
  name: "Alex Rivera",
  role: "Full-Stack Developer",
  avatar: null, // placeholder, will use initials
  initials: "AR",
  verified: true,
};

const MOCK_PROJECTS = [
  "DevTools Dashboard MVP",
  "SkillMesh v2 Redesign",
  "Open-Source CLI Tool",
];

function WriteReview() {
  const navigate = useNavigate();

  // Form state
  const [selectedProject, setSelectedProject] = useState("");
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [strengths, setStrengths] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [workAgain, setWorkAgain] = useState(null); // true | false | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayRating = hoverRating || rating;

  const toggleStrength = (tag) => {
    setStrengths((prev) =>
      prev.includes(tag) ? prev.filter((s) => s !== tag) : [...prev, tag]
    );
  };

  const canSubmit =
    selectedProject && rating > 0 && feedback.trim().length >= 20 && workAgain !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    // Simulated API call
    await new Promise((r) => setTimeout(r, 1000));

    // TODO: POST to /api/reviews
    console.log({
      target: MOCK_REVIEWER_TARGET.name,
      project: selectedProject,
      rating,
      strengths,
      feedback,
      workAgain,
    });

    setIsSubmitting(false);
    // Navigate back or show success
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <Sidebar activeOverride="/write-review" />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-8 py-10 lg:px-12">
          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-on-surface">
                Write a Review
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Share your experience collaborating with this builder.
              </p>
            </div>

            {/* Target user card */}
            <div className="flex items-center gap-3 rounded-xl border border-surface-container-high bg-surface-container px-4 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-surface-container-high to-surface-bright text-sm font-bold text-on-surface-variant">
                {MOCK_REVIEWER_TARGET.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  {MOCK_REVIEWER_TARGET.name}
                </p>
                {MOCK_REVIEWER_TARGET.verified && (
                  <span className="flex items-center gap-1 text-[11px] text-primary">
                    <ShieldCheck size={12} />
                    Verified Connection
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-surface-container-high" />

          {/* ── Project Context ──────────────────────────────────────────── */}
          <section>
            <h2 className="text-sm font-semibold text-on-surface">
              Project Context
            </h2>
            <div className="relative mt-3">
              <button
                type="button"
                onClick={() => setProjectDropdownOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded-lg border border-surface-container-high bg-surface-container px-4 py-3 text-sm transition-colors hover:border-outline-variant focus:border-primary focus:outline-none"
              >
                <span className={selectedProject ? "text-on-surface" : "text-text-secondary"}>
                  {selectedProject || "Select the project you collaborated on"}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-text-secondary transition-transform ${projectDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {projectDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-surface-container-high bg-surface-container-low shadow-xl">
                  {MOCK_PROJECTS.map((project) => (
                    <button
                      key={project}
                      type="button"
                      onClick={() => {
                        setSelectedProject(project);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-container ${
                        selectedProject === project
                          ? "text-primary font-medium"
                          : "text-on-surface"
                      }`}
                    >
                      {project}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Overall Rating ───────────────────────────────────────────── */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-on-surface">
              Overall Rating
            </h2>
            <div className="mt-3 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-90"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      star <= displayRating
                        ? "fill-primary text-primary"
                        : "fill-none text-surface-bright"
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-text-secondary">
                  {rating}/5
                </span>
              )}
            </div>
          </section>

          {/* ── Key Strengths ────────────────────────────────────────────── */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-on-surface">
              Key Strengths
            </h2>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {STRENGTH_OPTIONS.map((tag) => {
                const isSelected = strengths.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleStrength(tag)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-surface-container-high text-text-secondary hover:border-outline-variant hover:text-on-surface"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Detailed Feedback ────────────────────────────────────────── */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-on-surface">
              Detailed Feedback
            </h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={`Describe your experience working with ${MOCK_REVIEWER_TARGET.name}. What went well? What could be improved?`}
              rows={5}
              className="mt-3 w-full resize-y rounded-lg border border-surface-container-high bg-surface-container px-4 py-3 text-sm leading-relaxed text-on-surface placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-text-secondary">
              {feedback.length} characters{feedback.length < 20 ? " (minimum 20)" : ""}
            </p>
          </section>

          {/* ── Work Again ───────────────────────────────────────────────── */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-on-surface">
              Would you work with them again?
            </h2>
            <div className="mt-3 flex items-center gap-6">
              {[
                { value: true, label: "Yes, absolutely" },
                { value: false, label: "No" },
              ].map(({ value, label }) => (
                <label
                  key={label}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-on-surface"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      workAgain === value
                        ? "border-primary"
                        : "border-surface-bright"
                    }`}
                  >
                    {workAgain === value && (
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="workAgain"
                    value={String(value)}
                    checked={workAgain === value}
                    onChange={() => setWorkAgain(value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>

          {/* ── Divider ──────────────────────────────────────────────────── */}
          <div className="my-10 border-t border-surface-container-high" />

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg px-6 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-primary px-7 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? "Submitting…" : "Submit Review"}
              <Send size={15} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WriteReview;
