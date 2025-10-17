import { useQuery } from '@tanstack/react-query';
import { getUserMenus } from '@/apis/menu-api';
import Menu from './Menu';

const Sidebar = () => {
  const { data: menus } = useQuery({
    queryKey: ['menus'],
    queryFn: getUserMenus,
    initialData: [],
  });

  return (
    <aside className="w-64 h-full border-r border-divider p-4 bg-default-50">
      {menus.map((menu) => (
        <Menu key={menu.id} label={menu.label} items={menu.items} />
      ))}
    </aside>
  );
};

export default Sidebar;
