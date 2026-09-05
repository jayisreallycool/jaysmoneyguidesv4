export type Category = 'Affiliate Marketing' | 'SEO' | 'Blogging' | 'Tech' | 'Entrepreneurship' | 'SoFi Bank';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown / formatted HTML
  category: Category;
  tags: string[];
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  difficulty: DifficultyLevel;
  featured?: boolean;
  views: number;
  likes: number;
  rating?: number;
  ratingCount?: number;
  seoKeywords?: string[];
  metaDescription?: string;
  keyTakeaways: string[];
  isDraft?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
}

export interface CategoryTab {
  id: Category | 'All';
  label: string;
  iconName: string;
}

export type ModalView = 'none' | 'about' | 'privacy' | 'terms' | 'contact' | 'disclaimer' | 'cookie-policy' | 'admin' | 'post-reader' | 'auth' | 'profile' | 'media-database' | 'ebook-viewer' | 'ebook-preview';

export type ProductType = 'ebook';

export interface Product {
  id: string;
  slug: string;
  type: ProductType;
  title: string;
  subtitle: string;
  author: string;
  coverImage: string;
  priceCents: number; // 0 = free
  isFree: boolean;
  category: 'Ebooks';
  description: string;
  previewChapters: string[];
  previewExcerpt: string;
  pageCount: number;
  /** Path inside the Firebase Storage bucket, e.g. "ebooks/private/foo.pdf" */
  storagePath: string;
  /** Direct tokenized Firebase Storage download URL */
  downloadUrl?: string;
  /** Firebase Storage download token */
  storageToken?: string;
  /** Direct gs:// URI representation */
  gsUri?: string;
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google';
  createdAt: string;
  bio?: string;
  role?: string;
}

export interface AnalyticsStats {
  totalViews: number;
  totalLikes: number;
  totalSubscribers: number;
}
