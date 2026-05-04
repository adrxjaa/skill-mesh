import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { getUserProfile, getMyProfile, getReviews, submitReview } from "../services/profileApi";
import ConnectModal from "../components/projects/ConnectModal";
import ProfilePosts from "../components/profile/ProfilePosts";

const AVAILABILITY_OPTIONS = [
  { value: "open-to-work", label: "Open to Work", color: "text-green-400 bg-green-500/10 border-green-500/30" },
  { value: "freelancing", label: "Freelancing", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { value: "not-available", label: "Not Available", color: "text-text-secondary bg-surface-container-high border-outline-variant" },
];

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange?.(star)} className={onChange ? "cursor-pointer" : "cursor-default"}>
          <span className={`material-symbols-outlined text-xl ${star <= value ? "text-yellow-400" : "text-surface-container-high"}`} style={{ fontVariationSettings: `'FILL' ${star <= value ? 1 : 0}` }}>star</span>
        </button>
      ))}
    </div>
  );
}

export default function Profile() {
  const { id } = useParams();
  const { user, updateMe } = useContext(AuthContext);

  const isSelf = !id || id === user?.id;

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [connectOpen, setConnectOpen] = useState(false);

  // Edit states
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [editingLinks, setEditingLinks] = useState(false);
  const [linksDraft, setLinksDraft] = useState({});
  const [editingExp, setEditingExp] = useState(false);
  const [expDraft, setExpDraft] = useState([]);
  const [savingSection, setSavingSection] = useState(null);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Profile card editing
  const [editingCard, setEditingCard] = useState(false);
  const [cardDraft, setCardDraft] = useState({});
  const [cardSkillInput, setCardSkillInput] = useState("");
  const [savingCard, setSavingCard] = useState(false);

  const openCardEdit = () => {
    setCardDraft({
      fullName: profile?.fullName || "",
      title: profile?.title || "",
      location: profile?.location || "",
      availability: profile?.availability || "open-to-work",
      skills: [...(profile?.skills || [])],
    });
    setCardSkillInput("");
    setEditingCard(true);
  };

  const saveCard = async () => {
    setSavingCard(true);
    try {
      const updated = await updateMe(cardDraft);
      setProfile((p) => ({ ...p, ...updated }));
      setEditingCard(false);
    } finally {
      setSavingCard(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let data;
        if (isSelf) {
          data = await getMyProfile();
          data.isSelf = true;
          data.canReview = false;
        } else {
          data = await getUserProfile(id);
        }
        setProfile(data);
        setCanReview(data.canReview || false);
        const rev = await getReviews(isSelf ? user.id : id);
        setReviews(rev);
      } catch {
        // Demo fallback
        setProfile(isSelf ? { ...user, isSelf: true } : null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isSelf, user]);

  const saveSection = async (section, fields) => {
    setSavingSection(section);
    try {
      const updated = await updateMe(fields);
      setProfile((p) => ({ ...p, ...updated }));
    } finally {
      setSavingSection(null);
    }
  };

  const handleSubmitReview = async () => {
    setSubmittingReview(true);
    try {
      const rev = await submitReview(id, { rating: reviewRating, text: reviewText });
      setReviews((p) => [rev, ...p]);
      setShowReviewForm(false);
      setReviewText("");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-2 border-accent-orange-rich border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="p-8 text-text-secondary text-center">User not found.</div>;
  }

  const initials = (profile.fullName || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const availOpt = AVAILABILITY_OPTIONS.find((o) => o.value === profile.availability) || AVAILABILITY_OPTIONS[0];
  const avatarSrc = profile.avatar
    ? profile.avatar.startsWith("/uploads") ? `http://localhost:5000${profile.avatar}` : profile.avatar
    : null;

  const TABS = ["about", "experience", "posts", "reviews"];

  return (
    <div className="flex-1 p-4 md:p-5 pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Profile Card ── */}
        <section className="relative bg-surface-card border border-surface-container-high rounded-xl p-5 md:p-7 mb-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange-rich opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex flex-col sm:flex-row gap-5 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-surface overflow-hidden shadow-lg shrink-0 bg-accent-orange-rich/20 flex items-center justify-center">
              {avatarSrc
                ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                : <span className="text-3xl font-heading font-bold text-accent-orange-rich">{initials}</span>}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-heading font-bold text-text-primary text-2xl">{profile.fullName}</h1>
                  <p className="text-accent-orange-rich font-body text-sm mt-0.5">{profile.title || "Builder"}</p>
                  {profile.location && (
                    <p className="text-text-secondary font-body text-sm flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {profile.location}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {!isSelf && (
                    <button
                      onClick={() => setConnectOpen(true)}
                      className="px-4 py-1.5 border border-accent-orange-rich text-accent-orange-rich rounded-lg font-heading font-semibold text-sm hover:bg-accent-orange-muted transition-all active:scale-95"
                    >
                      Connect
                    </button>
                  )}
                  {isSelf ? (
                    <button
                      onClick={openCardEdit}
                      className="w-8 h-8 flex items-center justify-center border border-outline-variant text-text-secondary rounded-lg hover:text-accent-orange-rich hover:bg-surface-container-high transition-colors"
                      title="Edit profile card"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  ) : (
                    <button className="w-8 h-8 flex items-center justify-center border border-outline-variant text-text-secondary rounded-lg hover:text-text-primary hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(profile.skills || []).slice(0, 6).map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-full border border-outline-variant text-text-secondary font-body text-xs">
                    {s}
                  </span>
                ))}
              </div>

              {/* Availability badge */}
              <div className={`inline-flex items-center gap-2 border px-3 py-1 rounded-full mt-3 text-xs ${availOpt.color}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${profile.availability === "open-to-work" ? "bg-green-400 shadow-[0_0_6px_#22C55E]" : profile.availability === "freelancing" ? "bg-blue-400" : "bg-text-secondary"}`} />
                <span className="font-heading font-semibold uppercase tracking-wide">{availOpt.label}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tabs ── */}
        <div className="flex gap-1 border-b border-surface-container-high mb-5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 font-heading font-semibold text-sm capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-accent-orange-rich text-accent-orange-rich"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab}
              {tab === "reviews" && reviews.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded-full">{reviews.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── About Tab ── */}
        {activeTab === "about" && (
          <div className="flex flex-col xl:flex-row gap-5">
            {/* Left */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Bio */}
              <div className="bg-surface-card border border-surface-container-high rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-heading font-semibold text-text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-orange-rich text-[20px]">person</span>
                    Bio
                  </h2>
                  {isSelf && !editingBio && (
                    <button onClick={() => { setBioDraft(profile.bio || ""); setEditingBio(true); }}
                      className="text-text-secondary hover:text-accent-orange-rich transition-colors">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  )}
                </div>
                {editingBio ? (
                  <>
                    <textarea value={bioDraft} onChange={(e) => setBioDraft(e.target.value)} rows={5}
                      className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-sm resize-none focus:outline-none focus:border-accent-orange-rich transition-colors" />
                    <div className="flex gap-2 justify-end mt-2">
                      <button onClick={() => setEditingBio(false)} className="px-3 py-1.5 text-text-secondary border border-outline-variant rounded-lg font-body text-sm hover:bg-surface-container-high">Cancel</button>
                      <button onClick={async () => { await saveSection("bio", { bio: bioDraft }); setEditingBio(false); }}
                        disabled={savingSection === "bio"}
                        className="px-3 py-1.5 bg-accent-orange-rich text-white rounded-lg font-body text-sm font-medium hover:bg-accent-orange-rich/90 disabled:opacity-50">
                        {savingSection === "bio" ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-text-secondary font-body text-sm leading-relaxed whitespace-pre-wrap">
                    {profile.bio || <span className="italic opacity-50">No bio yet.</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="xl:w-72 flex flex-col gap-4">
              {/* Digital Footprint */}
              <div className="bg-surface-card border border-surface-container-high rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-text-primary text-sm">Digital Footprint</h3>
                  {isSelf && !editingLinks && (
                    <button onClick={() => { setLinksDraft({ ...profile.socialLinks }); setEditingLinks(true); }}
                      className="text-text-secondary hover:text-accent-orange-rich transition-colors">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  )}
                </div>
                {editingLinks ? (
                  <div className="space-y-2">
                    {["portfolio", "github", "linkedin"].map((key) => (
                      <input key={key} type="url" placeholder={key.charAt(0).toUpperCase() + key.slice(1) + " URL"}
                        value={linksDraft[key] || ""}
                        onChange={(e) => setLinksDraft((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-xs focus:outline-none focus:border-accent-orange-rich transition-colors" />
                    ))}
                    <div className="flex gap-2 justify-end mt-2">
                      <button onClick={() => setEditingLinks(false)} className="px-3 py-1.5 text-text-secondary border border-outline-variant rounded-lg font-body text-xs hover:bg-surface-container-high">Cancel</button>
                      <button onClick={async () => { await saveSection("links", { socialLinks: linksDraft }); setEditingLinks(false); }}
                        disabled={savingSection === "links"}
                        className="px-3 py-1.5 bg-accent-orange-rich text-white rounded-lg font-body text-xs font-medium disabled:opacity-50">
                        {savingSection === "links" ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {[
                      { key: "portfolio", icon: "language", label: "Portfolio" },
                      { key: "github", icon: "code", label: "GitHub" },
                      { key: "linkedin", icon: "work", label: "LinkedIn" },
                    ].map(({ key, icon, label }) => profile.socialLinks?.[key] ? (
                      <a key={key} href={profile.socialLinks[key]} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 bg-surface-container-high rounded-lg hover:border-accent-orange-rich/40 border border-transparent transition-colors group">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-text-secondary text-[16px]">{icon}</span>
                          <span className="font-body text-sm text-text-primary">{label}</span>
                        </div>
                        <span className="material-symbols-outlined text-text-secondary text-[14px] group-hover:text-accent-orange-rich">open_in_new</span>
                      </a>
                    ) : null)}
                    {!profile.socialLinks?.portfolio && !profile.socialLinks?.github && !profile.socialLinks?.linkedin && (
                      <p className="text-text-secondary font-body text-xs italic">No links added.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Review snippet */}
              {reviews[0] && (
                <div className="bg-surface-card border border-surface-container-high rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-semibold text-text-primary text-sm">Recent Review</h3>
                    <button onClick={() => setActiveTab("reviews")} className="text-accent-orange-rich text-xs font-body hover:underline">View All</button>
                  </div>
                  <StarRating value={reviews[0].rating} />
                  <p className="text-text-secondary font-body text-xs mt-2 line-clamp-3">{reviews[0].text}</p>
                  <p className="text-text-secondary/60 font-body text-xs mt-2">— {reviews[0].author?.fullName}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Experience Tab ── */}
        {activeTab === "experience" && (
          <div className="bg-surface-card border border-surface-container-high rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-orange-rich text-[20px]">work_history</span>
                Experience
              </h2>
              {isSelf && !editingExp && (
                <button onClick={() => { setExpDraft([...( profile.experience || [])]); setEditingExp(true); }}
                  className="text-text-secondary hover:text-accent-orange-rich transition-colors">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              )}
            </div>

            {editingExp ? (
              <div className="space-y-4">
                {expDraft.map((exp, i) => (
                  <div key={i} className="p-4 bg-surface-container-high rounded-xl space-y-2 relative">
                    <button onClick={() => setExpDraft((p) => p.filter((_, j) => j !== i))}
                      className="absolute top-3 right-3 text-text-secondary hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                    {[
                      { key: "position", label: "Role / Title", placeholder: "e.g. Lead Backend Engineer" },
                      { key: "company", label: "Company", placeholder: "e.g. FinFlow Tech" },
                      { key: "startYear", label: "Start Year", placeholder: "2021" },
                      { key: "endYear", label: "End Year", placeholder: "Present" },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="text-[10px] font-heading uppercase tracking-wide text-text-secondary mb-0.5 block">{label}</label>
                        <input type="text" value={exp[key] || ""} placeholder={placeholder}
                          onChange={(e) => setExpDraft((p) => p.map((x, j) => j === i ? { ...x, [key]: e.target.value } : x))}
                          className="w-full bg-surface border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-sm focus:outline-none focus:border-accent-orange-rich" />
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wide text-text-secondary mb-0.5 block">Description</label>
                      <textarea value={exp.description || ""} rows={2}
                        onChange={(e) => setExpDraft((p) => p.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                        className="w-full bg-surface border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-sm resize-none focus:outline-none focus:border-accent-orange-rich" />
                    </div>
                  </div>
                ))}
                <button onClick={() => setExpDraft((p) => [...p, { position: "", company: "", startYear: "", endYear: "Present", description: "" }])}
                  className="w-full py-2 border border-dashed border-accent-orange-rich/40 text-accent-orange-rich text-sm font-body rounded-xl hover:bg-accent-orange-muted transition-colors">
                  + Add experience
                </button>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingExp(false)} className="px-3 py-1.5 text-text-secondary border border-outline-variant rounded-lg font-body text-sm hover:bg-surface-container-high">Cancel</button>
                  <button onClick={async () => { await saveSection("exp", { experience: expDraft }); setEditingExp(false); }}
                    disabled={savingSection === "exp"}
                    className="px-4 py-1.5 bg-accent-orange-rich text-white rounded-lg font-body text-sm font-medium disabled:opacity-50">
                    {savingSection === "exp" ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (profile.experience || []).length === 0 ? (
              <p className="text-text-secondary font-body text-sm italic">No experience added yet.</p>
            ) : (
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-surface-container-high" />
                {(profile.experience || []).map((exp, i) => (
                  <div key={i} className="relative mb-6 last:mb-0">
                    <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2 border-accent-orange-rich bg-surface" />
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-heading font-semibold text-text-primary">{exp.position}</h3>
                        <p className="text-accent-orange-rich font-body text-sm">{exp.company}</p>
                      </div>
                      <span className="text-text-secondary font-body text-xs shrink-0">{exp.startYear} – {exp.endYear || "Present"}</span>
                    </div>
                    {exp.description && <p className="text-text-secondary font-body text-sm mt-1 leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Posts Tab ── */}
        {activeTab === "posts" && <ProfilePosts />}

        {/* ── Reviews Tab ── */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-4">
            {canReview && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)}
                className="self-start px-4 py-2 bg-accent-orange-rich text-white rounded-lg font-heading font-semibold text-sm hover:bg-accent-orange-rich/90 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">rate_review</span>
                Write a Review
              </button>
            )}
            {showReviewForm && (
              <div className="bg-surface-card border border-accent-orange-rich/30 rounded-xl p-5 space-y-3">
                <h3 className="font-heading font-semibold text-text-primary">Your Review</h3>
                <StarRating value={reviewRating} onChange={setReviewRating} />
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={4}
                  placeholder="Share your experience working together..."
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-sm resize-none focus:outline-none focus:border-accent-orange-rich" />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowReviewForm(false)} className="px-3 py-1.5 text-text-secondary border border-outline-variant rounded-lg font-body text-sm">Cancel</button>
                  <button onClick={handleSubmitReview} disabled={!reviewText.trim() || submittingReview}
                    className="px-4 py-1.5 bg-accent-orange-rich text-white rounded-lg font-body text-sm font-medium disabled:opacity-50">
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            )}
            {reviews.length === 0 ? (
              <div className="bg-surface-card border border-surface-container-high rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-text-secondary/30 block mb-2">reviews</span>
                <p className="text-text-secondary font-body text-sm">No reviews yet.</p>
              </div>
            ) : reviews.map((r) => (
              <div key={r._id} className="bg-surface-card border border-surface-container-high rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-xs shrink-0">
                    {(r.author?.fullName || "?")[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <p className="font-heading font-semibold text-text-primary text-sm">{r.author?.fullName}</p>
                      <span className="text-text-secondary text-xs font-body">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-text-secondary/70 text-xs font-body">{r.project?.title}</p>
                    <StarRating value={r.rating} />
                  </div>
                </div>
                <p className="text-text-secondary font-body text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Modal */}
      {!isSelf && (
        <ConnectModal
          isOpen={connectOpen}
          onClose={() => setConnectOpen(false)}
          targetUser={{ id: id, fullName: profile.fullName, avatar: profile.avatar, title: profile.title }}
        />
      )}

      {/* Profile Card Edit Modal */}
      {editingCard && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingCard(false)} />
          <div className="relative w-full max-w-md bg-surface-card border border-surface-container-high rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.2s_ease]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high">
              <h2 className="font-heading font-bold text-text-primary">Edit Profile</h2>
              <button onClick={() => setEditingCard(false)} className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {[
                { key: "fullName", label: "Full Name", placeholder: "Your name" },
                { key: "title", label: "Title / Role", placeholder: "e.g. Frontend Engineer" },
                { key: "location", label: "Location", placeholder: "e.g. Bengaluru, India" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1 block">{label}</label>
                  <input
                    type="text"
                    value={cardDraft[key] || ""}
                    onChange={(e) => setCardDraft((d) => ({ ...d, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 text-text-primary font-body focus:outline-none focus:border-accent-orange-rich transition-colors"
                  />
                </div>
              ))}
              {/* Availability */}
              <div>
                <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1 block">Availability</label>
                <div className="flex gap-2 flex-wrap">
                  {AVAILABILITY_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => setCardDraft((d) => ({ ...d, availability: o.value }))}
                      className={`px-3 py-1.5 rounded-full border text-xs font-heading font-semibold transition-all ${cardDraft.availability === o.value ? o.color + " border-current" : "border-outline-variant text-text-secondary"}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Skills */}
              <div>
                <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1 block">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={cardSkillInput}
                    onChange={(e) => setCardSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && cardSkillInput.trim()) {
                        e.preventDefault();
                        const s = cardSkillInput.trim();
                        if (!cardDraft.skills.includes(s)) {
                          setCardDraft((d) => ({ ...d, skills: [...d.skills, s] }));
                        }
                        setCardSkillInput("");
                      }
                    }}
                    placeholder="Add skill + Enter"
                    className="flex-1 bg-surface-container-high border border-outline-variant rounded-lg py-2 px-3 text-text-primary font-body text-sm focus:outline-none focus:border-accent-orange-rich transition-colors"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(cardDraft.skills || []).map((s) => (
                    <span key={s} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-outline-variant text-text-secondary font-body text-xs">
                      {s}
                      <button onClick={() => setCardDraft((d) => ({ ...d, skills: d.skills.filter((x) => x !== s) }))} className="hover:text-red-400 transition-colors">
                        <span className="material-symbols-outlined text-[12px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-surface-container-high flex justify-end gap-2">
              <button onClick={() => setEditingCard(false)} className="px-4 py-2 text-text-secondary border border-outline-variant rounded-lg font-body text-sm hover:bg-surface-container-high transition-colors">Cancel</button>
              <button
                onClick={saveCard}
                disabled={savingCard || !cardDraft.fullName?.trim()}
                className="px-4 py-2 bg-accent-orange-rich text-white rounded-lg font-body text-sm font-medium hover:bg-accent-orange-rich/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingCard ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
