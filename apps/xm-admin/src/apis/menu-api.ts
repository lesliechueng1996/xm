import type { GetUserMenusResponse } from '@repo/admin-api-types';
import { get } from './http';

export type Menu = Array<{
  id: string;
  label: string;
  items: Array<{
    id: string;
    label: string;
    path: string;
  }>;
}>;

export const getUserMenus = async () => {
  const result = await get<GetUserMenusResponse>('/admin/menu');
  const menus: Menu = [];
  for (const menu of result) {
    menus.push({
      id: menu.id,
      label: menu.accessName,
      items: menu.children.map((item) => ({
        id: item.id,
        label: item.accessName,
        path: item.url ?? '',
      })),
    });
  }
  return menus;
};
