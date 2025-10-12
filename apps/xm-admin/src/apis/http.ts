export const sendRequest = async (
  url: string,
  options?: Omit<RequestInit, 'body'> & { body?: object },
) => {
  const { body, headers, ...rest } = options ?? {};
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    throw new Error('请重新登录');
  }

  const allHeaders = {
    'Content-Type': 'application/json',
    ...headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...rest,
    body: body ? JSON.stringify(body) : undefined,
    headers: allHeaders,
  });
  const data = await response.json();
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('请重新登录');
  }
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const get = async (
  url: string,
  options?: Omit<Parameters<typeof sendRequest>[1], 'method'>,
) => {
  return sendRequest(url, { ...options, method: 'GET' });
};

export const post = async (
  url: string,
  options?: Omit<Parameters<typeof sendRequest>[1], 'method'>,
) => {
  return sendRequest(url, { ...options, method: 'POST' });
};
