import {
  useFormContext,
  type FieldValues,
  type Path,
  Controller,
} from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import { MultiSelect } from "../components/multi-select";

interface FormMultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  disabled?: boolean;
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  onClick?: (value: string[]) => void;
}

export function FormMultiSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  options,
  disabled = false,
  onClick,
}: FormMultiSelectProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultiSelect
              options={options}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value);
                onClick?.(value);
              }}
              defaultValue={field.value}
              placeholder={placeholder}
              animation={0}
              maxCount={3}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
