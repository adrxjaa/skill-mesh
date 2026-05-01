import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skills, setSkills] = useState(['React', 'UI Design']);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      const newSkills = skillInput.split(',').map(s => s.trim()).filter(s => s);
      setSkills([...skills, ...newSkills]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleBlur = () => {
    if (skillInput.trim()) {
      const newSkills = skillInput.split(',').map(s => s.trim()).filter(s => s);
      setSkills([...skills, ...newSkills]);
      setSkillInput('');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-border-color bg-dark-bg">
        <div className="flex h-16 items-center justify-between px-8 lg:px-12">
          <div className="text-2xl font-bold text-primary">SkillMesh</div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition">
              Login
            </Link>
            <button className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition">
              Join Now
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card-bg rounded-xl border border-border-color p-8">
            {/* Heading */}
            <h1 className="text-3xl font-bold text-center text-text-primary mb-2">
              Create your
              <br />
              builder profile
            </h1>
            
            {/* Subtext */}
            <p className="text-center text-text-secondary text-sm mb-8">
              Join the network of creators and developers.
            </p>

            {/* Form */}
            <div className="space-y-5 mb-6">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-input-bg border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full bg-input-bg border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-input-bg border border-border-color rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>

              {/* Skills Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-text-primary">Initial Skills</label>
                  <span className="text-xs text-text-secondary">separate with comma</span>
                </div>
                
                <div className="bg-input-bg border border-border-color rounded-lg p-4">
                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="bg-skill-tag border border-border-color rounded-full px-3 py-1 flex items-center gap-2 text-sm">
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(index)}
                          className="hover:text-primary transition"
                          aria-label="Remove skill"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Skill Input */}
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    onBlur={handleBlur}
                    placeholder="Add a skill..."
                    className="w-full bg-transparent text-text-primary placeholder-text-secondary outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Create Account Button */}
            <button className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-hover transition mb-6">
              Create Account
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:text-primary-hover transition">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-color bg-dark-bg">
        <div className="flex items-center justify-between px-8 lg:px-12 py-6 text-xs text-text-secondary">
          <div className="text-primary font-bold">SkillMesh</div>
          <div>© 2024 SkillMesh. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-text-primary transition">Privacy</a>
            <a href="#" className="hover:text-text-primary transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Register;
