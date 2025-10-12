import { createFileRoute } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';

const RolesPage = () => {
  useDocumentTitle('角色列表');
  return <div>index</div>;
};

export const Route = createFileRoute('/_authenticated/roles/')({
  component: RolesPage,
});
