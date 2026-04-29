import { useState, useCallback, useRef } from "react";
import SwipeCard from "./SwipeCard";

/**
 * CardStack — Manages the deck of SwipeCards.
 *
 * Props:
 *   users – array of user objects
 */
function CardStack({ users }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedUsers, setSwipedUsers] = useState([]); // { user, direction }
  const topCardRef = useRef(null);

  const handleSwipe = useCallback(
    (direction) => {
      const swipedUser = users[currentIndex];
      setSwipedUsers((prev) => [...prev, { user: swipedUser, direction }]);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, users]
  );

  /**
   * Called by ActionButtons to trigger a swipe programmatically.
   * We simulate this by directly calling handleSwipe after a brief animation.
   */
  const triggerSwipe = useCallback(
    (direction) => {
      if (currentIndex >= users.length) return;
      handleSwipe(direction);
    },
    [currentIndex, users.length, handleSwipe]
  );

  const resetStack = () => {
    setCurrentIndex(0);
    setSwipedUsers([]);
  };

  /* How many cards are left */
  const remaining = users.length - currentIndex;

  /* Show at most 3 stacked cards */
  const visibleCards = users.slice(currentIndex, currentIndex + 3);

  if (remaining <= 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-4xl">
          🎉
        </div>
        <h3 className="text-2xl font-bold text-slate-900">You've seen everyone!</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          You swiped through {users.length} profiles. Come back later for new teammates, or review your connections.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <p className="text-xs text-slate-400">
            Connected with{" "}
            <span className="font-semibold text-emerald-600">
              {swipedUsers.filter((s) => s.direction === "right").length}
            </span>{" "}
            · Skipped{" "}
            <span className="font-semibold text-red-500">
              {swipedUsers.filter((s) => s.direction === "left").length}
            </span>
          </p>
        </div>
        <button
          onClick={resetStack}
          className="mt-6 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* ── Counter ── */}
      <p className="text-sm text-slate-400">
        <span className="font-semibold text-slate-600">{currentIndex + 1}</span> of{" "}
        <span className="font-semibold text-slate-600">{users.length}</span> profiles
      </p>

      {/* ── Card stack ── */}
      <div className="relative h-[620px] w-full max-w-[420px]">
        {visibleCards
          .map((user, i) => (
            <SwipeCard
              key={user.id}
              user={user}
              isTop={i === 0}
              stackIndex={i}
              onSwipe={handleSwipe}
              ref={i === 0 ? topCardRef : undefined}
            />
          ))
          .reverse()  /* Render bottom cards first so top card is last in DOM (highest z) */}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex items-center gap-5">
        {/* Skip */}
        <button
          onClick={() => triggerSwipe("left")}
          className="group flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-200 bg-white text-red-400 shadow-md transition-all duration-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 hover:shadow-lg active:scale-90"
          title="Skip"
        >
          <svg className="h-7 w-7 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Super Connect */}
        <button
          onClick={() => triggerSwipe("right")}
          className="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-200 bg-white text-blue-400 shadow-md transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 hover:shadow-lg active:scale-90"
          title="Super Connect"
        >
          <svg className="h-6 w-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>

        {/* Connect */}
        <button
          onClick={() => triggerSwipe("right")}
          className="group flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-200 bg-white text-emerald-400 shadow-md transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-500 hover:shadow-lg active:scale-90"
          title="Connect"
        >
          <svg className="h-7 w-7 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CardStack;
