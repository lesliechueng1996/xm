import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';
import type { Key } from 'react';
import useUser from '@/hooks/useUser';
import Logo from './Logo';

const menus = [
  {
    label: '管理员管理',
    items: [
      {
        label: '管理员列表',
        key: 'admin_list',
        path: '/admin/list',
      },
      {
        label: '增加管理员',
        key: 'add_admin',
        path: '/admin/add',
      },
    ],
  },
  {
    label: '分类管理',
    items: [
      {
        label: '商品分类列表',
        key: 'category_list',
        path: '/category/list',
      },
      {
        label: '增加商品分类',
        key: 'add_category',
        path: '/category/add',
      },
    ],
  },
  {
    label: '商品管理',
    items: [
      {
        label: '商品列表',
        key: 'product_list',
        path: '/product/list',
      },
      {
        label: '增加商品',
        key: 'add_product',
        path: '/product/add',
      },
    ],
  },
  {
    label: '轮播图管理',
    items: [
      {
        label: '轮播图列表',
        key: 'banner_list',
        path: '/banner/list',
      },
      {
        label: '轮播图商品',
        key: 'banner_product',
        path: '/banner/product',
      },
    ],
  },
];

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

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menus.map((menu) => (
          <Dropdown key={menu.label}>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  radius="sm"
                  variant="light"
                  endContent={<ChevronDownIcon className="size-4" />}
                >
                  {menu.label}
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label={menu.label}
              itemClasses={{
                base: 'gap-4',
              }}
            >
              {menu.items.map((item) => (
                <DropdownItem key={item.key}>{item.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ))}
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
