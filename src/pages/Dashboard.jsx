import useFeed from "../hooks/useFeed";
import PostComposer from "../components/dashboard/PostComposer";
import FeedFilters from "../components/dashboard/FeedFilters";
import RequirementPostCard from "../components/dashboard/RequirementPostCard";
import CommunityPostCard from "../components/dashboard/CommunityPostCard";
import TopDiscovered from "../components/dashboard/TopDiscovered";
import TrendingDiscussions from "../components/dashboard/TrendingDiscussions";

function Dashboard() {
  const { getFilteredPosts } = useFeed();
  const filteredPosts = getFilteredPosts();

  return (
    <main className="flex-1 p-4 md:p-5 flex gap-5 justify-center pb-24 lg:pb-5">
      {/* Feed Column */}
      <div className="w-full max-w-[680px] flex flex-col gap-4">
        <PostComposer />
        <FeedFilters />

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-5xl text-text-secondary/30 mb-4 block">
              dynamic_feed
            </span>
            <p className="text-text-secondary font-body text-body-md">
              No posts to show. Try a different filter or create a post!
            </p>
          </div>
        ) : (
          filteredPosts.map((post) =>
            post.type === "requirement" ? (
              <RequirementPostCard key={post.id} post={post} />
            ) : (
              <CommunityPostCard key={post.id} post={post} />
            )
          )
        )}
      </div>

      {/* Right Sidebar — xl+ only */}
      <aside className="hidden xl:flex w-[320px] flex-col gap-4 flex-shrink-0">
        <TopDiscovered />
        <TrendingDiscussions />
      </aside>
    </main>
  );
}

export default Dashboard;
