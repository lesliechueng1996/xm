import {
  Button,
  Form,
  Input,
  Radio,
  RadioGroup,
  Textarea,
} from '@heroui/react';
import { GoodTypeStatus } from '@repo/common-types';
import type { FormEvent } from 'react';

export type FormType = {
  title: string;
  description?: string;
  status: GoodTypeStatus;
};

type Props = {
  onSave: (data: FormType) => void;
  isPending: boolean;
  defaultValues?: FormType;
};

const GoodTypeForm = ({ onSave, isPending, defaultValues }: Props) => {
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as unknown as FormType;
    onSave({
      ...data,
      status: Number(data.status),
    });
  };

  return (
    <Form className="w-full max-w-xl gap-4" onSubmit={onSubmit}>
      <Input
        isRequired
        className="max-w-xs"
        errorMessage="商品类型名称不能为空"
        label="商品类型名称"
        labelPlacement="outside"
        name="title"
        placeholder="请输入商品类型名称"
        maxLength={16}
        defaultValue={defaultValues?.title}
      />
      <Textarea
        className="w-full"
        isClearable
        label="商品类型描述"
        labelPlacement="outside"
        name="description"
        placeholder="请输入商品类型描述"
        minRows={6}
        maxRows={8}
        defaultValue={defaultValues?.description}
      />
      <RadioGroup
        isRequired
        label="状态"
        orientation="horizontal"
        name="status"
        defaultValue={
          defaultValues?.status?.toString() ?? GoodTypeStatus.ENABLED.toString()
        }
      >
        <Radio value={GoodTypeStatus.ENABLED.toString()}>启用</Radio>
        <Radio value={GoodTypeStatus.DISABLED.toString()}>禁用</Radio>
      </RadioGroup>
      <Button type="submit" variant="bordered" isLoading={isPending}>
        提交
      </Button>
    </Form>
  );
};

export default GoodTypeForm;
