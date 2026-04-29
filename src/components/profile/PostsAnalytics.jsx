import { Card, CardContent, CardHeaders } from "../common/Card";
import { ChatIcon, ChartIcon } from "./ProfileIcons";

const analytics = [
  { label: "Projects completed", value: 18, width: "90%" },
  { label: "People connected", value: 46, width: "76%" },
  { label: "Collab requests", value: 29, width: "64%" },
  { label: "Mentorship calls", value: 11, width: "42%" },
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

function PostsAnalytics() {
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

export default PostsAnalytics;
