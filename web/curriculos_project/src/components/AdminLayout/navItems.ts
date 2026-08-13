import type { JSX } from 'react';
import { CurriculumIcon, JobsIcon, ReportsIcon, UsersIcon } from './navIcons';

export type AdminSection = 'curriculos' | 'vagas' | 'relatorios' | 'usuarios';

type AdminRole = 'admin' | 'superAdmin';

export type AdminNavItem = {
  id: AdminSection;
  label: string;
  shortLabel: string;
  path: string;
  roles: readonly AdminRole[];
  icon: () => JSX.Element;
};

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  {
    id: 'curriculos',
    label: 'Gerenciar Currículos',
    shortLabel: 'Currículos',
    path: '/dashboard',
    roles: ['admin', 'superAdmin'],
    icon: CurriculumIcon,
  },
  {
    id: 'vagas',
    label: 'Gerenciar Vagas',
    shortLabel: 'Vagas',
    path: '/newJob',
    roles: ['admin', 'superAdmin'],
    icon: JobsIcon,
  },
  {
    id: 'relatorios',
    label: 'Relatórios RH',
    shortLabel: 'Relatórios',
    path: '/reports',
    roles: ['admin', 'superAdmin'],
    icon: ReportsIcon,
  },
  {
    id: 'usuarios',
    label: 'Gerenciar Usuários',
    shortLabel: 'Usuários',
    path: '/users',
    roles: ['superAdmin'],
    icon: UsersIcon,
  },
];

export function getAdminNavItems(userType?: string) {
  return ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(userType as AdminRole));
}

