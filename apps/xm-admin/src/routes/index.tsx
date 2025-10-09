import { createFileRoute } from '@tanstack/react-router';

const IndexPage = () => {
  return <div>index</div>;
};

export const Route = createFileRoute('/')({ component: IndexPage });
