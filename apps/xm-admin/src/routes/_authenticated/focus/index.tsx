import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { Button, Chip, Image } from '@heroui/react';
import type { PaginationFocusesResponse } from '@repo/admin-api-types';
import { FocusStatus, FocusType } from '@repo/common-types';
import ConfirmDeleteBtn from '@repo/ui-component/ConfirmDeleteBtn';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { paginationFocuses } from '@/apis/focus-api';
import type { Column } from '@/components/DataTable';
import DataTable from '@/components/DataTable';
import { beforeLoadGuard } from '@/utils/guard-util';

const focusTypeMap = {
  [FocusType.WEB]: {
    label: '网页',
    color: 'primary',
  },
  [FocusType.APP]: {
    label: 'APP',
    color: 'secondary',
  },
  [FocusType.MINI_PROGRAM]: {
    label: '小程序',
    color: 'warning',
  },
} as const;

const focusStatusMap = {
  [FocusStatus.SHOW]: {
    label: '显示',
    color: 'success',
  },
  [FocusStatus.HIDE]: {
    label: '隐藏',
    color: 'danger',
  },
} as const;

const FocusPage = () => {
  useDocumentTitle('轮播图列表');
  const navigate = useNavigate();
  // const queryClient = useQueryClient();

  // const { mutate: delRole } = useMutation({
  //   mutationFn: (id: string) => deleteRole(id),
  //   onSuccess: () => {
  //     addToast({
  //       title: '成功',
  //       description: '删除角色成功',
  //       color: 'success',
  //     });
  //     queryClient.invalidateQueries({ queryKey: ['roles'] });
  //   },
  //   onError: (error) => {
  //     addToast({
  //       title: '错误',
  //       description: (error as Error).message || '删除角色失败',
  //       color: 'danger',
  //     });
  //   },
  // });

  const columns: Column<PaginationFocusesResponse['results'][number]>[] = [
    {
      key: 'title',
      label: '名称',
      allowsSorting: true,
    },
    {
      key: 'type',
      label: '类型',
      allowsSorting: true,
      render: (item) => (
        <Chip color={focusTypeMap[item.type].color} variant="flat">
          {focusTypeMap[item.type].label}
        </Chip>
      ),
    },
    {
      key: 'focusImg',
      label: '图片',
      render: (item) => (
        <Image src={item.focusImg} alt={item.title} width={160} height={90} />
      ),
    },
    {
      key: 'link',
      label: '跳转地址',
      allowsSorting: true,
    },
    {
      key: 'sort',
      label: '排序',
      allowsSorting: true,
    },
    {
      key: 'status',
      label: '状态',
      allowsSorting: true,
      render: (item) => (
        <Chip color={focusStatusMap[item.status].color} variant="flat">
          {focusStatusMap[item.status].label}
        </Chip>
      ),
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
              navigate({
                to: '/focus/$focusId',
                params: { focusId: item.id },
              })
            }
          >
            <PencilSquareIcon className="size-4" />
          </Button>
          <ConfirmDeleteBtn onConfirm={() => {}} label="删除角色" />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      description="轮播图列表"
      columns={columns}
      queryKey="focuses"
      queryFn={paginationFocuses}
    />
  );
};

export const Route = createFileRoute('/_authenticated/focus/')({
  component: FocusPage,
  beforeLoad: beforeLoadGuard('focus:list'),
});
