import Menu from './Menu';

const menus = [
  {
    label: '管理员管理',
    items: [
      {
        label: '管理员列表',
        key: 'user_list',
        path: '/users',
      },
      {
        label: '增加管理员',
        key: 'add_user',
        path: '/users/add',
      },
    ],
  },
  {
    label: '角色管理',
    items: [
      {
        label: '角色列表',
        key: 'role_list',
        path: '/roles',
      },
      {
        label: '增加角色',
        key: 'add_role',
        path: '/roles/add',
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

const Sidebar = () => {
  return (
    <aside className="w-64 h-full border-r border-divider p-4 bg-default-50">
      {menus.map((menu) => (
        <Menu key={menu.label} label={menu.label} items={menu.items} />
      ))}
    </aside>
  );
};

export default Sidebar;
