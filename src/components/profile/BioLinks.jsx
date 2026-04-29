import { Card, CardContent, CardHeaders } from "../common/Card";

const links = [
  { label: "Portfolio", value: "www.ananyabuilds.dev" },
  { label: "GitHub", value: "github.com/ananyabuilds" },
  { label: "LinkedIn", value: "linkedin.com/in/ananyabuilds" },
];

function BioLinks() {
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

export default BioLinks;
