import ProfileCard from "../components/common/Profilecard";

function Dashboard() {
  // TEMP FAKE DATA (replace later with API)
  const users = [
    {
      name: "Aisha",
      bio: "Frontend dev passionate about UI/UX",
      skills: ["React", "CSS", "Figma"]
    },
    {
      name: "Rahul",
      bio: "Backend developer who loves APIs",
      skills: ["Node.js", "MongoDB", "Express"]
    },
    {
      name: "Neha",
      bio: "AI enthusiast working on ML models",
      skills: ["Python", "TensorFlow", "NLP"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Recommended Teammates
          </h1>
          <p className="text-slate-600">
            Discover talented professionals who share your skills and interests
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <ProfileCard key={index} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;