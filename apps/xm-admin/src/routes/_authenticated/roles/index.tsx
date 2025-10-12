import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Button } from '@heroui/react';
import type { PaginationRolesResponse } from '@repo/admin-api-types';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { paginationRoles } from '@/apis/role-api';
import DataTable, { type Column } from '@/components/DataTable';
import { formatDate } from '@/utils/date-util';

const RolesPage = () => {
  useDocumentTitle('角色列表');
  const navigate = useNavigate();

  const columns: Column<PaginationRolesResponse['results'][number]>[] = [
    {
      key: 'name',
      label: '角色名称',
    },
    {
      key: 'description',
      label: '角色描述',
    },
    {
      key: 'createdAt',
      label: '创建时间',
      render: (item) => formatDate(item.createdAt),
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
          <Button isIconOnly aria-label="删除角色" color="danger">
            <TrashIcon className="size-4" />
          </Button>
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
