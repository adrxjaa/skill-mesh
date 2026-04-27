function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 group">
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {user.name}
      </h3>

      <p className="text-sm text-slate-600 mb-4">
        {user.bio}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {user.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors duration-200 font-medium">
        Connect
      </button>
    </div>
  );
}

export default ProfileCard;