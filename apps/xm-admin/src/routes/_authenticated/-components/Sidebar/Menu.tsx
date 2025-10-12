import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

type Props = {
  label: string;
  items: {
    label: string;
    key: string;
    path: string;
  }[];
};

const Menu = ({ label, items }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-sm">
      <button
        type="button"
        className="w-full px-2 py-1 mb-1 rounded-md hover:bg-default-200/50 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>{label}</p>
        <ChevronRightIcon
          className={`size-4 transition-transform duration-300 ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="px-4 pb-2">
            {items.map((item) => (
              <div key={item.key} className="border-l border-divider px-2">
                <div className="px-2 py-1 hover:bg-default-200/50 cursor-pointer rounded-md">
                  <p>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
