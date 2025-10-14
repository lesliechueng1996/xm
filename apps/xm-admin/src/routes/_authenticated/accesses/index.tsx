import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { deleteAccess, getAllAccesses } from '@/apis/access-api';
import {
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  addToast,
} from '@heroui/react';
import { formatDate } from '@/utils/date-util';
import { AdminAccessType } from '@repo/common-types';
import ConfirmDeleteBtn from '@repo/ui-component/ConfirmDeleteBtn';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { useDocumentTitle } from 'usehooks-ts';

const accessTypeMap = {
  [AdminAccessType.MODULE]: {
    color: 'primary',
    label: '模块',
  },
  [AdminAccessType.MENU]: {
    color: 'secondary',
    label: '菜单',
  },
  [AdminAccessType.OPERATION]: {
    color: 'success',
    label: '操作',
  },
} as const;

const AccessesPage = () => {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ['accesses'],
    queryFn: () => getAllAccesses(),
  });
  useDocumentTitle('权限列表');
  const queryClient = useQueryClient();

  const { mutate: delAccess } = useMutation({
    mutationFn: (id: string) => deleteAccess(id),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '删除权限成功',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['accesses'] });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: (error as Error).message || '删除权限失败',
        color: 'danger',
      });
    },
  });

  return (
    <Table
      aria-label="权限列表"
      isStriped
      isHeaderSticky
      classNames={{
        base: 'h-full overflow-y-scroll p-1',
      }}
    >
      <TableHeader>
        <TableColumn>模块名称</TableColumn>
        <TableColumn>菜单名称</TableColumn>
        <TableColumn>操作名称</TableColumn>
        <TableColumn>类型</TableColumn>
        <TableColumn>权限地址</TableColumn>
        <TableColumn>排序</TableColumn>
        <TableColumn>描述</TableColumn>
        <TableColumn>创建时间</TableColumn>
        <TableColumn>操作</TableColumn>
      </TableHeader>
      <TableBody>
        {(data ?? []).map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.moduleName}</TableCell>
            <TableCell>{item.menuName}</TableCell>
            <TableCell>{item.operationName}</TableCell>
            <TableCell>
              <Chip color={accessTypeMap[item.type].color} variant="flat">
                {accessTypeMap[item.type].label}
              </Chip>
            </TableCell>
            <TableCell>{item.url}</TableCell>
            <TableCell>{item.sort}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{formatDate(item.createdAt)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  aria-label="编辑权限"
                  variant="faded"
                  color="secondary"
                  onPress={() =>
                    navigate({
                      to: '/accesses/$accessId',
                      params: { accessId: item.id },
                    })
                  }
                >
                  <PencilSquareIcon className="size-4" />
                </Button>
                <ConfirmDeleteBtn
                  onConfirm={() => delAccess(item.id)}
                  label="删除权限"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const Route = createFileRoute('/_authenticated/accesses/')({
  component: AccessesPage,
});
