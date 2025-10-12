import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';
import type { Key } from 'react';
import useUser from '@/hooks/useUser';
import Logo from './Logo';

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const username = user?.username || '管理员';

  const handleDropdownAction = (key: Key) => {
    if (key === 'logout') {
      logout();
      navigate({ to: '/login' });
    }
  };

  return (
    <Navbar
      position="static"
      maxWidth="full"
      isBordered
      className="flex-shrink-0"
    >
      <NavbarContent>
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit">XM Admin</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              className="transition-transform cursor-pointer"
              radius="md"
              color="primary"
              showFallback
              name={username}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            onAction={handleDropdownAction}
          >
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">已登录</p>
              <p className="font-semibold">{username}</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              退出登录
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
