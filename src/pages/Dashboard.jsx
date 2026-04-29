import CardStack from "../components/discover/CardStack";
import mockUsers from "../data/mockUsers";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
            SkillMesh
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Discover Teammates
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Swipe right to connect, left to skip. Find your next collaborator.
          </p>
        </div>

        {/* Swipe card stack */}
        <CardStack users={mockUsers} />
      </div>
    </div>
  );
}

export default Dashboard;