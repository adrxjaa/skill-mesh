import { useState } from "react";

function Requests() {
  const [activeTab, setActiveTab] = useState("incoming");

  // TEMP DATA (replace with API later)
  const incoming = [
    {
      name: "Rahul",
      skills: ["Node.js", "MongoDB"],
      status: "pending"
    },
    {
      name: "Neha",
      skills: ["Python", "ML"],
      status: "pending"
    }
  ];

  const sent = [
    {
      name: "Aisha",
      skills: ["React", "UI/UX"],
      status: "pending"
    }
  ];

  const handleAccept = (name) => {
    console.log("Accepted:", name);
  };

  const handleReject = (name) => {
    console.log("Rejected:", name);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Collaboration Requests
          </h1>
          <p className="text-slate-600">
            Manage your incoming and sent collaboration requests
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`px-4 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === "incoming"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Incoming
          </button>

          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === "sent"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Sent
          </button>
        </div>

        {/* REQUEST LIST */}
        <div className="grid md:grid-cols-2 gap-6">
          {(activeTab === "incoming" ? incoming : sent).map((req, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                {req.name}
              </h3>

              <div className="flex flex-wrap gap-2 mb-6">
                {req.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {activeTab === "incoming" ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(req.name)}
                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(req.name)}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors duration-200 font-medium">
                  Withdraw
                </button>
              )}
            </div>
          ))}
        </div>

        {(activeTab === "incoming" ? incoming : sent).length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No {activeTab} requests yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;