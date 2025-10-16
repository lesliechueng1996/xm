import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { createUser } from '@/apis/user-api';
import { beforeLoadGuard } from '@/utils/guard-util';
import UserForm, { type FormType } from './-components/UserForm';

const AddUserPage = () => {
  const navigate = useNavigate();
  useDocumentTitle('增加管理员');
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormType) => createUser(data),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '创建管理员成功',
        color: 'success',
      });
      navigate({ to: '/users' });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: (error as Error).message || '创建管理员失败',
        color: 'danger',
      });
    },
  });

  return <UserForm onSave={mutate} isPending={isPending} />;
};

export const Route = createFileRoute('/_authenticated/users/add')({
  component: AddUserPage,
  beforeLoad: beforeLoadGuard('users:add'),
});
