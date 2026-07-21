export type BlogStatus = 'draft' | 'published';
export type ProjectStatus = 'draft' | 'published';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
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

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}
