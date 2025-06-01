export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  sub: string;
  address: string;
  phone: string;
  fax?: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  location?: {
    lat: number;
    lng: number;
  };
  categoryIds: string[];
  subcategoryIds: string[];
  images: string[];
  productimages: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  subcategories: Subcategory[];
  slug: string;
  type: "fason" | "uretim";
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  category_id?: string;
  slug: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  name: string;
  description: string;
   logo: string;
  address: string;
  phone: string;
  fax?: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  categoryIds: string[];
  subcategoryIds: string[];
  images: (File | string)[];
  productImages: (File | string)[];
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  order: number;
  isActive: boolean;
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  position: "header" | "sidebar" | "footer";
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "email" | "push" | "both";
  recipients: "all" | string[];
  scheduledFor?: string;
  sentAt?: string;
  status: "draft" | "scheduled" | "sent" | "failed";
}
