import { createFileRoute } from '@tanstack/react-router';
import { useDocumentTitle } from 'usehooks-ts';
import { beforeLoadGuard } from '@/utils/guard-util';

const FocusPage = () => {
  useDocumentTitle('轮播图列表');
  return <div>FocusPage</div>;
};

export const Route = createFileRoute('/_authenticated/focus/')({
  component: FocusPage,
  beforeLoad: beforeLoadGuard('focus:list'),
});
