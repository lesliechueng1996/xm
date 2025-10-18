import { createFileRoute } from '@tanstack/react-router';

const EditFocusPage = () => {
  return <div>EditFocusPage</div>;
};

export const Route = createFileRoute('/_authenticated/focus/$focusId')({
  component: EditFocusPage,
});
