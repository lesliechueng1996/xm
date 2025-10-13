import { createFileRoute } from '@tanstack/react-router';

const AccessesPage = () => {
  return <div>AccessesPage</div>;
};

export const Route = createFileRoute('/_authenticated/access/')({
  component: AccessesPage,
});
