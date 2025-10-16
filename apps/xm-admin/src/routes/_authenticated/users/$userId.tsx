import { addToast } from '@heroui/react';
import Loading from '@repo/ui-component/Loading';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { editUser, getUser } from '@/apis/user-api';
import { beforeLoadGuard } from '@/utils/guard-util';
import UserForm, { type FormType } from './-components/UserForm';

const UserIdPage = () => {
  const navigate = useNavigate();
  const { userId } = Route.useParams();
  useDocumentTitle(`编辑管理员`);

  const { data: user, isLoading: isQueryLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormType) => {
      await editUser(userId, {
        password: data.password,
        mobile: data.mobile,
        email: data.email,
        roleId: data.roleId,
      });
    },
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '编辑管理员成功',
        color: 'success',
      });
      navigate({ to: '/users' });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: (error as Error).message || '编辑管理员失败',
        color: 'danger',
      });
    },
  });

  if (isQueryLoading || !user) {
    return <Loading />;
  }

  return (
    <UserForm
      isEdit
      onSave={mutate}
      isPending={isPending}
      defaultValues={{
        username: user.username,
        password: '',
        mobile: user.mobile,
        email: user.email,
        roleId: user.role.id,
      }}
    />
  );
};

export const Route = createFileRoute('/_authenticated/users/$userId')({
  component: UserIdPage,
  beforeLoad: beforeLoadGuard('users:edit'),
});
