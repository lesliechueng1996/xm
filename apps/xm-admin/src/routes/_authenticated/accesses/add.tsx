import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { createAccess } from '@/apis/access-api';
import { beforeLoadGuard } from '@/utils/guard-util';
import AccessForm, { type FormType } from './-components/AccessForm';

const AddAccessPage = () => {
  const navigate = useNavigate();
  useDocumentTitle('增加权限');
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormType) => createAccess(data),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '创建权限成功',
        color: 'success',
      });
      navigate({ to: '/accesses' });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: (error as Error).message || '创建权限失败',
        color: 'danger',
      });
    },
  });

  return <AccessForm onSave={mutate} isPending={isPending} />;
};

export const Route = createFileRoute('/_authenticated/accesses/add')({
  component: AddAccessPage,
  beforeLoad: beforeLoadGuard('accesses:add'),
});
