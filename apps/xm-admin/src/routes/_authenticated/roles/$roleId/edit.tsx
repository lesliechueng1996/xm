import { addToast } from '@heroui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { editRole, getRole } from '@/apis/role-api';
import RoleForm, { type FormType } from '../-components/RoleForm';
import Loading from '@repo/ui-component/Loading';

const RoleIdPage = () => {
  const navigate = useNavigate();
  const { roleId } = Route.useParams();
  useDocumentTitle(`编辑角色`);

  const { data: role, isLoading: isQueryLoading } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => getRole(roleId),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: FormType) => {
      await editRole(roleId, data.name, data.description);
    },
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '编辑角色成功',
        color: 'success',
      });
      navigate({ to: '/roles' });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: (error as Error).message || '编辑角色失败',
        color: 'danger',
      });
    },
  });

  if (isQueryLoading) {
    return <Loading />;
  }

  return (
    <RoleForm onSave={mutateAsync} isPending={isPending} defaultValues={role} />
  );
};

export const Route = createFileRoute('/_authenticated/roles/$roleId/edit')({
  component: RoleIdPage,
});
