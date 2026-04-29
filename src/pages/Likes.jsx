import { useState } from "react";
import CardStack from "../components/discover/CardStack";
import MatchModal from "../components/discover/MatchModal";
import useMatch from "../hooks/useMatch";
import useAuth from "../hooks/useAuth";

function Likes() {
  const { getUnseenLikes, clearLatestMatch } = useMatch();
  const { user } = useAuth();
  const [matchedUser, setMatchedUser] = useState(null);

  const unseenLikes = getUnseenLikes();

  const handleSwipeResult = (result) => {
    if (result.matched && result.user) {
      setMatchedUser(result.user);
    }
  };

  const handleCloseModal = () => {
    setMatchedUser(null);
    clearLatestMatch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">
            SkillMesh
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            People Who Like You
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            These people already swiped right on your profile. Swipe right to match instantly!
          </p>
          {unseenLikes.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-1.5 text-sm font-medium text-pink-600">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                {unseenLikes.length}
              </span>
              pending {unseenLikes.length === 1 ? "like" : "likes"}
            </div>
          )}
        </div>

        {/* Swipe card stack — only unseen likes */}
        <CardStack
          users={unseenLikes}
          onSwipeResult={handleSwipeResult}
          emptyTitle="No pending likes"
          emptySubtitle="Keep discovering teammates — when someone likes your profile, they'll show up here."
        />
      </div>

      {/* Match modal */}
      {matchedUser && (
        <MatchModal
          matchedUser={matchedUser}
          currentUser={user}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Likes;
