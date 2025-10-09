import { Button } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';

const IndexPage = () => {
  return (
    <div>
      index
      <Button color="primary">Click me</Button>
    </div>
  );
};

export const Route = createFileRoute('/')({ component: IndexPage });
