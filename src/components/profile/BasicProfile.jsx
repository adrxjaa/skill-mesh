import { Card, CardContent, CardHeaders } from "../common/Card";
import { ChartIcon } from "./ProfileIcons";

function BasicProfile() {
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

          <div className="mt-6">
            <button className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600">
              Save profile
            </button>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}

export default BasicProfile;
