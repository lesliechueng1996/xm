import type { ApiError } from '@repo/common-types';

export const sendRequest = async <T>(
  url: string,
  options?: Omit<RequestInit, 'body'> & { body?: BodyInit },
) => {
  const { body, headers, ...rest } = options ?? {};
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    throw new Error('请重新登录');
  }

  const allHeaders: HeadersInit = new Headers({
    ...headers,
    Authorization: `Bearer ${token}`,
  });

  let bodyData: BodyInit | undefined = body;
  if (body instanceof FormData) {
    bodyData = body;
  } else {
    bodyData = JSON.stringify(body);
    allHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...rest,
    body: bodyData,
    headers: allHeaders,
  });
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('请重新登录');
  }

  let data: T;
  try {
    data = await response.json();
  } catch {
    throw new Error(`请求失败: ${response.statusText}`);
  }
  if (!response.ok) {
    throw new Error((data as ApiError).message);
  }
  return data;
};

export const get = async <T>(
  url: string,
  options?: Omit<Parameters<typeof sendRequest>[1], 'method'>,
) => {
  return sendRequest<T>(url, { ...options, method: 'GET' });
};

export const post = async <T>(
  url: string,
  options?: Omit<Parameters<typeof sendRequest>[1], 'method'>,
) => {
  return sendRequest<T>(url, { ...options, method: 'POST' });
};

export const put = async <T>(
  url: string,
  options?: Omit<Parameters<typeof sendRequest>[1], 'method'>,
) => {
  return sendRequest<T>(url, { ...options, method: 'PUT' });
};

export const del = async <T>(
  url: string,
  options?: Omit<Parameters<typeof sendRequest>[1], 'method'>,
) => {
  return sendRequest<T>(url, { ...options, method: 'DELETE' });
};
