import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Project, Job, FleetItem, Vendor, SafetyLog, Settings, Message, AdminContextType } from '../types'

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'apex-tower',
    title: 'The Apex Tower',
    category: 'Commercial • 85 Stories',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9g6YsAr-BXzFse65CTOj-Yv7OYlpKJF_0KX58LqyIBXjGjGg-jcvOb7vkZeD7hvtaIYQKxYA_8O7o4VkAhnLtFiLIkln0QEPE6JcYoD9PDvxNpBjzcKfntViJs2Gcw1N4dw8Y7EudA54asWS-qmcJzyYtaZIVsSlGHV3IfZ0TTy8SU16qkBb8O_2RuxGwjlLxKtNgMlv1hbv05fUAR0uIMc_SPHLyDdwNmESTtAXofDZXxciYOtp4ZJ2EK_as1nq405ORFyTvYnU',
    span: 'large',
    icon: 'apartment',
  },
  {
    id: 'foundry-complex',
    title: 'Foundry Complex',
    category: 'Industrial • Heavy Rail',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAudU7g9wZJN8kM1EWu6T_RE8OUZQJ0FZMJ-ZdeApszelV5DCbXHVwYyBDPtHI5lLVESJM19ojrfHaFMWeHjXncElUvhhsOawcDq7cPvT7XrDc9G_LveZAgf7Crg5UOwGUk7xpLkpzkHMt0U9hrDK9VsS0tvkKcP5wPknIrNCIYcDYcuwNlLDl5-YsQNOfD8NZnH5ABNEmV24hnFIrP_sKN6_Y_GiUg6BEPMBGEPc9EH6hw3Brx37fwqIds9lW6NreKRZx7vDCXHJA',
    span: 'tall',
  },
  {
    id: 'green-residences',
    title: 'Green Residences',
    category: 'Residential • Luxury',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAfFMYFh0YP26ZCLkON4Crt0SGvVxfgE3sXu4fV5QBulrmIRaffCOkbAxVt9NN10ryhOlOchpm3UaZp8qgsD2eA87ZIBuzIO0dbOvF7ob95PEyIxPkawW80b3cAeBCcT84BTaGjPAiI5mdfFseM52drjMn4a1dpqGYbZNG831adAF7srrGopYwXfkc9sTT3nIDK_K0qZNo6SzwLCEhANNHLRvgZpmstNfaVDwOU9K6fmbrL8ZWE1gUAXcyOGxwEm5v-6G3HbkT7WE',
    span: 'small',
    icon: 'precision_manufacturing',
  },
  {
    id: 'atrium-hq',
    title: 'Atrium HQ',
    category: 'Corporate • Headquarters',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPUXwuxZSMDWjPduq8LF1hQfYbtHMMlFYEEQ1YGd_qcD8t5Gqs6ejTFzC9K9B-zOZhXpVsbSz4uRNOmKTEp2oZ2raG5bWdn7m7SlPjfKFGBPzfhnt8llgr-xcM0LyKBC7oDbJ51INylxNN-XBuGscy00sISr23-fstPOip17_X3IcieIgWofKol3b7KnDZ81mcn4hch28nqZmpIk8Ww8xTGZssolTxVIAalciYDqaTsSakkR2FB6zXBKU89ALbK031661_kpMRxEg',
    span: 'small',
    icon: 'engineering',
  },
  {
    id: 'river-gateway',
    title: 'River Gateway',
    category: 'Infrastructure • 2.4 Miles',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZSt8DyOiyuc3D0YvzOV9Jdv6p3zqa1c41iPnk0Ifax5pnO8pm20-EXQPJfcwJFQnfT2xPv9OtSS-3bPjpE9OcTYPJvwt7azVCzNeiI1xnESPKX9SOccKQbjZ4zNvjuWGnEFijdVqZLORetO7QXnzBxfJWm2Qyvyk0PMno0Fxb1XrWG_JkB4s8pAeN6Utx3R9zlEqhDLKQAbACyu9J_wQj6IIowCdT7nnSOfN5JJFswidCpbudUKNSDzlIpoxPTb5Eb3G_EKMGBvA',
    span: 'wide',
    badge: 'Sustainable Materials',
  },
]

const INITIAL_JOBS: Job[] = [
  { id: 1, title: 'Senior Structural Engineer', department: 'Engineering', location: 'Noida, UP', type: 'Full-time' },
  { id: 2, title: 'Project Manager (Commercial)', department: 'Operations', location: 'Gurugram, HR', type: 'Full-time' },
  { id: 3, title: 'Architectural Draftsman', department: 'Design', location: 'Noida, UP', type: 'Contract' },
  { id: 4, title: 'Site Safety Inspector', department: 'Safety', location: 'Multiple Locations', type: 'Full-time' },
]

