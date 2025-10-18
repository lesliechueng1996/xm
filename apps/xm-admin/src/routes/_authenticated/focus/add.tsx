import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { createFocus } from '@/apis/focus-api';
import { beforeLoadGuard } from '@/utils/guard-util';
import FocusForm, { type FormType } from './-components/FocusForm';

const AddFocusPage = () => {
  useDocumentTitle('增加轮播图');
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormType) => createFocus(data),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '创建轮播图成功',
        color: 'success',
      });
      navigate({ to: '/focus' });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '创建轮播图失败',
        color: 'danger',
      });
    },
  });
  return <FocusForm onSave={mutate} isPending={isPending} />;
};

export const Route = createFileRoute('/_authenticated/focus/add')({
  component: AddFocusPage,
  beforeLoad: beforeLoadGuard('focus:add'),
});
