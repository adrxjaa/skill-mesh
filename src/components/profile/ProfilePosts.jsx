import useFeed from "../../hooks/useFeed";
import RequirementPostCard from "../dashboard/RequirementPostCard";
import CommunityPostCard from "../dashboard/CommunityPostCard";

function ProfilePosts() {
  const { posts } = useFeed();

  // Filter to only the current user's posts
  const userPosts = posts.filter((p) => p.author.id === "u1");

  if (userPosts.length === 0) {
    return (
      <div className="text-center py-xl">
        <span className="material-symbols-outlined text-5xl text-text-secondary/30 mb-4 block">
          edit_note
        </span>
        <p className="text-text-secondary font-body text-body-md">
          You haven't posted anything yet. Head to the feed to create your first post!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {userPosts.map((post) =>
        post.type === "requirement" ? (
          <RequirementPostCard key={post.id} post={post} />
        ) : (
          <CommunityPostCard key={post.id} post={post} />
        )
      )}
    </div>
  );
}

export default ProfilePosts;