const INITIAL_FLEET: FleetItem[] = [
  { id: '1', name: 'CAT 320 Hydraulic Excavator', type: 'Heavy Machinery', status: 'Active', location: 'The Apex Tower' },
  { id: '2', name: 'Liebherr Tower Crane 150 EC-B', type: 'Cranes', status: 'Maintenance', location: 'Service Yard A' },
  { id: '3', name: 'Volvo A40G Articulated Hauler', type: 'Transport', status: 'Active', location: 'River Gateway' },
  { id: '4', name: 'Putzmeister Concrete Pump', type: 'Specialized', status: 'Active', location: 'Green Residences' },
]

const INITIAL_SETTINGS: Settings = {
  maintenanceMode: false,
  contactPhone: '+91 98765 43210',
  contactEmail: 'projects@verticalconstructions.in',
  siteNotice: '',
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('vc_projects')
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS
  })

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('vc_jobs')
    return saved ? JSON.parse(saved) : INITIAL_JOBS
  })

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('vc_messages')
    return saved ? JSON.parse(saved) : []
  })

  const [fleet, setFleet] = useState<FleetItem[]>(() => {
    const saved = localStorage.getItem('vc_fleet')
    return saved ? JSON.parse(saved) : INITIAL_FLEET
  })

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('vc_vendors')
    return saved ? JSON.parse(saved) : [
      { id: 'v1', name: 'UltraTech Cement', status: 'Active Contract', rating: '5/5' },
      { id: 'v2', name: 'Tata Steel Ltd', status: 'Pending Renewal', rating: '4.5/5' }
    ]
  })

  const [safetyLogs, setSafetyLogs] = useState<SafetyLog[]>(() => {
    const saved = localStorage.getItem('vc_safety')
    return saved ? JSON.parse(saved) : [
      { id: '1', date: 'May 1, 2026', location: 'River Gateway', type: 'Equipment Malfunction', severity: 'Moderate', status: 'Resolved' },
      { id: '2', date: 'April 18, 2026', location: 'The Apex Tower', type: 'Safety Harness Check Failed', severity: 'High', status: 'Resolved' }
    ]
  })

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('vc_settings')
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS
  })

  useEffect(() => { localStorage.setItem('vc_projects', JSON.stringify(projects)) }, [projects])
  useEffect(() => { localStorage.setItem('vc_jobs', JSON.stringify(jobs)) }, [jobs])
  useEffect(() => { localStorage.setItem('vc_messages', JSON.stringify(messages)) }, [messages])
  useEffect(() => { localStorage.setItem('vc_fleet', JSON.stringify(fleet)) }, [fleet])
  useEffect(() => { localStorage.setItem('vc_vendors', JSON.stringify(vendors)) }, [vendors])
  useEffect(() => { localStorage.setItem('vc_safety', JSON.stringify(safetyLogs)) }, [safetyLogs])
  useEffect(() => { localStorage.setItem('vc_settings', JSON.stringify(settings)) }, [settings])

  const addProject = (project: Omit<Project, 'id'>) => setProjects(prev => [...prev, { ...project, id: Date.now().toString() }])
  const deleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id))

  const addJob = (job: Omit<Job, 'id'>) => setJobs(prev => [...prev, { ...job, id: Date.now() }])
  const deleteJob = (id: number) => setJobs(prev => prev.filter(j => j.id !== id))

  const addMessage = (message: Omit<Message, 'id' | 'date'>) => setMessages(prev => [{ ...message, id: Date.now(), date: new Date().toISOString() }, ...prev])
  const deleteMessage = (id: number) => setMessages(prev => prev.filter(m => m.id !== id))

  const addFleet = (item: Omit<FleetItem, 'id'>) => setFleet(prev => [...prev, { ...item, id: Date.now().toString() }])
  const deleteFleet = (id: string) => setFleet(prev => prev.filter(f => f.id !== id))

  const addVendor = (vendor: Omit<Vendor, 'id'>) => setVendors(prev => [...prev, { ...vendor, id: Date.now().toString() }])
  const deleteVendor = (id: string) => setVendors(prev => prev.filter(v => v.id !== id))

  const addSafetyLog = (log: Omit<SafetyLog, 'id' | 'date'>) => setSafetyLogs(prev => [{ ...log, id: Date.now().toString(), date: new Date().toLocaleDateString() }, ...prev])
  const deleteSafetyLog = (id: string) => setSafetyLogs(prev => prev.filter(s => s.id !== id))

  const updateSetting = (key: keyof Settings, value: boolean | string) => setSettings(prev => ({ ...prev, [key]: value }))

  return (
    <AdminContext.Provider value={{
      projects, addProject, deleteProject,
      jobs, addJob, deleteJob,
      messages, addMessage, deleteMessage,
      fleet, addFleet, deleteFleet,
      vendors, addVendor, deleteVendor,
      safetyLogs, addSafetyLog, deleteSafetyLog,
      settings, updateSetting
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
