
import { createContext, useContext, useState, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tasksAPI.getAll();
      setTasks(res.data.data.tasks);
    } catch {
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    const toastId = toast.loading('Creating task…');
    try {
      const res = await tasksAPI.create(data);
      const newTask = res.data.data.task;
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created!', { id: toastId });
      return { success: true, task: newTask };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task.';
      toast.error(msg, { id: toastId });
      return { success: false };
    }
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const toastId = toast.loading('Saving…');
    try {
      const res = await tasksAPI.update(id, data);
      const updated = res.data.data.task;
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      toast.success('Task updated!', { id: toastId });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task.';
      toast.error(msg, { id: toastId });
      return { success: false };
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    const toastId = toast.loading('Deleting…');
    try {
      await tasksAPI.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted.', { id: toastId });
      return { success: true };
    } catch {
      toast.error('Failed to delete task.', { id: toastId });
      return { success: false };
    }
  }, []);

  // Optimistic stage update for drag-and-drop
  const moveTask = useCallback(async (id, stage) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, stage } : t));
    try {
      await tasksAPI.update(id, { stage });
    } catch {
      toast.error('Could not move task.');
      // Re-fetch to restore correct state
      const res = await tasksAPI.getAll();
      setTasks(res.data.data.tasks);
    }
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, loading, fetchTasks, createTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be inside TaskProvider');
  return ctx;
}
