import {
  addToast,
  getKeyValue,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import {
  defaultPageSize,
  type PaginationRequest,
  type PaginationResponse,
} from '@repo/common-types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';

export type Column<T extends BaseItem> = {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
};

type BaseItem = {
  id: string;
};

type Props<T extends BaseItem> = {
  description: string;
  columns: Column<T>[];
  queryFn: (params: PaginationRequest) => Promise<PaginationResponse<T>>;
  queryKey: string | string[];
};

const DataTable = <T extends BaseItem>({
  description,
  columns,
  queryFn,
  queryKey,
}: Props<T>) => {
  const queryKeys = Array.isArray(queryKey) ? queryKey : [queryKey];

  const [page, setPage] = useState(1);

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: [...queryKeys, page],
      queryFn: () => queryFn({ page, pageSize: defaultPageSize }),
      placeholderData: keepPreviousData,
    });

  const loadingState = isPending
    ? 'loading'
    : isFetching
      ? 'loadingMore'
      : 'idle';
  const pages = data?.totalPages ?? 0;

  useEffect(() => {
    if (isError && error) {
      console.error(error);
      addToast({
        title: '错误',
        description: error.message || '加载数据失败',
        color: 'danger',
      });
    }
  }, [isError, error]);

  const renderCell = (item: T, columnKey: string) => {
    const column = columns.find((column) => column.key === columnKey);
    if (column?.render) {
      return column.render(item);
    }
    return getKeyValue(item, columnKey);
  };

  return (
    <Table
      aria-label={description}
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
              isDisabled={isPlaceholderData}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={data?.results ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item) => (
          <TableRow key={item?.id}>
            {(columnKey) => {
              return (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;
