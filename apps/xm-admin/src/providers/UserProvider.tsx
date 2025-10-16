import type { TokenPayload } from '@repo/admin-api-types';
import { createContext, type ReactNode, useState } from 'react';

type User = {
  userId: string;
  roleId: string;
  isSuper: number;
  exp: number;
  username: string;
  accessKeys: string[];
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  setUserFromToken: (token: string) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
  children: ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    return {
      userId: payload.sub,
      roleId: payload.role,
      isSuper: payload.isSuper,
      exp: payload.exp,
      username: payload.username,
      accessKeys: payload.accessKeys,
    };
  });

  const setUserFromToken = (token: string) => {
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    setUser({
      userId: payload.sub,
      roleId: payload.role,
      isSuper: payload.isSuper,
      exp: payload.exp,
      username: payload.username,
      accessKeys: payload.accessKeys,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, setUserFromToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
