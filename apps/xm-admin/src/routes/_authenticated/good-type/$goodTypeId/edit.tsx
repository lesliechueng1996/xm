import { addToast } from '@heroui/react';
import Loading from '@repo/ui-component/Loading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { editGoodType, getGoodType } from '@/apis/good-type-api';
import { beforeLoadGuard } from '@/utils/guard-util';
import type { FormType } from '../-components/GoodTypeForm';
import GoodTypeForm from '../-components/GoodTypeForm';

const EditGoodTypePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { goodTypeId } = Route.useParams();
  useDocumentTitle(`编辑管理员`);

  const { data: goodType, isLoading: isQueryLoading } = useQuery({
    queryKey: ['good-type', goodTypeId],
    queryFn: () => getGoodType(goodTypeId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormType) => {
      await editGoodType(goodTypeId, {
        title: data.title,
        description: data.description,
        status: data.status,
      });
    },
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '编辑商品类型成功',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['good-type', goodTypeId] });
      navigate({ to: '/good-type' });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '编辑商品类型失败',
        color: 'danger',
      });
    },
  });

  if (isQueryLoading || !goodType) {
    return <Loading />;
  }

  return (
    <GoodTypeForm
      onSave={mutate}
      isPending={isPending}
      defaultValues={{
        title: goodType.title,
        description: goodType.description,
        status: goodType.status,
      }}
    />
  );
};

export const Route = createFileRoute(
  '/_authenticated/good-type/$goodTypeId/edit',
)({
  component: EditGoodTypePage,
  beforeLoad: beforeLoadGuard('good-type:edit'),
});
