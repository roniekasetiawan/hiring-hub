import type { ReactNode } from 'react';

interface RoutesInterface {
  label: string;
  href?: string;
}

export interface BreadcrumbsInterface {
  title: string;
  routes?: RoutesInterface[];
}

export interface PageIDProps {
  author?: string;
  breadcrumbs?: BreadcrumbsInterface;
  canonical?: string;
  children: ReactNode;
  description?: string;
  keywords?: string;
  publisher?: string;
  robots?: string;
  title?: string;
  path?: string;
  permission?: string;
}
