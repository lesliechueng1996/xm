import {
  addToast,
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Divider,
} from '@heroui/react';
import Loading from '@repo/ui-component/Loading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useDocumentTitle } from 'usehooks-ts';
import { getAccessTree } from '@/apis/access-api';
import { getRoleAccess, saveRoleAccess } from '@/apis/role-api';

const RoleAccessPage = () => {
  const { roleId } = Route.useParams();
  useDocumentTitle('角色权限');
  const queryClient = useQueryClient();
  const { data: accessTree, isFetching: isFetchingAccessTree } = useQuery({
    queryKey: ['access-tree'],
    queryFn: () => getAccessTree(),
    initialData: [],
  });
  const { data: roleAccess, isFetching: isFetchingRoleAccess } = useQuery({
    queryKey: ['role-access', roleId],
    queryFn: () => getRoleAccess(roleId),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (accessIds: string[]) => saveRoleAccess(roleId, accessIds),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '保存角色权限成功',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['role-access', roleId] });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: (error as Error).message || '保存角色权限失败',
        color: 'danger',
      });
      queryClient.invalidateQueries({ queryKey: ['role-access', roleId] });
    },
  });

  const [accessIds, setAccessIds] = useState<string[]>([]);

  useEffect(() => {
    setAccessIds(roleAccess?.accessIds ?? []);
  }, [roleAccess]);

  const handleCheckboxChange = (value: string[]) => {
    const newAccessId = value.find((id) => !accessIds.includes(id));
    if (newAccessId) {
      const selectedModule = accessTree.find(
        (module) => module.id === newAccessId,
      );
      if (selectedModule) {
        const menuIds = selectedModule.children.map((menu) => menu.id);
        const newAccessIdSet = new Set([...value, ...menuIds]);
        setAccessIds(Array.from(newAccessIdSet));
        return;
      }
      const relatedModule = accessTree.find((module) =>
        module.children.some((menu) => menu.id === newAccessId),
      );
      if (relatedModule) {
        const newAccessIdSet = new Set([...value, relatedModule.id]);
        setAccessIds(Array.from(newAccessIdSet));
        return;
      }
      setAccessIds(value);
      return;
    }

    const removedAccessId = accessIds.find((id) => !value.includes(id));
    if (removedAccessId) {
      const removedModule = accessTree.find(
        (module) => module.id === removedAccessId,
      );
      if (removedModule) {
        const menuIds = removedModule.children.map((menu) => menu.id);
        const newAccessIdSet = new Set(
          value.filter((id) => id !== removedAccessId && !menuIds.includes(id)),
        );
        setAccessIds(Array.from(newAccessIdSet));
        return;
      }
      const relatedModule = accessTree.find((module) =>
        module.children.some((menu) => menu.id === removedAccessId),
      );
      if (relatedModule) {
        const remainMenu = value.find((id) =>
          relatedModule.children.some((menu) => menu.id === id),
        );
        if (!remainMenu) {
          setAccessIds(value.filter((id) => id !== relatedModule.id));
          return;
        }
      }
    }

    setAccessIds(value);
  };

  if (isFetchingAccessTree || isFetchingRoleAccess) {
    return <Loading />;
  }

  return (
    <div>
      <CheckboxGroup value={accessIds} onValueChange={handleCheckboxChange}>
        {accessTree.map((module) => (
          <Card key={module.id} className="mb-4">
            <CardBody className="flex flex-col gap-2">
              <div>
                <Checkbox value={module.id} className="font-bold">
                  {module.accessName}
                </Checkbox>
              </div>

              <Divider />

              <div className="flex gap-5 flex-wrap">
                {module.children.map((menu) => (
                  <Checkbox key={menu.id} value={menu.id} size="sm">
                    {menu.accessName}
                  </Checkbox>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </CheckboxGroup>
      <Button
        type="button"
        variant="bordered"
        isLoading={isPending}
        onPress={() => mutate(accessIds)}
      >
        保存
      </Button>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/roles/$roleId/access')({
  component: RoleAccessPage,
});
