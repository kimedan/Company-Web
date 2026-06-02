
export interface NavItem {
  label: string;
  path: string;
  subItems?: NavItem[];
}

export interface Product {
  id: string;
  /**
   * 고유 시스템 식별자 (slug).
   * URL 라우팅 및 다국어 대응 환경에서 Firestore 데이터 변경 시에도 깨지지 않는 고정 경로를 보장합니다.
   * 예: 'auto-parts', 'industrial-material'
   */
  slug?: string;
  title: string;
  description: string;
  fullDescription?: string;
  imageUrl: string;
  additionalImages?: string[];
  specs?: { label: string; value: string }[];
  category: string;
  order?: number;
}

export enum SectionType {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  PRODUCTS = 'PRODUCTS',
  PROCESS = 'PROCESS',
  CONTACT = 'CONTACT'
}

// --- Admin & CMS Types ---

export interface Post {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  status: 'Published' | 'Draft';
  views: number;
  content?: string; // HTML or Markdown content
  imageUrl?: string; // Representative thumbnail URL
  additionalImages?: string[]; // Multiple additional image URLs
  showOnHero?: boolean;
  heroDescription?: string;
  heroOrder?: number;
}

export type BorderRadiusSize = 'rounded-none' | 'rounded-md' | 'rounded-xl' | 'rounded-full';

export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  primaryColor: string; // The signature brand color
  borderRadius: BorderRadiusSize; // Global border radius setting
  seoKeywords: string;
  contactEmail: string;
}

export interface Certification {
  id: string;
  title: string;
  imageUrl: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  order: number;
}

export interface QualityEquipment {
  id: string;
  name: string;
  spec: string;
  imageUrl: string;
  description: string;
}

// Flexible key-value store for page texts and images
export interface ContentMap {
  [key: string]: string; 
  // Example: 'home_hero_title': 'The Future of...'
  // 'home_hero_bg': 'https://...'
}

export type Language = 'KOR' | 'ENG' | 'JPN';
