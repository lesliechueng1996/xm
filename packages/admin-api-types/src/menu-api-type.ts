import type { AdminAccessType } from '@repo/common-types';

export type GetUserMenusResponse = {
  id: string;
  accessName: string;
  type: AdminAccessType;
  url: string | null;
  parentId: string | null;
  sort: number;
  description: string;
  status: number;
  children: GetUserMenusResponse;
}[];
