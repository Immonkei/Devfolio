import { Database } from "./database";

export * from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Technology = Database["public"]["Tables"]["technologies"]["Row"];
export type Experience = Database["public"]["Tables"]["experiences"]["Row"];
export type Education = Database["public"]["Tables"]["education"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type MediaItem = Database["public"]["Tables"]["media"]["Row"];
export type PageView = Database["public"]["Tables"]["page_views"]["Row"];
export type AnalyticsEvent = Database["public"]["Tables"]["events"]["Row"];

export interface ProjectWithTechnologies extends Project {
  technologies: Technology[];
}

export interface PostWithCategories extends Post {
  categories: Category[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  updated_at: string;
  topics?: string[];
}

export interface DashboardMetrics {
  totalProjects: number;
  publishedPosts: number;
  totalExperiences: number;
  unreadMessages: number;
  totalPageViews: number;
  totalDownloads: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubActivityData {
  totalContributions: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  contributions: ContributionDay[];
}
