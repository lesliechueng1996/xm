import { Bars3Icon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { addToast, Button, Switch } from '@heroui/react';
import type { PaginationGoodTypesResponse } from '@repo/admin-api-types';
import { GoodTypeStatus } from '@repo/common-types';
import ConfirmDeleteBtn from '@repo/ui-component/ConfirmDeleteBtn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import {
  changeGoodTypeStatus,
  deleteGoodType,
  paginationGoodTypes,
} from '@/apis/good-type-api';
import DataTable, { type Column } from '@/components/DataTable';
import { formatDate } from '@/utils/date-util';
import { beforeLoadGuard } from '@/utils/guard-util';

const GoodTypePage = () => {
  useDocumentTitle('商品类型列表');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: delGoodType } = useMutation({
    mutationFn: (id: string) => deleteGoodType(id),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '删除商品类型成功',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['good-types'] });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '删除商品类型失败',
        color: 'danger',
      });
    },
  });

  const { mutate: changeGoodTypeStatusMutation } = useMutation({
    mutationFn: changeGoodTypeStatus,
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '修改商品类型状态成功',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '修改商品类型状态失败',
        color: 'danger',
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['good-types'] }),
  });

  const handleChangeStatus =
    (item: PaginationGoodTypesResponse['results'][number]) =>
    (isSelected: boolean) => {
      changeGoodTypeStatusMutation({
        id: item.id,
        status: isSelected ? GoodTypeStatus.ENABLED : GoodTypeStatus.DISABLED,
      });
    };

  const columns: Column<PaginationGoodTypesResponse['results'][number]>[] = [
    {
      key: 'title',
      label: '商品类型名称',
      allowsSorting: true,
    },
    {
      key: 'description',
      label: '描述',
      allowsSorting: true,
    },
    {
      key: 'status',
      label: '状态',
      allowsSorting: true,
      render: (item) => {
        return (
          <Switch
            defaultSelected={item.status === GoodTypeStatus.ENABLED}
            onValueChange={handleChangeStatus(item)}
          />
        );
      },
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
            aria-label="属性列表"
            color="primary"
            onPress={() =>
              navigate({
                to: '/good-type/$goodTypeId/attribute',
                params: { goodTypeId: item.id },
              })
            }
          >
            <Bars3Icon className="size-4" />
          </Button>
          <Button
            isIconOnly
            aria-label="编辑商品类型"
            variant="faded"
            color="secondary"
            onPress={() =>
              navigate({
                to: '/good-type/$goodTypeId/edit',
                params: { goodTypeId: item.id },
              })
            }
          >
            <PencilSquareIcon className="size-4" />
          </Button>
          <ConfirmDeleteBtn
            onConfirm={() => delGoodType(item.id)}
            label="删除商品类型"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <Button
          aria-label="添加商品类型"
          color="primary"
          onPress={() =>
            navigate({
              to: '/good-type/add',
            })
          }
        >
          添加商品类型
        </Button>
      </div>
      <DataTable
        description="商品类型列表"
        columns={columns}
        queryKey="good-types"
        queryFn={paginationGoodTypes}
      />
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/good-type/')({
  component: GoodTypePage,
  beforeLoad: beforeLoadGuard('good-type:list'),
});
