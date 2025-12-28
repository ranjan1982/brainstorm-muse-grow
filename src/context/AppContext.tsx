import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Task, UserRole } from '@/types';
import { mockUsers, mockTasks } from '@/data/mockData';

interface NewTaskData {
  title: string;
  description?: string;
  phase: Task['phase'];
  owner: Task['owner'];
  cadence?: Task['cadence'];
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addComment: (taskId: string, content: string) => void;
  addTask: (taskData: NewTaskData) => void;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  users: User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const users = mockUsers;

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const addComment = (taskId: string, content: string) => {
    if (!currentUser) return;
    
    const comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content,
      createdAt: new Date(),
    };

    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, comments: [...task.comments, comment], updatedAt: new Date() }
        : task
    ));
  };

  const generateTaskId = (phase: Task['phase']) => {
    const phasePrefix: Record<Task['phase'], string> = {
      'onboarding': 'ONB',
      'foundation': 'FND',
      'execution': 'EXE',
      'ai': 'AIO',
      'reporting': 'RPT',
      'monitoring': 'MON',
    };
    const phaseTasks = tasks.filter(t => t.phase === phase);
    const nextNum = String(phaseTasks.length + 1).padStart(3, '0');
    return `ST-${phasePrefix[phase]}-${nextNum}`;
  };

  const addTask = (taskData: NewTaskData) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      taskId: generateTaskId(taskData.phase),
      title: taskData.title,
      description: taskData.description,
      phase: taskData.phase,
      owner: taskData.owner,
      status: 'pending',
      cadence: taskData.cadence,
      comments: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks(prev => [...prev, newTask]);
  };

  const login = (role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      tasks,
      setTasks,
      updateTask,
      addComment,
      addTask,
      isAuthenticated: !!currentUser,
      login,
      logout,
      users,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
