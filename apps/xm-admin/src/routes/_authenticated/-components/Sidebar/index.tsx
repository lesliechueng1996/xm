import Menu from './Menu';

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
