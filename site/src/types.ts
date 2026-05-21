export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  span?: 'large' | 'tall' | 'small' | 'wide' | string;
  icon?: string;
  badge?: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
}

export interface FleetItem {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Maintenance' | string;
  location: string;
}

export interface Vendor {
  id: string;
  name: string;
  status: string;
  rating: string;
}

export interface SafetyLog {
  id: string;
  date: string;
  location: string;
  type: string;
  severity: 'Low' | 'Moderate' | 'High' | string;
  status: 'Resolved' | 'Under Investigation' | string;
}

export interface Settings {
  maintenanceMode: boolean;
  contactPhone: string;
  contactEmail: string;
  siteNotice: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
  subject?: string;
}

export interface AdminContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  deleteProject: (id: string) => void;
  jobs: Job[];
  addJob: (job: Omit<Job, 'id'>) => void;
  deleteJob: (id: number) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'date'>) => void;
  deleteMessage: (id: number) => void;
  fleet: FleetItem[];
  addFleet: (item: Omit<FleetItem, 'id'>) => void;
  deleteFleet: (id: string) => void;
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  deleteVendor: (id: string) => void;
  safetyLogs: SafetyLog[];
  addSafetyLog: (log: Omit<SafetyLog, 'id' | 'date'>) => void;
  deleteSafetyLog: (id: string) => void;
  settings: Settings;
  updateSetting: (key: keyof Settings, value: boolean | string) => void;
}
