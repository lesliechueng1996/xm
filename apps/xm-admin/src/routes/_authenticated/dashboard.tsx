import { createFileRoute } from '@tanstack/react-router';

const DashboardPage = () => {
  return <div>DashboardPage</div>;
};

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});
