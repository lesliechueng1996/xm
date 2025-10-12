import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useState } from 'react';

type Props = {
  onConfirm: () => void;
  label: string;
};

const ConfirmDeleteBtn = ({ onConfirm, label }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover color="warning" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button isIconOnly aria-label={label} color="danger">
          <TrashIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 py-2">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="size-4" />
          <span>确定要删除吗？</span>
        </div>
        <div className="flex gap-2">
          <Button color="danger" size="sm" onPress={onConfirm}>
            删除
          </Button>
          <Button color="default" size="sm" onPress={() => setIsOpen(false)}>
            取消
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ConfirmDeleteBtn;
