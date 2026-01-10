import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Task, UserRole, Client, Subscription, PaymentHistory, TaskTemplate, EmailTemplate, KPIData, SubscriptionTier } from '@/types';
import { mockUsers, mockTasks, mockClients, mockSubscriptions, mockPaymentHistory, mockTaskTemplates, mockEmailTemplates, mockKPIData } from '@/data/mockData';

interface NewTaskData {
  title: string;
  description?: string;
  phase: Task['phase'];
  owner: Task['owner'];
  approver?: Task['approver'];
  cadence?: Task['cadence'];
  attachments?: Task['attachments'];
  clientId?: string;
}

interface TaskWithClient extends Task {
  clientId: string;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  tasks: TaskWithClient[];
  setTasks: React.Dispatch<React.SetStateAction<TaskWithClient[]>>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addComment: (taskId: string, content: string, attachments?: { name: string; size: number; type: string; url: string }[]) => void;
  addDocumentToTask: (taskId: string, document: { name: string; url: string }) => void;
  addTask: (taskData: NewTaskData) => void;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  users: User[];
  // Multi-client management
  clients: Client[];
  currentClient: Client | null;
  setCurrentClient: (client: Client | null) => void;
  getClientTasks: (clientId?: string) => TaskWithClient[];
  getClientTasksForTier: (clientId?: string) => TaskWithClient[];
  getTaskTemplatesForTier: (tier: SubscriptionTier) => TaskTemplate[];
  getClientKPIData: (clientId: string) => KPIData;
  // Subscription management
  subscriptions: Subscription[];
  getClientSubscription: (clientId: string) => Subscription | undefined;
  upgradeSubscription: (clientId: string, newTier: SubscriptionTier) => void;
  // Admin features
  paymentHistory: PaymentHistory[];
  getClientPaymentHistory: (clientId: string) => PaymentHistory[];
  taskTemplates: TaskTemplate[];
  updateTaskTemplate: (templateId: string, updates: Partial<TaskTemplate>) => void;
  emailTemplates: EmailTemplate[];
  updateEmailTemplate: (templateId: string, updates: Partial<EmailTemplate>) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  updateClientInfo: (clientId: string, updates: Partial<Client>) => void;
  deleteUserAccount: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<TaskWithClient[]>(mockTasks);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [paymentHistory] = useState<PaymentHistory[]>(mockPaymentHistory);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>(mockTaskTemplates);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
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
    const clientId = taskData.clientId || currentClient?.id || 'client-1';
    const newTask: TaskWithClient = {
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
      clientId,
    };

    setTasks(prev => [...prev, newTask]);
  };

  const login = (role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      // Set default client for non-admin roles
      if (role === 'client') {
        const clientData = clients.find(c => c.id === user.id);
        setCurrentClient(clientData || null);
      } else if (role !== 'admin') {
        // For team members, set first active client as default
        const firstActiveClient = clients.find(c => c.isActive);
        setCurrentClient(firstActiveClient || null);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentClient(null);
  };

  // Multi-client management functions
  const getClientTasks = (clientId?: string) => {
    const targetClientId = clientId || currentClient?.id;
    if (!targetClientId) return tasks;
    return tasks.filter(t => t.clientId === targetClientId);
  };

  // Get task templates available for a specific subscription tier
  const getTaskTemplatesForTier = (tier: SubscriptionTier): TaskTemplate[] => {
    return taskTemplates.filter(t => t.isActive && t.tiers.includes(tier));
  };

  // Get client tasks filtered by their subscription tier
  const getClientTasksForTier = (clientId?: string): TaskWithClient[] => {
    const targetClientId = clientId || currentClient?.id;
    if (!targetClientId) return tasks;

    // Get the client's subscription tier
    const subscription = subscriptions.find(s => s.clientId === targetClientId);
    const tier = subscription?.tier || 'starter';

    // Get task template IDs available for this tier
    const availableTemplates = getTaskTemplatesForTier(tier);
    const availableTaskIds = new Set(availableTemplates.map(t => t.taskId));

    // Filter tasks by client AND by tier-available templates
    return tasks.filter(t =>
      t.clientId === targetClientId &&
      availableTaskIds.has(t.taskId)
    );
  };

  const getClientKPIData = (clientId: string): KPIData => {
    return mockKPIData[clientId] || {
      localPackVisibility: 0,
      gbpViews: 0,
      aiMentionScore: 0,
      tasksCompleted: 0,
      totalTasks: 0,
    };
  };

  const getClientSubscription = (clientId: string) => {
    return subscriptions.find(s => s.clientId === clientId);
  };

  const upgradeSubscription = (clientId: string, newTier: SubscriptionTier) => {
    const tierPrices: Record<SubscriptionTier, number> = {
      'starter': 299,
      'growth': 599,
      'enterprise': 999
    };

    setSubscriptions(prev => prev.map(sub =>
      sub.clientId === clientId
        ? { ...sub, tier: newTier, monthlyPrice: tierPrices[newTier] }
        : sub
    ));
  };

  const getClientPaymentHistory = (clientId: string) => {
    return paymentHistory.filter(p => p.clientId === clientId);
  };

  const updateTaskTemplate = (templateId: string, updates: Partial<TaskTemplate>) => {
    setTaskTemplates(prev => prev.map(tpl =>
      tpl.id === templateId
        ? { ...tpl, ...updates }
        : tpl
    ));
  };

  const updateEmailTemplate = (templateId: string, updates: Partial<EmailTemplate>) => {
    setEmailTemplates(prev => prev.map(tpl =>
      tpl.id === templateId
        ? { ...tpl, ...updates, updatedAt: new Date() }
        : tpl
    ));
  };

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const updateClientInfo = (clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client =>
      client.id === clientId
        ? { ...client, ...updates }
        : client
    ));
    if (currentClient && currentClient.id === clientId) {
      setCurrentClient({ ...currentClient, ...updates });
    }
  };

  const deleteUserAccount = (userId: string) => {
    // In a real app, this would be an API call
    setClients(prev => prev.filter(c => c.id !== userId));
    // Log out if it's the current user
    if (currentUser?.id === userId) {
      logout();
    }
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
      // Multi-client
      clients,
      currentClient,
      setCurrentClient,
      getClientTasks,
      getClientTasksForTier,
      getTaskTemplatesForTier,
      getClientKPIData,
      // Subscriptions
      subscriptions,
      getClientSubscription,
      upgradeSubscription,
      // Admin
      paymentHistory,
      getClientPaymentHistory,
      taskTemplates,
      updateTaskTemplate,
      emailTemplates,
      updateEmailTemplate,
      updateUserProfile,
      updateClientInfo,
      deleteUserAccount,
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