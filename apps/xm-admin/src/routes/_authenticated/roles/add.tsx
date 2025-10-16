import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { createRole } from '@/apis/role-api';
import { beforeLoadGuard } from '@/utils/guard-util';
import RoleForm, { type FormType } from './-components/RoleForm';

const AddRolePage = () => {
  const navigate = useNavigate();
  useDocumentTitle('增加角色');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormType) => createRole(data.name, data.description),
  });

  const onSave = async (data: FormType) => {
    try {
      await mutateAsync(data);
      addToast({
        title: '成功',
        description: '创建角色成功',
        color: 'success',
      });
      navigate({ to: '/roles' });
    } catch (error) {
      addToast({
        title: '错误',
        description: (error as Error).message || '创建角色失败',
        color: 'danger',
      });
    }
  };

  return <RoleForm onSave={onSave} isPending={isPending} />;
};

export const Route = createFileRoute('/_authenticated/roles/add')({
  component: AddRolePage,
  beforeLoad: beforeLoadGuard('roles:add'),
});
