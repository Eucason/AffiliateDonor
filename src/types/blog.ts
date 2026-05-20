/**
 * Blog types for AffiliateDonations
 */

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentFormat: "html" | "markdown";
  featuredImageUrl?: string | null;
  category?: string | null;
  tags: string[];
  authorName: string;
  status: BlogStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface BlogPostCreateData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentFormat?: "html" | "markdown";
  featuredImageUrl?: string | null;
  category?: string | null;
  tags: string[];
  authorName: string;
  status: BlogStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface BlogPostUpdateData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  contentFormat?: "html" | "markdown";
  featuredImageUrl?: string | null;
  category?: string | null;
  tags?: string[];
  authorName?: string;
  status?: BlogStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface BlogAPIResponse {
  posts: BlogPost[];
  total: number;
}

export interface BlogAdminAPIResponse {
  posts: BlogPost[];
  total: number;
}