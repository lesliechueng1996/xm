import { Input } from '@heroui/react';
import { type ComponentProps, useRef, useState } from 'react';

type Props = {
  value: string;
  onConfirm: (value: string) => void;
} & Omit<
  ComponentProps<typeof Input>,
  | 'value'
  | 'onValueChange'
  | 'onClick'
  | 'readOnly'
  | 'onBlur'
  | 'onKeyDown'
  | 'ref'
>;

const EditInput = ({ value, onConfirm, ...props }: Props) => {
  const [inputValue, setInputValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputValueChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleInputClick = () => {
    setIsEditing(true);
    inputRef.current?.focus();
  };

  const handleInputBlur = () => {
    if (inputValue === '') {
      setInputValue(value);
      return;
    }
    setIsEditing(false);
    onConfirm(inputValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
    if (e.key === 'Escape') {
      setInputValue(value);
      setIsEditing(false);
    }
  };

  return (
    <Input
      value={inputValue}
      onValueChange={handleInputValueChange}
      onClick={handleInputClick}
      readOnly={!isEditing}
      onBlur={handleInputBlur}
      onKeyDown={handleInputKeyDown}
      ref={inputRef}
      size="sm"
      className="max-w-[100px]"
      {...props}
    />
  );
};

export default EditInput;
