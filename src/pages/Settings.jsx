import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = (() => {
    if (!newPassword) return 0;
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-400", "bg-blue-400", "bg-green-500"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      await api.patch("/auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 p-5 pb-24 lg:pb-8 max-w-lg mx-auto w-full">
      <div className="mb-7">
        <h1 className="font-heading font-bold text-text-primary text-2xl">Settings</h1>
        <p className="text-text-secondary font-body text-sm mt-0.5">Manage your account preferences</p>
      </div>

      {/* Change Password Card */}
      <section className="bg-surface-card border border-surface-container-high rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-accent-orange-muted flex items-center justify-center">
            <span className="material-symbols-outlined text-accent-orange-rich text-[20px]">lock</span>
          </div>
          <div>
            <h2 className="font-heading font-semibold text-text-primary">Change Password</h2>
            <p className="text-text-secondary font-body text-xs">Keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current password */}
          <div>
            <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1.5 block">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 pr-10 text-text-primary font-body focus:outline-none focus:border-accent-orange-rich transition-colors"
              />
              <button type="button" onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">{showCurrent ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1.5 block">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min. 8 characters"
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2.5 px-3 pr-10 text-text-primary font-body focus:outline-none focus:border-accent-orange-rich transition-colors"
              />
              <button type="button" onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">{showNew ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            {/* Strength meter */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : "bg-surface-container-high"}`} />
                  ))}
                </div>
                <p className={`text-xs font-body ${["", "text-red-400", "text-amber-400", "text-blue-400", "text-green-400"][strength]}`}>{strengthLabel}</p>
              </div>
            )}
          </div>

          {/* Confirm new password */}
          <div>
            <label className="text-xs font-heading uppercase tracking-wide text-text-secondary mb-1.5 block">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                className={`w-full bg-surface-container-high border rounded-lg py-2.5 px-3 pr-10 text-text-primary font-body focus:outline-none transition-colors ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-outline-variant focus:border-accent-orange-rich"
                }`}
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">{showConfirm ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-red-400 text-xs font-body mt-1">Passwords don't match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="w-full bg-accent-orange-rich text-white py-2.5 rounded-lg font-heading font-semibold text-sm hover:bg-accent-orange-rich/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</>
            ) : (
              <><span className="material-symbols-outlined text-[18px]">lock_reset</span>Update Password</>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Settings;
