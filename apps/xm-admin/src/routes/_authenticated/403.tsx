import { Button } from '@heroui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { TypewriterEffect } from '@/components/TypewriterEffect';
import useUser from '@/hooks/useUser';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { logout } = useUser();

  const words = [
    { text: '您没有权限访问此页面' },
    { text: '请与管理员联系', className: 'text-primary dark:text-primary' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <TypewriterEffect words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        <Button color="primary" onPress={() => navigate({ to: '/' })}>
          返回首页
        </Button>
        <Button
          color="default"
          onPress={() => {
            logout();
            navigate({ to: '/login' });
          }}
        >
          重新登录
        </Button>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/403')({
  component: ForbiddenPage,
});
