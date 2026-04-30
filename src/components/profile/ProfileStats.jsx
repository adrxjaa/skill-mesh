import useProfile from "../../hooks/useProfile";
import useFeed from "../../hooks/useFeed";

function ProfileStats() {
  const { profile } = useProfile();
  const { posts, interestedPosts } = useFeed();

  // Count user's own posts
  const userPostCount = posts.filter((p) => p.author.id === "u1").length;
  const connectionsCount = profile.stats?.connections || 0;
  const interestsCount = interestedPosts?.length || 0;

  const stats = [
    { label: "Posts", value: userPostCount, icon: "dynamic_feed" },
    { label: "Connections", value: connectionsCount, icon: "group" },
    { label: "Interests", value: interestsCount, icon: "interests" },
  ];

  return (
    <section className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-surface-card border border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-accent-orange-rich/30 transition-colors"
        >
          <span className="material-symbols-outlined text-text-secondary/50 text-2xl mb-2">
            {stat.icon}
          </span>
          <span className="font-heading text-h1 text-text-primary mb-1">
            {stat.value}
          </span>
          <span className="font-heading text-label-caps text-text-secondary uppercase">
            {stat.label}
          </span>
        </div>
      ))}
    </section>
  );
}

export default ProfileStats;
