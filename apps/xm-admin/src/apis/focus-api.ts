import type {
  CreateFocusRequest,
  CreateFocusResponse,
} from '@repo/admin-api-types';
import { post } from './http';

export const createFocus = async (request: CreateFocusRequest) => {
  return post<CreateFocusResponse>('/admin/focus', {
    body: request,
  });
};
