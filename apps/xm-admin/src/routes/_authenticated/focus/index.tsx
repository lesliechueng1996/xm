import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { addToast, Button, Chip, Image, Switch } from '@heroui/react';
import type { PaginationFocusesResponse } from '@repo/admin-api-types';
import { FocusStatus, FocusType } from '@repo/common-types';
import ConfirmDeleteBtn from '@repo/ui-component/ConfirmDeleteBtn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import {
  changeFocusStatus,
  deleteFocus,
  paginationFocuses,
} from '@/apis/focus-api';
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
    color: 'success',
  },
} as const;

const FocusPage = () => {
  useDocumentTitle('轮播图列表');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: delFocus } = useMutation({
    mutationFn: (id: string) => deleteFocus(id),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '删除轮播图成功',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['focuses'] });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '删除轮播图失败',
        color: 'danger',
      });
    },
  });

  const { mutate: changeFocusStatusMutation } = useMutation({
    mutationFn: changeFocusStatus,
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '修改轮播图状态成功',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '修改轮播图状态失败',
        color: 'danger',
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['focuses'] }),
  });

  const handleChangeStatus =
    (item: PaginationFocusesResponse['results'][number]) =>
    (isSelected: boolean) => {
      changeFocusStatusMutation({
        id: item.id,
        status: isSelected ? FocusStatus.SHOW : FocusStatus.HIDE,
      });
    };

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
      render: (item) => {
        return (
          <Switch
            defaultSelected={item.status === FocusStatus.SHOW}
            onValueChange={handleChangeStatus(item)}
          />
        );
      },
    },
    {
      key: 'op',
      label: '操作',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            isIconOnly
            aria-label="编辑轮播图"
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
          <ConfirmDeleteBtn
            onConfirm={() => delFocus(item.id)}
            label="删除轮播图"
          />
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
