import { useFormContext, type FieldValues, type Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/form";
import { Input } from "../components/input";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  className,
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
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={className}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
