import { addToast } from '@heroui/react';
import Loading from '@repo/ui-component/Loading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { editFocus, getFocus } from '@/apis/focus-api';
import type { FormType } from './-components/FocusForm';
import FocusForm from './-components/FocusForm';

const EditFocusPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { focusId } = Route.useParams();
  useDocumentTitle(`编辑轮播图`);

  const { data: focus, isLoading: isQueryLoading } = useQuery({
    queryKey: ['focus', focusId],
    queryFn: () => getFocus(focusId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormType) => {
      await editFocus(focusId, {
        type: data.type,
        title: data.title,
        link: data.link,
        focusImg: data.focusImg || undefined,
        sort: data.sort,
        status: data.status,
      });
    },
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '编辑轮播图成功',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['focus', focusId] });
      navigate({ to: '/focus' });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '编辑轮播图失败',
        color: 'danger',
      });
    },
  });

  if (isQueryLoading || !focus) {
    return <Loading />;
  }

  return (
    <FocusForm
      onSave={mutate}
      isPending={isPending}
      defaultValues={focus}
      isEdit
    />
  );
};

export const Route = createFileRoute('/_authenticated/focus/$focusId')({
  component: EditFocusPage,
});
