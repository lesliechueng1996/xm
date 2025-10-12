import { Button, Form, Input, Textarea } from '@heroui/react';
import type { FormEvent } from 'react';

export type FormType = {
  name: string;
  description?: string;
};

type Props = {
  onSave: (data: FormType) => Promise<void>;
  isPending: boolean;
  defaultValues?: FormType;
};

const RoleForm = ({ onSave, isPending, defaultValues }: Props) => {
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget)) as FormType;
    await onSave(data);
  };

  return (
    <Form className="w-full max-w-xl gap-4" onSubmit={onSubmit}>
      <Input
        isRequired
        className="max-w-xs"
        errorMessage="角色名称不能为空"
        label="角色名称"
        labelPlacement="outside"
        name="name"
        placeholder="请输入角色名称"
        maxLength={16}
        defaultValue={defaultValues?.name}
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
        defaultValue={defaultValues?.description}
      />
      <Button type="submit" variant="bordered" isLoading={isPending}>
        提交
      </Button>
    </Form>
  );
};

export default RoleForm;
