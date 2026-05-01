import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Card, CardHeaders, CardContent } from '../components/common/Card';

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
    <div className="flex-1 min-h-0 bg-dark-bg text-text-primary flex items-center justify-center">
      {/* Main Content */}
      <main className="w-full px-4 py-12 overflow-auto min-h-0">
        <div className="w-full max-w-md mx-auto">
          {/* Card */}
          <Card className="bg-surface-container rounded-xl shadow-none pt-5 pb-5 border-t-4 border-primary">
            <CardHeaders className="flex-col justify-center pb-8 pt-8 px-8">
              {/* Heading */}
              <h1 className="text-3xl font-bold text-center text-text-primary mb-2">
                Create your
                <br />
                builder profile
              </h1>
              
              {/* Subtext */}
              <p className="text-center text-text-secondary text-sm">
                Join the network of creators and developers.
              </p>
            </CardHeaders>

            <CardContent className="px-8 pb-8">
              {/* Form */}
              <div className="space-y-5 mb-6">
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-surface-container-lowest rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition focus:border"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-surface-container-lowest rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition focus:border"
                  />
                </div>

                {/* Password */}
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-lowest rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition focus:border"
                  />
                </div>

                {/* Skills Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-text-primary">Initial Skills</label>
                    <span className="text-xs text-text-secondary">separate with comma</span>
                  </div>
                  
                  <div className="bg-surface-container-lowest rounded-lg p-4">
                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map((skill, index) => (
                        <div key={index} className="bg-surface-container-high rounded-full px-3 py-1 flex items-center gap-2 text-sm">
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Register;
