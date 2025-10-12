import { addToast, Button, Form, Input, Textarea } from '@heroui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { FormEvent } from 'react';
import { useDocumentTitle } from 'usehooks-ts';
import { createRole } from '@/apis/role-api';

type FormType = {
  name: string;
  description?: string;
};

const AddRolePage = () => {
  const navigate = useNavigate();
  useDocumentTitle('增加角色');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget)) as FormType;
    try {
      await createRole(data.name, data.description);
      addToast({
        title: '成功',
        description: '创建角色成功',
        color: 'success',
      });
      navigate({ to: '/roles' });
    } catch (error) {
      addToast({
        title: '错误',
        description: (error as Error).message || '创建角色失败',
        color: 'danger',
      });
    }
  };

  return (
    <Form className="w-full max-w-xl" onSubmit={onSubmit}>
      <Input
        isRequired
        className="max-w-xs"
        errorMessage="角色名称不能为空"
        label="角色名称"
        labelPlacement="outside"
        name="name"
        placeholder="请输入角色名称"
        maxLength={16}
      />
      <Textarea
        className="w-full"
        isClearable
        label="角色描述"
        labelPlacement="outside"
        name="description"
        placeholder="请输入角色描述"
        minRows={6}
        maxRows={8}
      />
      <Button type="submit" variant="bordered">
        提交
      </Button>
    </Form>
  );
};

export const Route = createFileRoute('/_authenticated/roles/add')({
  component: AddRolePage,
});
