import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Task, UserRole, Client, Subscription, PaymentHistory, TaskTemplate, EmailTemplate, KPIData, SubscriptionTier, LoginHistory, SubscriptionPlan, Discount, PhaseConfig } from '@/types';
import { mockUsers, mockTasks, mockClients, mockSubscriptions, mockPaymentHistory, mockTaskTemplates, mockEmailTemplates, mockKPIData, mockLoginHistory, mockPlans, mockDiscounts, mockPhaseConfigs } from '@/data/mockData';

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
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
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
  updateSubscriptionStatus: (subscriptionId: string, status: Subscription['status']) => void;
  extendSubscriptionTrial: (subscriptionId: string, days: number) => void;
  // Admin features
  paymentHistory: PaymentHistory[];
  getClientPaymentHistory: (clientId: string) => PaymentHistory[];
  refundPayment: (paymentId: string) => void;
  taskTemplates: TaskTemplate[];
  updateTaskTemplate: (templateId: string, updates: Partial<TaskTemplate>) => void;
  addTaskTemplate: (template: Omit<TaskTemplate, 'id'>) => void;
  deleteTaskTemplate: (templateId: string) => void;
  emailTemplates: EmailTemplate[];
  updateEmailTemplate: (templateId: string, updates: Partial<EmailTemplate>) => void;
  addEmailTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteEmailTemplate: (templateId: string) => void;
  sendEmailBlast: (audience: string, subject: string, message: string) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  updateClientInfo: (clientId: string, updates: Partial<Client>) => void;
  deleteUserAccount: (userId: string) => void;
  loginHistory: LoginHistory[];
  plans: SubscriptionPlan[];
  discounts: Discount[];
  phaseConfigs: PhaseConfig[];
  updatePhaseConfig: (id: string, updates: Partial<PhaseConfig>) => void;
  updatePlan: (id: string, updates: Partial<SubscriptionPlan>) => void;
  addPlan: (plan: Omit<SubscriptionPlan, 'id'>) => void;
  deletePlan: (id: string) => void;
  updateDiscount: (id: string, updates: Partial<Discount>) => void;
  addDiscount: (discount: Omit<Discount, 'id'>) => void;
  deleteDiscount: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<TaskWithClient[]>(mockTasks);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>(mockPaymentHistory);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>(mockTaskTemplates);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [loginHistory] = useState<LoginHistory[]>(mockLoginHistory);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [phaseConfigs, setPhaseConfigs] = useState<PhaseConfig[]>(mockPhaseConfigs);
  const [users, setUsers] = useState<User[]>(mockUsers);

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

  const login = (identifier: string, password?: string): boolean => {
    let user: User | undefined;

    if (password) {
      // Email/Password login
      user = users.find(u => u.email.toLowerCase() === identifier.toLowerCase() && u.password === password);
    } else {
      // Role-based login (used for registration shortcuts)
      user = users.find(u => u.role === identifier);
    }

    if (user) {
      setCurrentUser(user);
      // Set default client for non-admin roles
      if (user.role === 'client') {
        const clientData = clients.find(c => c.id === user.id);
        setCurrentClient(clientData || null);
      } else if (user.role !== 'admin') {
        // For team members, set first active client as default
        const firstActiveClient = clients.find(c => c.isActive);
        setCurrentClient(firstActiveClient || null);
      }
      return true;
    }
    return false;
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

  const refundPayment = (paymentId: string) => {
    setPaymentHistory(prev => prev.map(p =>
      p.id === paymentId
        ? { ...p, status: 'refunded', refundAmount: p.amount }
        : p
    ));
  };

  const updateSubscriptionStatus = (subscriptionId: string, status: Subscription['status']) => {
    setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, status } : s));
  };

  const extendSubscriptionTrial = (subscriptionId: string, days: number) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subscriptionId) {
        const currentEndDate = sub.trialEndDate || new Date();
        const newEndDate = new Date(currentEndDate);
        newEndDate.setDate(newEndDate.getDate() + days);
        return {
          ...sub,
          trialEndDate: newEndDate,
          status: 'trial' // Ensure status is trial if extending
        };
      }
      return sub;
    }));
  };

  const updateTaskTemplate = (templateId: string, updates: Partial<TaskTemplate>) => {
    setTaskTemplates(prev => prev.map(tpl =>
      tpl.id === templateId
        ? { ...tpl, ...updates }
        : tpl
    ));
  };

  const addTaskTemplate = (templateData: Omit<TaskTemplate, 'id'>) => {
    const newTemplate: TaskTemplate = {
      ...templateData,
      id: `tpl-${Date.now()}`
    };
    setTaskTemplates(prev => [...prev, newTemplate]);
  };

  const deleteTaskTemplate = (templateId: string) => {
    setTaskTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const updateEmailTemplate = (templateId: string, updates: Partial<EmailTemplate>) => {
    setEmailTemplates(prev => prev.map(tpl =>
      tpl.id === templateId
        ? { ...tpl, ...updates, updatedAt: new Date() }
        : tpl
    ));
  };

  const addEmailTemplate = (templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: EmailTemplate = {
      ...templateData,
      id: `email-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEmailTemplates(prev => [...prev, newTemplate]);
  };

  const deleteEmailTemplate = (templateId: string) => {
    setEmailTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const sendEmailBlast = (audience: string, subject: string, message: string) => {
    // In a real app, this would make an API call to a mailing service
    console.log(`Sending blast to ${audience}: ${subject}`);
    // We could add a log to a system event log here if we had one
  };

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
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
    setClients(prev => prev.filter(c => c.id !== userId));
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      logout();
    }
  };

  const updatePhaseConfig = (id: string, updates: Partial<PhaseConfig>) => {
    setPhaseConfigs(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updatePlan = (id: string, updates: Partial<SubscriptionPlan>) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addPlan = (planData: Omit<SubscriptionPlan, 'id'>) => {
    const newPlan: SubscriptionPlan = {
      ...planData,
      id: `plan-${Date.now()}`
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const updateDiscount = (id: string, updates: Partial<Discount>) => {
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const addDiscount = (discountData: Omit<Discount, 'id'>) => {
    const newDiscount: Discount = {
      ...discountData,
      id: `disc-${Date.now()}`
    };
    setDiscounts(prev => [...prev, newDiscount]);
  };

  const deleteDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      isActive: true,
      role: userData.role
    };
    setUsers(prev => [...prev, newUser]);
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
      setUsers,
      addUser,
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
      updateSubscriptionStatus,
      extendSubscriptionTrial,
      // Admin
      paymentHistory,
      getClientPaymentHistory,
      refundPayment,
      taskTemplates,
      updateTaskTemplate,
      addTaskTemplate,
      deleteTaskTemplate,
      emailTemplates,
      updateEmailTemplate,
      addEmailTemplate,
      deleteEmailTemplate,
      sendEmailBlast,
      updateUserProfile,
      updateClientInfo,
      deleteUserAccount,
      loginHistory,
      plans,
      discounts,
      phaseConfigs,
      updatePhaseConfig,
      updatePlan,
      addPlan,
      deletePlan,
      updateDiscount,
      addDiscount,
      deleteDiscount,
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