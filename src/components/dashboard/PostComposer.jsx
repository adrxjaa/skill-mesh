import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import CreatePostModal from "./CreatePostModal";

function PostComposer() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Listen for the global event dispatched by the sidebar "Create Post" button
  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener("open-create-post", handler);
    return () => window.removeEventListener("open-create-post", handler);
  }, []);

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      <div
        data-composer-card
        onClick={() => setModalOpen(true)}
        className="bg-surface-card border border-surface-container-high rounded-xl p-4 flex gap-4 items-center shadow-sm cursor-pointer hover:border-accent-orange-rich/40 hover:shadow-[0_0_12px_rgba(242,113,33,0.07)] transition-all duration-200 group"
      >
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-accent-orange-rich/20 flex items-center justify-center text-accent-orange-rich font-heading font-bold text-sm flex-shrink-0">
          {initials}
        </div>

        {/* Placeholder */}
        <div className="flex-1">
          <p className="text-text-secondary/60 font-body text-body-md group-hover:text-text-secondary/80 transition-colors">
            Share an update or look for a team...
          </p>
        </div>

        {/* Quick action icons */}
        <div className="flex items-center gap-2 text-text-secondary/40 group-hover:text-text-secondary/70 transition-colors shrink-0">
          <span className="material-symbols-outlined text-[20px]">image</span>
          <span className="material-symbols-outlined text-[20px]">link</span>
          <span className="material-symbols-outlined text-[20px]">sell</span>
        </div>
      </div>

      <CreatePostModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default PostComposer;
