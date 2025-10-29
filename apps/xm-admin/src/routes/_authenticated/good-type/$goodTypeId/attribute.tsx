import { createFileRoute } from '@tanstack/react-router';
import { beforeLoadGuard } from '@/utils/guard-util';

const GoodTypeAttributePage = () => {
  return <div>GoodTypeAttributePage</div>;
};

export const Route = createFileRoute(
  '/_authenticated/good-type/$goodTypeId/attribute',
)({
  component: GoodTypeAttributePage,
  beforeLoad: beforeLoadGuard('good-type:attr'),
});
