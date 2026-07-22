export type BlogStatus = 'draft' | 'published';
export type ProjectStatus = 'draft' | 'published';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  tags: string[];
  status: BlogStatus;
  created_at: string;
  updated_at: string;
}

export interface BlogInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  tags?: string[];
  status: BlogStatus;
}


export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  tech_stack: string[];
  project_url: string | null;
  status: ProjectStatus;
  created_at: string;
}

export interface ProjectInput {
  title: string;
  slug: string;
  description?: string | null;
  cover_image_url?: string | null;
  tech_stack?: string[];
  project_url?: string | null;
  status: ProjectStatus;
}
export type ServiceStatus = 'draft' | 'published';

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string;
  points: string[];
  status: ServiceStatus;
  created_at: string;
  updated_at: string;
}

export interface ServiceInput {
  title: string;
  slug: string;
  description?: string | null;
  icon?: string;
  points?: string[];
  status: ServiceStatus;
}
export type CourseStatus = 'draft' | 'published';
export type CourseLevelKey = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string;
  level: string;
  level_key: CourseLevelKey;
  duration: string | null;
  topics: string[];
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export interface CourseInput {
  title: string;
  slug: string;
  description?: string | null;
  icon?: string;
  level?: string;
  level_key: CourseLevelKey;
  duration?: string | null;
  topics?: string[];
  status: CourseStatus;
}
export type TestimonialStatus = 'draft' | 'published';

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  image_url: string | null;
  quote: string;
  rating: number;
  status: TestimonialStatus;
  created_at: string;
  updated_at: string;
}

export interface TestimonialInput {
  name: string;
  role?: string | null;
  image_url?: string | null;
  quote: string;
  rating: number;
  status: TestimonialStatus;
}

export type FaqStatus = 'draft' | 'published';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  status: FaqStatus;
  created_at: string;
  updated_at: string;
}

export interface FaqInput {
  question: string;
  answer: string;
  display_order?: number;
  status: FaqStatus;
} 
export type ProfileStatus = 'active' | 'disabled';

export type ModuleKey = 'blogs' | 'projects' | 'services' | 'courses' | 'testimonials' | 'faq' | 'contacts';

export interface ModulePermissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export const MODULE_LABELS: Record<ModuleKey, string> = {
  blogs: 'Blogs',
  projects: 'Projects',
  services: 'Services',
  courses: 'Courses',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  contacts: 'Contacts',
};

export const TAB_OPTIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'projects', label: 'Projects' },
  { key: 'services', label: 'Services' },
  { key: 'courses', label: 'Courses' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'faq', label: 'FAQ' },
  { key: 'contacts', label: 'Contacts' },
];

export function emptyPermissions(): Record<ModuleKey, ModulePermissions> {
  return {
    blogs: { create: false, read: false, update: false, delete: false },
    projects: { create: false, read: false, update: false, delete: false },
    services: { create: false, read: false, update: false, delete: false },
    courses: { create: false, read: false, update: false, delete: false },
    testimonials: { create: false, read: false, update: false, delete: false },
    faq: { create: false, read: false, update: false, delete: false },
    contacts: { create: false, read: false, update: false, delete: false },
  };
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  tabs: string[];
  permissions: Record<ModuleKey, ModulePermissions>;
  created_at: string;
  updated_at: string;
}

export interface RoleInput {
  name: string;
  description?: string | null;
  tabs: string[];
  permissions: Record<ModuleKey, ModulePermissions>;
}

export interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  period: string; // 'project' | 'month' | 'year' | 'quote'
  features: string[];
  cta_text: string;
  cta_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  status: string; // 'draft' | 'published' | 'archived'
  created_at: string;
  updated_at: string;
}

// =====================================================
// SUBSCRIBER TYPES
// =====================================================

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'inactive';
  subscribed_at: string;
  unsubscribed_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role_id: string | null;
  is_super_admin: boolean;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}
