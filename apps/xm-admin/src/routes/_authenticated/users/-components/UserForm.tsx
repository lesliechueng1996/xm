import { allRoleOptions } from '@/apis/role-api';
import { Button, Form, Input, Select, SelectItem } from '@heroui/react';
import Password from '@repo/ui-component/Password';
import { useQuery } from '@tanstack/react-query';
import type { FormEvent } from 'react';

export type FormType = {
  username: string;
  password: string;
  mobile: string;
  email: string;
  roleId: string;
};

type Props = {
  onSave: (data: FormType) => void;
  isPending: boolean;
  defaultValues?: FormType;
  isEdit?: boolean;
};

const UserForm = ({ onSave, isPending, defaultValues, isEdit }: Props) => {
  const { data: roleOptions } = useQuery({
    queryKey: ['roleOptions'],
    queryFn: allRoleOptions,
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget)) as FormType;
    onSave(data);
  };

  return (
    <Form className="w-full max-w-xl gap-4" onSubmit={onSubmit}>
      <Input
        isRequired={!isEdit}
        readOnly={isEdit}
        className="max-w-xs"
        errorMessage="管理员名称不能为空"
        label="管理员名称"
        labelPlacement="outside"
        name="username"
        placeholder="请输入管理员名称"
        maxLength={16}
        defaultValue={defaultValues?.username}
      />
      <Password
        className="max-w-xs"
        isRequired={!isEdit}
        errorMessage="管理员密码应在6-32个字符之间"
        label="管理员密码"
        labelPlacement="outside"
        name="password"
        placeholder="请输入管理员密码"
        minLength={6}
        maxLength={32}
      />
      <Input
        isRequired
        className="max-w-xs"
        errorMessage="管理员手机号不能为空"
        label="管理员手机号"
        labelPlacement="outside"
        name="mobile"
        placeholder="请输入管理员手机号"
        maxLength={16}
        defaultValue={defaultValues?.mobile}
      />
      <Input
        isRequired
        className="max-w-xs"
        errorMessage="管理员邮箱不能为空"
        label="管理员邮箱"
        labelPlacement="outside"
        name="email"
        placeholder="请输入管理员邮箱"
        maxLength={255}
        defaultValue={defaultValues?.email}
      />
      <Select
        name="roleId"
        isRequired
        errorMessage="管理员角色不能为空"
        className="max-w-xs"
        labelPlacement="outside"
        items={roleOptions ?? []}
        label="管理员角色"
        placeholder="选择管理员角色"
        defaultSelectedKeys={
          defaultValues?.roleId ? [defaultValues.roleId] : []
        }
      >
        {(role) => <SelectItem>{role.label}</SelectItem>}
      </Select>
      <Button type="submit" variant="bordered" isLoading={isPending}>
        提交
      </Button>
    </Form>
  );
};

export default UserForm;
