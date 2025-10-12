import { addToast } from '@heroui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { editRole, getRole } from '@/apis/role-api';
import RoleForm, { type FormType } from './-components/RoleForm';

const RoleIdPage = () => {
  const navigate = useNavigate();
  const { roleId } = Route.useParams();
  useDocumentTitle(`编辑角色`);

  const { data: role, isLoading: isQueryLoading } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => getRole(roleId),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormType) =>
      editRole(roleId, data.name, data.description),
  });

  const onSave = async (data: FormType) => {
    try {
      await mutateAsync(data);
      addToast({
        title: '成功',
        description: '编辑角色成功',
        color: 'success',
      });
      navigate({ to: '/roles' });
    } catch (error) {
      addToast({
        title: '错误',
        description: (error as Error).message || '编辑角色失败',
        color: 'danger',
      });
    }
  };

  if (isQueryLoading) {
    return <div>Loading...</div>;
  }

  return (
    <RoleForm onSave={onSave} isPending={isPending} defaultValues={role} />
  );
};

export const Route = createFileRoute('/_authenticated/roles/$roleId')({
  component: RoleIdPage,
});
