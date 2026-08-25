import { 
  LayoutDashboard, 
  Activity, 
  FileText, 
  Briefcase, 
  Navigation, 
  UserCheck, 
  Wrench, 
  Users, 
  Package, 
  Receipt, 
  CreditCard, 
  Star, 
  BarChart3, 
  Bell, 
  Settings, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  User, 
  PlusCircle, 
  MapPin 
} from 'lucide-react';

export const ADMIN_NAVIGATION = [
  {
    section: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Live Operations', path: '/admin/live-operations', icon: Activity }
    ]
  },
  {
    section: 'SERVICE OPERATIONS',
    items: [
      { label: 'Service Requests', path: '/admin/requests', icon: FileText },
      { label: 'Jobs', path: '/admin/jobs', icon: Briefcase },
      { label: 'Dispatch', path: '/admin/dispatch', icon: Navigation },
      { label: 'Smart Assignment', path: '/admin/smart-assignment', icon: UserCheck }
    ]
  },
  {
    section: 'PEOPLE',
    items: [
      { label: 'Technicians', path: '/admin/technicians', icon: Wrench },
      { label: 'Customers', path: '/admin/customers', icon: Users }
    ]
  },
  {
    section: 'BUSINESS',
    items: [
      { label: 'Inventory', path: '/admin/inventory', icon: Package },
      { label: 'Invoices', path: '/admin/invoices', icon: Receipt },
      { label: 'Payments', path: '/admin/payments', icon: CreditCard }
    ]
  },
  {
    section: 'INSIGHTS',
    items: [
      { label: 'Reviews', path: '/admin/reviews', icon: Star },
      { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 }
    ]
  },
  {
    section: 'SYSTEM',
    items: [
      { label: 'Notifications', path: '/admin/notifications', icon: Bell },
      { label: 'Settings', path: '/admin/settings', icon: Settings }
    ]
  }
];

export const TECHNICIAN_NAVIGATION = [
  {
    section: 'MY WORK',
    items: [
      { label: 'Dashboard', path: '/technician/dashboard', icon: LayoutDashboard },
      { label: 'My Jobs', path: '/technician/jobs', icon: Briefcase }
    ]
  },
  {
    section: 'SERVICE',
    items: [
      { label: 'Active Job', path: '/technician/active-job', icon: Activity },
      { label: 'Job History', path: '/technician/history', icon: Clock }
    ]
  }
];

export const CUSTOMER_NAVIGATION = [
  {
    section: 'MY SERVICES',
    items: [
      { label: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
      { label: 'Create Service Request', path: '/customer/create-request', icon: PlusCircle },
      { label: 'My Requests', path: '/customer/requests', icon: FileText },
      { label: 'Track Service', path: '/customer/track', icon: MapPin }
    ]
  },
  {
    section: 'SERVICE HISTORY',
    items: [
      { label: 'Service History', path: '/customer/history', icon: Clock },
      { label: 'Invoices', path: '/customer/invoices', icon: Receipt },
      { label: 'Reviews', path: '/customer/reviews', icon: Star }
    ]
  }
];
