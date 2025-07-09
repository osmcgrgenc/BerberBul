'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = props.value !== undefined && props.value !== null && props.value !== '';

    return (
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          className={cn(
            'peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-0',
            className
          )}
          placeholder=" " // Placeholder'ı boş bırakarak floating label'ı tetikle
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <Label
          htmlFor={id}
          className={cn(
            'absolute top-2 left-1 px-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4',
            'bg-white peer-focus:bg-white peer-placeholder-shown:bg-transparent', // Arka plan rengi
            isFocused || hasValue ? 'text-primary' : 'text-gray-500' // Odaklandığında veya değeri varken renk değiştir
          )}
        >
          {label}
        </Label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingLabelInput };
