import { useState } from "react";

function Profile() {
  const [bio, setBio] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ bio, skills });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-4 py-12">
      
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-xl border border-slate-200">
        
        <h2 className="text-2xl font-semibold text-slate-900 mb-8">
          Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-slate-700 mb-2 font-medium text-sm">
              Bio
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself, your experience, and interests..."
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium text-sm">
              Skills
            </label>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                placeholder="Add a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
              >
                Add
              </button>
            </div>

            {/* SKILL TAGS */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 font-medium"
                >
                  {skill}
                  <button 
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="hover:text-slate-900 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;