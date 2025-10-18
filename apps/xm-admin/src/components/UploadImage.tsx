import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { addToast, Image, Input, Spinner } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import {
  type ChangeEventHandler,
  type RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useUnmount } from 'usehooks-ts';
import { uploadImage } from '@/apis/image-api';

export type UploadImageRef = {
  uploadImage: () => Promise<string | null>;
};

type Props = {
  isRequired?: boolean;
  label: string;
  isDisabled?: boolean;
  ref: RefObject<UploadImageRef | null>;
};

const UploadImage = ({
  isRequired = true,
  label,
  isDisabled = false,
  ref,
}: Props) => {
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onSuccess: () => {
      addToast({
        title: '成功',
        description: '上传图片成功',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: '错误',
        description: error.message || '上传图片失败',
        color: 'danger',
      });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
  });
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => {
    return {
      uploadImage: async () => {
        if (!inputRef.current) {
          return null;
        }
        const file = inputRef.current.files?.[0];
        if (!file) {
          return null;
        }
        const response = await mutateAsync(file);
        return response.relativePath;
      },
    };
  });

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (imageData) {
      URL.revokeObjectURL(imageData);
    }
    setImageData(URL.createObjectURL(file));
  };

  useUnmount(() => {
    if (imageData) {
      URL.revokeObjectURL(imageData);
    }
    setImageData(undefined);
  });

  return (
    <div className="flex flex-col gap-2">
      <Input
        ref={inputRef}
        disabled={isDisabled || isPending}
        isRequired={isRequired}
        className="max-w-xs"
        label={label}
        labelPlacement="outside"
        type="file"
        accept="image/*"
        endContent={
          isPending ? (
            <Spinner size="sm" />
          ) : isSuccess ? (
            <CheckCircleIcon className="size-6 text-success" />
          ) : null
        }
        onChange={handleFileChange}
      />
      {imageData && (
        <Image src={imageData} width={320} height={180} alt="uploaded image" />
      )}
    </div>
  );
};

export default UploadImage;
