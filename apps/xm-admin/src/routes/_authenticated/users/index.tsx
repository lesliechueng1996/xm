import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { addToast, Button } from '@heroui/react';
import type { PaginationUsersResponse } from '@repo/admin-api-types';
import ConfirmDeleteBtn from '@repo/ui-component/ConfirmDeleteBtn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import DataTable, { type Column } from '@/components/DataTable';
import { formatDate } from '@/utils/date-util';
import { deleteUser, paginationUsers } from '@/apis/user-api';
import useUser from '@/hooks/useUser';

const UsersPage = () => {
  useDocumentTitle('管理员列表');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: self } = useUser();

  const { mutate: delUser } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '删除管理员成功',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: (error as Error).message || '删除管理员失败',
        color: 'danger',
      });
    },
  });

  const columns: Column<PaginationUsersResponse['results'][number]>[] = [
    {
      key: 'username',
      label: '管理员名称',
      allowsSorting: true,
    },
    {
      key: 'mobile',
      label: '管理员电话',
      allowsSorting: true,
    },
    {
      key: 'email',
      label: '管理员邮箱',
      allowsSorting: true,
    },
    {
      key: 'roleName',
      label: '管理员角色',
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
            aria-label="编辑管理员"
            variant="faded"
            color="secondary"
            onPress={() =>
              navigate({ to: '/users/$userId', params: { userId: item.id } })
            }
          >
            <PencilSquareIcon className="size-4" />
          </Button>
          {item.isSuper !== 1 && self?.userId !== item.id && (
            <ConfirmDeleteBtn
              onConfirm={() => delUser(item.id)}
              label="删除管理员"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      description="管理员列表"
      columns={columns}
      queryKey="users"
      queryFn={paginationUsers}
    />
  );
};

export const Route = createFileRoute('/_authenticated/users/')({
  component: UsersPage,
});
