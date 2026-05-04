import { createContext, useState, useEffect, useCallback, useContext } from "react";
import * as projectApi from "../services/projectApi";
import AuthContext from "./AuthContext";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const [p, i] = await Promise.all([
        projectApi.getMyProjects(),
        projectApi.getMyInvites(),
      ]);
      setProjects(p);
      setInvites(i);
    } catch {
      // Silently fail if backend not available (demo mode)
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(async ({ title, description }) => {
    const project = await projectApi.createProject({ title, description });
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const inviteToProject = useCallback(
    async (projectId, { targetUserId, sourcePost }) => {
      await projectApi.inviteToProject(projectId, { targetUserId, sourcePost });
    },
    []
  );

  const respondToInvite = useCallback(async (projectId, action) => {
    await projectApi.respondToInvite(projectId, action);
    await fetchProjects(); // Refresh
  }, [fetchProjects]);

  const respondToRequest = useCallback(async (projectId, userId, action) => {
    await projectApi.respondToRequest(projectId, userId, action);
    await fetchProjects();
  }, [fetchProjects]);

  const endProject = useCallback(async (projectId) => {
    await projectApi.endProject(projectId);
    setProjects((prev) =>
      prev.map((p) => p._id === projectId ? { ...p, status: 'completed' } : p)
    );
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        invites,
        loading,
        pendingInviteCount: invites.length,
        createProject,
        inviteToProject,
        respondToInvite,
        respondToRequest,
        endProject,
        refetch: fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export default ProjectContext;
