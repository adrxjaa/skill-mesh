import { useParams } from "react-router-dom";

function PublicProfile() {
  const { username } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 mb-2">
            Public profile
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">
            @{username}
          </h1>
          <p className="text-slate-500">
            This profile page will display public information, projects, experience, and reviews for this user.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Projects</h3>
              <p className="text-sm text-slate-500">No projects to display yet.</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Experience</h3>
              <p className="text-sm text-slate-500">No experience to display yet.</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 md:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Reviews</h3>
              <p className="text-sm text-slate-500">No reviews to display yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicProfile;
