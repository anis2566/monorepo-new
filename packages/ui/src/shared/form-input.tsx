import { useFormContext, type FieldValues, type Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../components/form";
import { Input } from "../components/input";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
  onChange?: (value: string) => void;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  className,
  description,
  onChange,
}: FormInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e.target.value);
              }}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={className}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
