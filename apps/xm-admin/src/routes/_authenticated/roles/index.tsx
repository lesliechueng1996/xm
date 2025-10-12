import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { addToast, Button } from '@heroui/react';
import type { PaginationRolesResponse } from '@repo/admin-api-types';
import ConfirmDeleteBtn from '@repo/ui-component/ConfirmDeleteBtn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { deleteRole, paginationRoles } from '@/apis/role-api';
import DataTable, { type Column } from '@/components/DataTable';
import { formatDate } from '@/utils/date-util';

const RolesPage = () => {
  useDocumentTitle('角色列表');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: delRole } = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '删除角色成功',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: (error as Error).message || '删除角色失败',
        color: 'danger',
      });
    },
  });

  const columns: Column<PaginationRolesResponse['results'][number]>[] = [
    {
      key: 'name',
      label: '角色名称',
      allowsSorting: true,
    },
    {
      key: 'description',
      label: '角色描述',
      allowsSorting: true,
    },
    {
      key: 'createdAt',
      label: '创建时间',
      render: (item) => formatDate(item.createdAt),
      allowsSorting: true,
      isDefaultSorting: true,
      defaultSortDirection: 'descending',
    },
    {
      key: 'op',
      label: '操作',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            isIconOnly
            aria-label="编辑角色"
            variant="faded"
            color="secondary"
            onPress={() =>
              navigate({ to: '/roles/$roleId', params: { roleId: item.id } })
            }
          >
            <PencilSquareIcon className="size-4" />
          </Button>
          <ConfirmDeleteBtn
            onConfirm={() => delRole(item.id)}
            label="删除角色"
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      description="角色列表"
      columns={columns}
      queryKey="roles"
      queryFn={paginationRoles}
    />
  );
};

export const Route = createFileRoute('/_authenticated/roles/')({
  component: RolesPage,
});
