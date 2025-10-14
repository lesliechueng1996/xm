import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Form,
  Input,
  NumberInput,
  Select,
  SelectItem,
  type SharedSelection,
  Textarea,
} from '@heroui/react';
import { AdminAccessType } from '@repo/common-types';
import { useQuery } from '@tanstack/react-query';
import { type FormEvent, type Key, useEffect, useState } from 'react';
import { getAccessOptions } from '@/apis/access-api';

export type ModuleFormType = {
  accessName: string;
  type: AdminAccessType.MODULE;
  sort?: number;
  description?: string;
};

export type MenuFormType = {
  accessName: string;
  type: AdminAccessType.MENU;
  url: string;
  parentId: string;
  sort?: number;
  description?: string;
};

export type OperationFormType = {
  accessName: string;
  type: AdminAccessType.OPERATION;
  url: string;
  parentId: string;
  sort?: number;
  description?: string;
};

export type FormType = ModuleFormType | MenuFormType | OperationFormType;

type Props = {
  onSave: (data: FormType) => void;
  isPending: boolean;
  defaultValues?: FormType;
  isEdit?: boolean;
};

const AccessForm = ({
  onSave,
  isPending,
  defaultValues,
  isEdit = false,
}: Props) => {
  const [accessType, setAccessType] = useState<AdminAccessType>(
    defaultValues?.type ?? AdminAccessType.MODULE,
  );
  const [parentId, setParentId] = useState<string | null>(() => {
    if (
      defaultValues?.type === AdminAccessType.MENU ||
      defaultValues?.type === AdminAccessType.OPERATION
    ) {
      return defaultValues?.parentId ?? null;
    }
    return null;
  });

  const { data: parentOptions } = useQuery({
    queryKey: ['access-options', accessType],
    queryFn: () => getAccessOptions(accessType),
    initialData: [],
  });

  const handleAccessTypeChange = (keys: SharedSelection) => {
    if (keys instanceof Set) {
      setAccessType(Number(Array.from(keys)[0]) as AdminAccessType);
    }
  };

  const handleParentIdChange = (key: Key | null) => {
    if (key === null) {
      setParentId(null);
      return;
    }
    setParentId(key as string);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Need to reset parentId when accessType changes>
  useEffect(() => {
    if (isEdit) {
      return;
    }
    setParentId(null);
  }, [accessType, isEdit]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as Record<string, string>;

    if (accessType === AdminAccessType.MODULE) {
      const data: ModuleFormType = {
        accessName: formData.accessName,
        type: AdminAccessType.MODULE,
        sort: Number(formData.sort),
        description: formData.description,
      };
      onSave(data);
    } else if (
      accessType === AdminAccessType.MENU ||
      accessType === AdminAccessType.OPERATION
    ) {
      const data: MenuFormType | OperationFormType = {
        accessName: formData.accessName,
        type: accessType,
        url: formData.url,
        parentId: parentId ?? '',
        sort: Number(formData.sort),
        description: formData.description,
      };
      onSave(data);
    }
  };

  return (
    <Form className="w-full max-w-xl gap-4" onSubmit={onSubmit}>
      <Select
        name="type"
        isRequired={!isEdit}
        isDisabled={isEdit}
        className="max-w-xs"
        labelPlacement="outside"
        label="权限类型"
        placeholder="选择权限类型"
        selectedKeys={[accessType.toString()]}
        onSelectionChange={handleAccessTypeChange}
      >
        <SelectItem key={AdminAccessType.MODULE.toString()}>模块</SelectItem>
        <SelectItem key={AdminAccessType.MENU.toString()}>菜单</SelectItem>
        <SelectItem key={AdminAccessType.OPERATION.toString()}>操作</SelectItem>
      </Select>
      <Input
        isRequired
        className="max-w-xs"
        errorMessage="权限名称不能为空"
        label="权限名称"
        labelPlacement="outside"
        name="accessName"
        placeholder="请输入权限名称"
        maxLength={16}
        defaultValue={defaultValues?.accessName}
      />
      {(accessType === AdminAccessType.MENU ||
        accessType === AdminAccessType.OPERATION) && (
        <>
          <Input
            isRequired
            className="max-w-xs"
            errorMessage="权限地址不能为空"
            label="权限地址"
            labelPlacement="outside"
            name="url"
            placeholder="请输入权限地址"
            maxLength={255}
            defaultValue={
              (defaultValues as MenuFormType | OperationFormType)?.url
            }
          />
          <Autocomplete
            className="max-w-xs"
            label="选择父级权限"
            isRequired
            labelPlacement="outside"
            errorMessage="父级权限不能为空"
            name="parentId"
            selectedKey={parentId}
            onSelectionChange={handleParentIdChange}
            placeholder="请选择父级权限"
            listboxProps={{
              emptyContent: '没有找到父级权限',
            }}
          >
            {parentOptions.map((option) => (
              <AutocompleteItem key={option.key}>
                {option.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </>
      )}
      <NumberInput
        className="max-w-xs"
        label="排序"
        placeholder="请输入排序"
        name="sort"
        defaultValue={defaultValues?.sort ?? 100}
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
      <Textarea
        className="w-full"
        isClearable
        label="权限描述"
        labelPlacement="outside"
        name="description"
        placeholder="请输入权限描述"
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

export default AccessForm;
