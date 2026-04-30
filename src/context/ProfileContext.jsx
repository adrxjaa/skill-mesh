import { createContext, useState, useCallback, useEffect } from "react";
import mockUsers from "../data/mockUsers";

const ProfileContext = createContext(null);

/* ── localStorage helpers ── */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Seed profile from the demo user (u1 = Ananya Bhat) in mockUsers */
function getDefaultProfile() {
  const u = mockUsers.find((u) => u.id === "u1");
  return u || {};
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() =>
    loadJSON("sm_profile_data", getDefaultProfile())
  );

  /* Persist to localStorage on every change */
  useEffect(() => saveJSON("sm_profile_data", profile), [profile]);

  /** Partial update — merges fields into profile */
  const updateProfile = useCallback((fields) => {
    setProfile((prev) => ({ ...prev, ...fields }));
  }, []);

  /** Update avatar URL */
  const updateAvatar = useCallback((url) => {
    setProfile((prev) => ({ ...prev, avatar: url }));
  }, []);

  /* ── Skills ── */
  const addSkill = useCallback((skill) => {
    if (!skill.trim()) return;
    setProfile((prev) => {
      if (prev.skills.includes(skill.trim())) return prev;
      return { ...prev, skills: [...prev.skills, skill.trim()] };
    });
  }, []);

  const removeSkill = useCallback((skill) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }, []);

  /* ── Open To ── */
  const addOpenTo = useCallback((item) => {
    if (!item.trim()) return;
    setProfile((prev) => {
      if (prev.openTo.includes(item.trim())) return prev;
      return { ...prev, openTo: [...prev.openTo, item.trim()] };
    });
  }, []);

  const removeOpenTo = useCallback((item) => {
    setProfile((prev) => ({
      ...prev,
      openTo: prev.openTo.filter((o) => o !== item),
    }));
  }, []);

  /* ── Experience ── */
  const addExperience = useCallback((exp) => {
    setProfile((prev) => ({
      ...prev,
      experience: [exp, ...prev.experience],
    }));
  }, []);

  const updateExperience = useCallback((index, fields) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === index ? { ...e, ...fields } : e
      ),
    }));
  }, []);

  const removeExperience = useCallback((index) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }, []);

  /* ── Projects ── */
  const addProject = useCallback((project) => {
    setProfile((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
    }));
  }, []);

  const updateProject = useCallback((index, fields) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === index ? { ...p, ...fields } : p
      ),
    }));
  }, []);

  const removeProject = useCallback((index) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  }, []);

  /* ── Social Links ── */
  const updateSocialLinks = useCallback((links) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, ...links },
    }));
  }, []);

  const value = {
    profile,
    updateProfile,
    updateAvatar,
    addSkill,
    removeSkill,
    addOpenTo,
    removeOpenTo,
    addExperience,
    updateExperience,
    removeExperience,
    addProject,
    updateProject,
    removeProject,
    updateSocialLinks,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export default ProfileContext;
