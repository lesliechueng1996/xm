import type { SaveImageResponse } from '@repo/admin-api-types';
import { post } from './http';

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return post<SaveImageResponse>('/admin/image', {
    body: formData,
  });
};
