import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { createGoodType } from '@/apis/good-type-api';
import { beforeLoadGuard } from '@/utils/guard-util';
import type { FormType } from './-components/GoodTypeForm';
import GoodTypeForm from './-components/GoodTypeForm';

const CreateGoodTypePage = () => {
  const navigate = useNavigate();
  useDocumentTitle('增加商品类型');

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormType) => createGoodType(data),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '创建商品类型成功',
        color: 'success',
      });
      navigate({ to: '/good-type' });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '创建商品类型失败',
        color: 'danger',
      });
    },
  });
  return <GoodTypeForm onSave={mutate} isPending={isPending} />;
};

export const Route = createFileRoute('/_authenticated/good-type/add')({
  component: CreateGoodTypePage,
  beforeLoad: beforeLoadGuard('good-type:add'),
});
