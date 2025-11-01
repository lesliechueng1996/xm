import { addToast, Button, Switch } from '@heroui/react';
import type { PaginationGoodTypeAttrsResponse } from '@repo/admin-api-types';
import { GoodTypeAttrStatus, GoodTypeAttrType } from '@repo/common-types';
import ConfirmDeleteBtn from '@repo/ui-component/ConfirmDeleteBtn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { getGoodType } from '@/apis/good-type-api';
import {
  changeGoodTypeAttrStatus,
  deleteGoodTypeAttr,
  paginationGoodTypeAttrs,
} from '@/apis/good-type-attr-api';
import type { Column } from '@/components/DataTable';
import DataTable from '@/components/DataTable';
import { formatDate } from '@/utils/date-util';
import { beforeLoadGuard } from '@/utils/guard-util';

const GoodTypeAttrTypeMap = {
  [GoodTypeAttrType.INPUT]: '输入框',
  [GoodTypeAttrType.TEXTAREA]: '文本框',
  [GoodTypeAttrType.SELECT]: '下拉框',
};

const GoodTypeAttributePage = () => {
  useDocumentTitle('商品类型属性列表');
  const { goodTypeId } = Route.useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: goodType } = useQuery({
    queryKey: ['good-type', goodTypeId],
    queryFn: () => getGoodType(goodTypeId),
  });

  const { mutate: delGoodTypeAttr } = useMutation({
    mutationFn: (id: string) => deleteGoodTypeAttr(id),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '删除商品类型属性成功',
        color: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['good-type-attrs', goodTypeId],
      });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '删除商品类型属性失败',
        color: 'danger',
      });
    },
  });

  const { mutate: changeGoodTypeAttrStatusMutation } = useMutation({
    mutationFn: changeGoodTypeAttrStatus,
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
    (item: PaginationGoodTypeAttrsResponse['results'][number]) =>
    (isSelected: boolean) => {
      changeGoodTypeAttrStatusMutation({
        id: item.id,
        status: isSelected
          ? GoodTypeAttrStatus.ENABLED
          : GoodTypeAttrStatus.DISABLED,
      });
    };

  const columns: Column<PaginationGoodTypeAttrsResponse['results'][number]>[] =
    [
      {
        key: 'title',
        label: '属性名称',
        allowsSorting: true,
      },
      {
        key: 'goodTypeTitle',
        label: '商品类型',
      },
      {
        key: 'attrType',
        label: '录入方式',
        allowsSorting: true,
        render: (item) => GoodTypeAttrTypeMap[item.attrType],
      },
      {
        key: 'attrValue',
        label: '可选值',
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
        key: 'status',
        label: '状态',
        allowsSorting: true,
        render: (item) => {
          return (
            <Switch
              defaultSelected={item.status === GoodTypeAttrStatus.ENABLED}
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
            <ConfirmDeleteBtn
              onConfirm={() => delGoodTypeAttr(item.id)}
              label="删除属性"
            />
          </div>
        ),
      },
    ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <span>{`类型 ---- ${goodType?.title}`}</span>
        <Button
          aria-label="增加商品类型属性"
          color="primary"
          onPress={() =>
            navigate({
              to: '/good-type/$goodTypeId/attribute/add',
              params: { goodTypeId },
            })
          }
        >
          增加商品类型属性
        </Button>
      </div>
      <DataTable
        description="商品类型属性列表"
        columns={columns}
        queryKey={['good-type-attrs', goodTypeId]}
        queryFn={(params) => paginationGoodTypeAttrs({ ...params, goodTypeId })}
      />
    </div>
  );
};

export const Route = createFileRoute(
  '/_authenticated/good-type/$goodTypeId/attribute/',
)({
  component: GoodTypeAttributePage,
  beforeLoad: beforeLoadGuard('good-type:attr'),
});
