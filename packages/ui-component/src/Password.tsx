import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Input } from '@heroui/react';
import { useState } from 'react';

type Props = Omit<React.ComponentProps<typeof Input>, 'endContent' | 'type'>;

const Password = ({ ...props }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Input
      {...props}
      type={isVisible ? 'text' : 'password'}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-solid outline-transparent size-6 cursor-pointer"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashIcon className="size-6" />
          ) : (
            <EyeIcon className="size-6" />
          )}
        </button>
      }
    />
  );
};

export default Password;
