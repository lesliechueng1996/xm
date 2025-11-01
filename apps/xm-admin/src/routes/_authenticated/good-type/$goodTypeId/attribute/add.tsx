import { addToast } from '@heroui/react';
import type { CreateGoodTypeAttrRequest } from '@repo/admin-api-types';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { createGoodTypeAttr } from '@/apis/good-type-attr-api';
import GoodTypeAttributeForm from './-components/GoodTypeForm';

const AddGoodTypeAttributePage = () => {
  const navigate = useNavigate();
  useDocumentTitle('增加商品类型属性');
  const { goodTypeId } = Route.useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Omit<CreateGoodTypeAttrRequest, 'goodTypeId'>) =>
      createGoodTypeAttr({ ...data, goodTypeId }),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '创建商品类型属性成功',
        color: 'success',
      });
      navigate({
        to: '/good-type/$goodTypeId/attribute',
        params: { goodTypeId },
      });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '创建商品类型属性失败',
        color: 'danger',
      });
    },
  });
  return <GoodTypeAttributeForm onSave={mutate} isPending={isPending} />;
};

export const Route = createFileRoute(
  '/_authenticated/good-type/$goodTypeId/attribute/add',
)({
  component: AddGoodTypeAttributePage,
});
