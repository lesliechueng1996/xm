import {
  addToast,
  Button,
  Form,
  Input,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from '@heroui/react';
import { FocusStatus, FocusType } from '@repo/common-types';
import { type FormEvent, useRef } from 'react';
import type { UploadImageRef } from '@/components/UploadImage';
import UploadImage from '@/components/UploadImage';

export type FormType = {
  type: FocusType;
  title: string;
  link: string;
  focusImg: string;
  sort: number;
  status: FocusStatus;
};

type Props = {
  onSave: (data: FormType) => void;
  isPending: boolean;
  defaultValues?: FormType;
};

const FocusForm = ({ onSave, isPending, defaultValues }: Props) => {
  const focusImgRef = useRef<UploadImageRef | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!focusImgRef.current) {
      return;
    }

    const data = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as unknown as FormType;

    const focusImg = await focusImgRef.current.uploadImage();
    if (!focusImg) {
      addToast({
        title: '错误',
        description: '上传图片失败',
        color: 'danger',
      });
      return;
    }
    data.focusImg = focusImg;
    data.sort = Number(data.sort);
    data.status = Number(data.status);
    data.type = Number(data.type);
    onSave(data);
  };

  return (
    <Form className="w-full max-w-xl gap-4" onSubmit={onSubmit}>
      <Select
        name="type"
        isRequired
        className="max-w-xs"
        labelPlacement="outside"
        label="分类"
        placeholder="选择分类"
        selectedKeys={[
          defaultValues?.type?.toString() ?? FocusType.WEB.toString(),
        ]}
      >
        <SelectItem key={FocusType.WEB.toString()}>网页</SelectItem>
        <SelectItem key={FocusType.APP.toString()}>APP</SelectItem>
        <SelectItem key={FocusType.MINI_PROGRAM.toString()}>小程序</SelectItem>
      </Select>
      <Input
        isRequired
        className="max-w-xs"
        errorMessage="名称不能为空"
        label="名称"
        labelPlacement="outside"
        name="title"
        placeholder="请输入名称"
        maxLength={16}
        defaultValue={defaultValues?.title}
      />
      <Input
        isRequired
        className="max-w-xs"
        errorMessage="跳转地址不能为空"
        label="跳转地址"
        labelPlacement="outside"
        name="link"
        placeholder="请输入跳转地址"
        maxLength={255}
        defaultValue={defaultValues?.link}
      />
      <UploadImage label="轮播图" ref={focusImgRef} isDisabled={isPending} />
      <NumberInput
        className="max-w-xs"
        label="排序"
        placeholder="请输入排序"
        name="sort"
        defaultValue={defaultValues?.sort ?? 10}
        labelPlacement="outside"
        min={0}
        max={999}
        validate={(value) => {
          if (value !== Math.floor(value)) {
            return '排序必须是整数';
          }
          return null;
        }}
      />
      <RadioGroup
        isRequired
        label="状态"
        orientation="horizontal"
        name="status"
        defaultValue={
          defaultValues?.status?.toString() ?? FocusStatus.SHOW.toString()
        }
      >
        <Radio value={FocusStatus.SHOW.toString()}>显示</Radio>
        <Radio value={FocusStatus.HIDE.toString()}>隐藏</Radio>
      </RadioGroup>
      <Button type="submit" variant="bordered" isLoading={isPending}>
        提交
      </Button>
    </Form>
  );
};

export default FocusForm;
