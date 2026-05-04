import { useState } from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardBottomNav from "../components/dashboard/DashboardBottomNav";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSkills from "../components/profile/ProfileSkills";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfilePosts from "../components/profile/ProfilePosts";
import ProfileAbout from "../components/profile/ProfileAbout";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="min-h-screen bg-background text-text-primary font-body">
      {/* Shared sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex pt-16">
        <main className="flex-1 lg:ml-64 px-4 md:px-8 py-6 max-w-5xl mx-auto pb-24 lg:pb-12">
          <ProfileHeader />
          <ProfileSkills />
          <ProfileStats />
          <section>
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === "posts" ? <ProfilePosts /> : <ProfileAbout />}
          </section>
        </main>
      </div>

      {/* Shared bottom nav */}
      <DashboardBottomNav />
    </div>
  );
}

export default Profile;
