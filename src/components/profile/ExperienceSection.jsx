import { Card, CardContent, CardHeaders } from "../common/Card";
import { UploadIcon } from "./ProfileIcons";

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

function ExperienceSection() {
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

export default ExperienceSection;
