function Admin() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 mb-2">
            Administration
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-600">
            Manage users, tasks, and reviews across the platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Users</h3>
            <p className="text-sm text-slate-500 mb-4">View and manage all registered users.</p>
            <p className="text-3xl font-semibold text-slate-900">—</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Tasks</h3>
            <p className="text-sm text-slate-500 mb-4">View all tasks across users.</p>
            <p className="text-3xl font-semibold text-slate-900">—</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Reviews</h3>
            <p className="text-sm text-slate-500 mb-4">Moderate and manage reviews.</p>
            <p className="text-3xl font-semibold text-slate-900">—</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
