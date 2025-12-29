import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Task, UserRole } from '@/types';
import { mockUsers, mockTasks } from '@/data/mockData';

interface NewTaskData {
  title: string;
  description?: string;
  phase: Task['phase'];
  owner: Task['owner'];
  approver?: Task['approver'];
  cadence?: Task['cadence'];
  attachments?: Task['attachments'];
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addComment: (taskId: string, content: string, attachments?: { name: string; size: number; type: string; url: string }[]) => void;
  addDocumentToTask: (taskId: string, document: { name: string; url: string }) => void;
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

  const addComment = (taskId: string, content: string, attachments?: { name: string; size: number; type: string; url: string }[]) => {
    if (!currentUser) return;
    
    const comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content,
      attachments: attachments?.map((a, idx) => ({
        id: `attachment-${Date.now()}-${idx}`,
        ...a
      })),
      createdAt: new Date(),
    };

    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, comments: [...task.comments, comment], updatedAt: new Date() }
        : task
    ));
  };

  const addDocumentToTask = (taskId: string, document: { name: string; url: string }) => {
    if (!currentUser) return;
    
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: document.name,
      url: document.url,
      uploadedBy: currentUser.id,
      uploadedAt: new Date(),
    };

    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, documents: [...task.documents, newDoc], updatedAt: new Date() }
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
      approver: taskData.approver,
      status: 'pending',
      cadence: taskData.cadence,
      comments: [],
      documents: [],
      attachments: taskData.attachments || [],
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
      addDocumentToTask,
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
