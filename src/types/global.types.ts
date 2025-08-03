// Basic types used across the entire application
export type Priority = 'low' | 'medium' | 'high';
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
export type TaskStatus = 'backlog' | 'todo' | 'inProgress' | 'needReview';

// User interface (for assignees)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}