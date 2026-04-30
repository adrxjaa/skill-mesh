import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useMatch from "../hooks/useMatch";
import toast from "react-hot-toast";
import mockUsers from "../data/mockUsers";

const sections = [
  { id: "account", label: "Account Info" },
  { id: "password", label: "Change Password" },
  { id: "reviews", label: "Review Requests" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy", label: "Privacy" },
  { id: "data", label: "Data & Storage" },
  { id: "danger", label: "Log Out" },
];

function Settings() {
  const [activeSection, setActiveSection] = useState("account");
  const { user, logout } = useAuth();
  const { resetAll, matches, getIncomingReviews, approveReview, flagReview, disputeReview, pendingReviewCount } = useMatch();
  const navigate = useNavigate();
  const [disputeText, setDisputeText] = useState({});
  const [showDisputeForm, setShowDisputeForm] = useState(null);

  // Notification toggles (mock — no backend)
  const [notifs, setNotifs] = useState({
    emailNotifications: true,
    matchAlerts: true,
    collabRequests: true,
  });

  // Privacy toggles (mock — no backend)
  const [privacy, setPrivacy] = useState({
    showInDiscover: true,
    showAvailability: true,
  });

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  const handleResetMatches = () => {
    resetAll();
    toast.success("Match data cleared — refresh to see changes");
  };

  const activeItem = sections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* ── Sidebar ── */}
        <aside className="border-r border-slate-200 bg-white p-5 lg:sticky lg:top-20 lg:h-[calc(100vh-7rem)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">SkillMesh</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Settings</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your account preferences.</p>
          </div>

          <div className="mt-5 space-y-2">
            {sections.map((section) => {
              const isActive = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? section.id === "danger"
                        ? "bg-red-500 text-white"
                        : "bg-orange-500 text-white"
                      : section.id === "danger"
                      ? "text-red-500 hover:bg-red-50"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  onClick={() => setActiveSection(section.id)}
                  type="button"
                >
                  {section.label}
                  {section.id === "reviews" && pendingReviewCount > 0 && (
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                      {pendingReviewCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="space-y-6">
          <div className="border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-orange-500">Settings</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{activeItem?.label}</h2>
          </div>

          {/* ── Account Info ── */}
          {activeSection === "account" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-xl font-bold text-orange-600">
                  {user?.displayName?.split(" ").map((n) => n[0]).join("") || "?"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{user?.displayName}</h3>
                  <p className="text-sm text-slate-500">@{user?.username || "username"}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Display Name</span>
                  <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900">{user?.displayName}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900">{user?.email}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Location</span>
                  <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900">{user?.location || "—"}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Availability</span>
                  <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 capitalize">
                    {user?.availability?.replace(/-/g, " ") || "—"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/profile"
                  className="inline-flex rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          )}

          {/* ── Change Password ── */}
          {activeSection === "password" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-6 text-sm text-slate-500">Update your password to keep your account secure.</p>
              <div className="max-w-md space-y-4">
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400" placeholder="Current password" type="password" />
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400" placeholder="New password" type="password" />
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400" placeholder="Confirm new password" type="password" />
                <button
                  onClick={() => toast.success("Password updated (demo)")}
                  className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Update password
                </button>
              </div>
            </div>
          )}

          {/* ── Review Requests (Moderation Queue) ── */}
          {activeSection === "reviews" && (() => {
            const allReviews = getIncomingReviews();
            const pending = allReviews.filter((r) => r.status === "pending");
            const handled = allReviews.filter((r) => r.status !== "pending");

            return (
              <div className="space-y-6">
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500 mb-4">
                    Review what others have written about you. You control which reviews appear on your public profile.
                  </p>

                  {/* Info box */}
                  <div className="rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-700">
                    <p className="font-semibold">How moderation works</p>
                    <ul className="mt-1 space-y-0.5 list-disc list-inside">
                      <li><strong>Approve</strong> — Review becomes visible on your profile</li>
                      <li><strong>Dispute</strong> — Your response is shown alongside the review</li>
                      <li><strong>Flag</strong> — Review is hidden and sent to admin for investigation</li>
                      <li>Reviews auto-approve after 7 days if no action is taken</li>
                    </ul>
                  </div>
                </div>

                {/* Pending reviews */}
                {pending.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-slate-700">Pending ({pending.length})</h3>
                    <div className="space-y-3">
                      {pending.map((review) => {
                        const reviewer = mockUsers.find((u) => u.id === review.reviewerId);
                        return (
                          <div key={review.id} className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                                {review.reviewerInitials}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-900">{review.reviewerName}</span>
                                  <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map((s) => (
                                      <svg key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'text-amber-400' : 'text-slate-200'}`} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">on <span className="text-orange-600 font-medium">{review.projectName}</span></p>
                                <p className="mt-2 text-sm text-slate-700 italic">"{review.text}"</p>

                                {/* Actions */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button
                                    onClick={() => { approveReview(review.id); toast.success('Review approved'); }}
                                    className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() => setShowDisputeForm(showDisputeForm === review.id ? null : review.id)}
                                    className="rounded-lg border border-amber-300 bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-200 active:scale-95"
                                  >
                                    💬 Dispute
                                  </button>
                                  <button
                                    onClick={() => { flagReview(review.id); toast.success('Review flagged for admin review'); }}
                                    className="rounded-lg border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 active:scale-95"
                                  >
                                    🚩 Flag
                                  </button>
                                </div>

                                {/* Dispute form */}
                                {showDisputeForm === review.id && (
                                  <div className="mt-3 space-y-2">
                                    <textarea
                                      value={disputeText[review.id] || ''}
                                      onChange={(e) => setDisputeText((prev) => ({ ...prev, [review.id]: e.target.value }))}
                                      placeholder="Write your response — this will be shown alongside the review on your profile"
                                      rows={3}
                                      className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-orange-400"
                                    />
                                    <button
                                      onClick={() => {
                                        if ((disputeText[review.id] || '').trim().length < 10) {
                                          toast.error('Response must be at least 10 characters');
                                          return;
                                        }
                                        disputeReview(review.id, disputeText[review.id]);
                                        setShowDisputeForm(null);
                                        toast.success('Dispute submitted with your response');
                                      }}
                                      className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                                    >
                                      Submit Response
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Handled reviews */}
                {handled.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-slate-700">Handled ({handled.length})</h3>
                    <div className="space-y-3">
                      {handled.map((review) => (
                        <div key={review.id} className={`rounded-lg border p-4 ${
                          review.status === 'approved' ? 'border-emerald-200 bg-emerald-50' :
                          review.status === 'flagged' ? 'border-red-200 bg-red-50' :
                          'border-amber-200 bg-amber-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 text-sm">{review.reviewerName}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                review.status === 'approved' ? 'bg-emerald-200 text-emerald-700' :
                                review.status === 'flagged' ? 'bg-red-200 text-red-700' :
                                'bg-amber-200 text-amber-700'
                              }`}>{review.status}</span>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-slate-600 italic">"{review.text}"</p>
                          {review.response && (
                            <div className="mt-2 rounded-lg bg-white/50 px-3 py-2 text-xs">
                              <p className="font-semibold text-slate-700">Your response:</p>
                              <p className="text-slate-600 mt-0.5">{review.response}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {allReviews.length === 0 && (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">⭐</div>
                    <p className="font-medium text-slate-700">No review requests yet</p>
                    <p className="mt-1 text-xs text-slate-500">When collaborators write reviews about you, they'll appear here for your approval.</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Notifications ── */}
          {activeSection === "notifications" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-6 text-sm text-slate-500">Choose which notifications you'd like to receive.</p>
              <div className="space-y-5 max-w-md">
                {[
                  { key: "emailNotifications", label: "Email notifications", desc: "Receive email updates about activity on your profile" },
                  { key: "matchAlerts", label: "Match alerts", desc: "Get notified when someone matches with you" },
                  { key: "collabRequests", label: "Collaboration requests", desc: "Get notified about incoming collaboration requests" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                        notifs[item.key] ? "bg-orange-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                          notifs[item.key] ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Privacy ── */}
          {activeSection === "privacy" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-6 text-sm text-slate-500">Control who can see your profile and activity.</p>
              <div className="space-y-5 max-w-md">
                {[
                  { key: "showInDiscover", label: "Show in Discover", desc: "Allow your profile to appear in the Discover feed for others to swipe on" },
                  { key: "showAvailability", label: "Show availability status", desc: "Display your availability badge on your public profile" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setPrivacy((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                        privacy[item.key] ? "bg-orange-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                          privacy[item.key] ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Data & Storage ── */}
          {activeSection === "data" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-6 text-sm text-slate-500">Manage your local data and cached information.</p>
              <div className="space-y-4 max-w-md">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Match data</p>
                      <p className="text-xs text-slate-500">{matches.length} matches, swipe history, and preferences</p>
                    </div>
                    <button
                      onClick={handleResetMatches}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Chat history</p>
                      <p className="text-xs text-slate-500">All conversation messages with matches</p>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem("sm_messages");
                        toast.success("Chat history cleared — refresh to apply");
                      }}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Danger Zone / Logout ── */}
          {activeSection === "danger" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Log out</h3>
                <p className="text-sm text-slate-500 mb-4">
                  You'll be signed out of SkillMesh on this device. Your data will be preserved.
                </p>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95"
                >
                  Log out of SkillMesh
                </button>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Delete account</h3>
                <p className="text-sm text-red-600 mb-4">
                  Permanently remove your account and all associated data. This action cannot be undone.
                </p>
                <button
                  disabled
                  className="rounded-lg border border-red-300 px-6 py-3 text-sm font-semibold text-red-400 cursor-not-allowed"
                >
                  Delete account (requires backend)
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Settings;
