import {
  Button,
  Form,
  Input,
  Radio,
  RadioGroup,
  Textarea,
} from '@heroui/react';
import { GoodTypeAttrStatus, GoodTypeAttrType } from '@repo/common-types';
import { type FormEvent, useEffect, useState } from 'react';

export type FormType = {
  title: string;
  attrType: GoodTypeAttrType;
  attrValue: string;
  status: GoodTypeAttrStatus;
};

type Props = {
  onSave: (data: FormType) => void;
  isPending: boolean;
  defaultValues?: FormType;
};

const GoodTypeAttributeForm = ({ onSave, isPending, defaultValues }: Props) => {
  const [attrType, setAttrType] = useState<string>(
    defaultValues?.attrType ?? GoodTypeAttrType.INPUT,
  );
  const [attrValue, setAttrValue] = useState<string>(
    defaultValues?.attrValue ?? '',
  );

  useEffect(() => {
    if (attrType !== GoodTypeAttrType.SELECT) {
      setAttrValue('');
    }
  }, [attrType]);

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
        errorMessage="属性名称不能为空"
        label="属性名称"
        labelPlacement="outside"
        name="title"
        placeholder="请输入属性名称"
        maxLength={16}
        defaultValue={defaultValues?.title}
      />
      <RadioGroup
        isRequired
        label="录入方式"
        orientation="horizontal"
        name="attrType"
        value={attrType}
        onValueChange={setAttrType}
      >
        <Radio value={GoodTypeAttrType.INPUT}>输入框</Radio>
        <Radio value={GoodTypeAttrType.TEXTAREA}>文本框</Radio>
        <Radio value={GoodTypeAttrType.SELECT}>下拉框</Radio>
      </RadioGroup>
      {attrType === GoodTypeAttrType.SELECT && (
        <Textarea
          isRequired={attrType === GoodTypeAttrType.SELECT}
          disabled={attrType !== GoodTypeAttrType.SELECT}
          className="w-full"
          isClearable
          label="可选值列表"
          labelPlacement="outside"
          name="attrValue"
          placeholder="请输入可选值列表"
          minRows={6}
          value={attrValue}
          onValueChange={setAttrValue}
        />
      )}
      <RadioGroup
        isRequired
        label="状态"
        orientation="horizontal"
        name="status"
        defaultValue={
          defaultValues?.status?.toString() ??
          GoodTypeAttrStatus.ENABLED.toString()
        }
      >
        <Radio value={GoodTypeAttrStatus.ENABLED.toString()}>启用</Radio>
        <Radio value={GoodTypeAttrStatus.DISABLED.toString()}>禁用</Radio>
      </RadioGroup>
      <Button type="submit" variant="bordered" isLoading={isPending}>
        提交
      </Button>
    </Form>
  );
};

export default GoodTypeAttributeForm;
