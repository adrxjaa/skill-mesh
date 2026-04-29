import { createContext, useState, useCallback } from "react";
import api from "../services/api";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/tasks", { params });
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    const res = await api.post("/tasks", taskData);
    const newTask = res.data.task || res.data;
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = async (taskId, taskData) => {
    const res = await api.put(`/tasks/${taskId}`, taskData);
    const updated = res.data.task || res.data;
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? updated : t))
    );
    return updated;
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const value = {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export default TaskContext;
