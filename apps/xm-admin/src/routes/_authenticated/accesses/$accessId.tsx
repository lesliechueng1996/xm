import { addToast } from '@heroui/react';
import type { EditAccessRequest } from '@repo/admin-api-types';
import { AdminAccessType } from '@repo/common-types';
import Loading from '@repo/ui-component/Loading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { editAccess, getAccess } from '@/apis/access-api';
import { beforeLoadGuard } from '@/utils/guard-util';
import AccessForm, {
  type MenuFormType,
  type ModuleFormType,
  type OperationFormType,
} from './-components/AccessForm';

const EditAccessPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessId } = Route.useParams();
  useDocumentTitle(`编辑权限`);

  const { data: access, isFetching } = useQuery({
    queryKey: ['access', accessId],
    queryFn: () => getAccess(accessId),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EditAccessRequest) => {
      await editAccess(accessId, data);
    },
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '编辑权限成功',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['access', accessId] });
      navigate({ to: '/accesses' });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: (error as Error).message || '编辑权限失败',
        color: 'danger',
      });
    },
  });

  if (isFetching || !access) {
    return <Loading />;
  }

  if (access.type === AdminAccessType.MODULE) {
    const defaultValues: ModuleFormType = {
      accessName: access.accessName,
      type: access.type as AdminAccessType.MODULE,
      key: access.key ?? '',
      sort: access.sort,
      description: access.description,
    };

    return (
      <AccessForm
        onSave={mutate}
        isPending={isPending}
        defaultValues={defaultValues}
        isEdit
      />
    );
  }

  const defaultValues: MenuFormType | OperationFormType = {
    accessName: access.accessName,
    type: access.type as AdminAccessType.MENU | AdminAccessType.OPERATION,
    url: access.url ?? '',
    parentId: access.parentId ?? '',
    key: access.key ?? '',
    sort: access.sort,
    description: access.description,
  };

  return (
    <AccessForm
      onSave={mutate}
      isPending={isPending}
      defaultValues={defaultValues}
      isEdit
    />
  );
};

export const Route = createFileRoute('/_authenticated/accesses/$accessId')({
  component: EditAccessPage,
  beforeLoad: beforeLoadGuard('accesses:edit'),
});
