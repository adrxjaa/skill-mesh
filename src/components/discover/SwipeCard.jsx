import { useRef, useState, useCallback } from "react";

/**
 * Availability badge colours keyed by the schema enum.
 */
const availabilityConfig = {
  "open-to-work": { label: "Open to work", color: "bg-emerald-100 text-emerald-700" },
  freelancing: { label: "Freelancing", color: "bg-blue-100 text-blue-700" },
  "not-available": { label: "Not available", color: "bg-slate-100 text-slate-500" },
};

/**
 * SwipeCard — A draggable profile card with full user information.
 *
 * Props:
 *   user       – user data object (from mockUsers)
 *   onSwipe    – callback(direction: 'left' | 'right')
 *   isTop      – whether this card is the active (top) card
 *   stackIndex – 0 = top, 1 = behind‑1, 2 = behind‑2 (used for stacking transforms)
 */
function SwipeCard({ user, onSwipe, isTop = false, stackIndex = 0 }) {
  const cardRef = useRef(null);
  const [dragState, setDragState] = useState({ x: 0, y: 0, dragging: false });
  const startPos = useRef({ x: 0, y: 0 });

  /* ── Threshold: 35 % of card width ── */
  const getThreshold = () => {
    if (!cardRef.current) return 150;
    return cardRef.current.offsetWidth * 0.35;
  };

  /* ── Pointer handlers ── */
  const handlePointerDown = useCallback(
    (e) => {
      if (!isTop) return;
      // Ignore if the user is scrolling inside the card body
      if (e.target.closest(".swipe-card-body")) {
        const body = e.target.closest(".swipe-card-body");
        if (body && body.scrollHeight > body.clientHeight) {
          // If the pointer is inside a scrollable area and it CAN scroll, let it scroll
          // We only start dragging from the header area or if the body isn't scrollable
          return;
        }
      }
      cardRef.current?.setPointerCapture(e.pointerId);
      startPos.current = { x: e.clientX, y: e.clientY };
      setDragState((prev) => ({ ...prev, dragging: true }));
    },
    [isTop]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragState.dragging) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      setDragState({ x: dx, y: dy, dragging: true });
    },
    [dragState.dragging]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragState.dragging) return;
    const threshold = getThreshold();

    if (Math.abs(dragState.x) > threshold) {
      // Fly off
      const direction = dragState.x > 0 ? "right" : "left";
      const flyX = dragState.x > 0 ? window.innerWidth : -window.innerWidth;
      setDragState({ x: flyX, y: dragState.y, dragging: false });
      setTimeout(() => {
        onSwipe?.(direction);
      }, 300);
    } else {
      // Snap back
      setDragState({ x: 0, y: 0, dragging: false });
    }
  }, [dragState, onSwipe]);

  /* ── Derived values ── */
  const rotation = dragState.x / 20; // ±degrees
  const connectOpacity = Math.min(Math.max(dragState.x / 120, 0), 1);
  const skipOpacity = Math.min(Math.max(-dragState.x / 120, 0), 1);

  const cardStyle = {
    transform: isTop
      ? `translateX(${dragState.x}px) translateY(${dragState.y * 0.3}px) rotate(${rotation}deg)`
      : `scale(${1 - stackIndex * 0.05}) translateY(${stackIndex * 14}px)`,
    transition: dragState.dragging ? "none" : "transform 0.45s cubic-bezier(.175,.885,.32,1.275), opacity 0.45s ease",
    zIndex: 10 - stackIndex,
    opacity: stackIndex > 2 ? 0 : 1,
    cursor: isTop ? "grab" : "default",
    touchAction: "none",
  };

  /* ── Availability badge ── */
  const avail = availabilityConfig[user.availability] || availabilityConfig["not-available"];

  return (
    <div
      ref={cardRef}
      className="swipe-card absolute inset-0 select-none"
      style={cardStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        {/* ── Swipe overlays ── */}
        {isTop && (
          <>
            <div
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-emerald-500/10 backdrop-blur-[1px]"
              style={{ opacity: connectOpacity }}
            >
              <span className="rounded-2xl border-4 border-emerald-500 px-8 py-4 text-4xl font-black uppercase tracking-widest text-emerald-500 rotate-[-15deg]">
                Connect ✓
              </span>
            </div>
            <div
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-red-500/10 backdrop-blur-[1px]"
              style={{ opacity: skipOpacity }}
            >
              <span className="rounded-2xl border-4 border-red-500 px-8 py-4 text-4xl font-black uppercase tracking-widest text-red-500 rotate-[15deg]">
                Skip ✗
              </span>
            </div>
          </>
        )}

        {/* ── Card content (scrollable) ── */}
        <div className="swipe-card-body h-full overflow-y-auto overscroll-contain">
          {/* ── Banner + Avatar ── */}
          <div className="relative">
            <div className="h-28 bg-gradient-to-br from-orange-400 via-orange-500 to-slate-900" />
            <div className="absolute -bottom-10 left-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-orange-100 text-xl font-bold text-orange-600 shadow-lg">
                {user.initials}
              </div>
            </div>
          </div>

          {/* ── Header info ── */}
          <div className="px-6 pt-14 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{user.displayName}</h3>
                <p className="mt-0.5 text-sm text-slate-500">@{user.username} · {user.location}</p>
              </div>
              <span className={`mt-1 shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${avail.color}`}>
                {avail.label}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{user.bio}</p>
          </div>

          {/* ── Skills ── */}
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* ── About Me ── */}
          {user.aboutMe && (
            <div className="mx-6 mb-4 rounded-xl bg-slate-50 p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">About</h4>
              <p className="text-sm leading-relaxed text-slate-600">{user.aboutMe}</p>
            </div>
          )}

          {/* ── Experience ── */}
          {user.experience?.length > 0 && (
            <div className="px-6 pb-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Experience</h4>
              <div className="space-y-3">
                {user.experience.map((exp, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{exp.position}</p>
                        <p className="text-sm text-orange-600">{exp.company}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                        {exp.isCurrent
                          ? `${new Date(exp.startDate).getFullYear()} – Present`
                          : `${new Date(exp.startDate).getFullYear()} – ${new Date(exp.endDate).getFullYear()}`}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Projects ── */}
          {user.projects?.length > 0 && (
            <div className="px-6 pb-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Projects</h4>
              <div className="space-y-3">
                {user.projects.map((proj, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900">{proj.title}</p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          proj.status === "ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : proj.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">{proj.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="rounded bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Open To ── */}
          {user.openTo?.length > 0 && (
            <div className="px-6 pb-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Open to</h4>
              <div className="flex flex-wrap gap-2">
                {user.openTo.map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Social links ── */}
          {user.socialLinks && Object.values(user.socialLinks).some(Boolean) && (
            <div className="px-6 pb-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Links</h4>
              <div className="space-y-2">
                {Object.entries(user.socialLinks)
                  .filter(([, v]) => v)
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-5 text-center text-slate-400">🔗</span>
                      <span className="truncate">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── Stats ── */}
          {user.stats && (
            <div className="mx-6 mb-6 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">{user.stats.projects}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">{user.stats.connections}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Connections</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">{user.stats.responseRate}%</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Response</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SwipeCard;
