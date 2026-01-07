import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { cn } from "../lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  onClick?: (value: string) => void;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  options,
  disabled = false,
  onValueChange,
  className,
  triggerClassName,
  contentClassName,
  onClick,
}: FormSelectProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onValueChange?.(value);
                onClick?.(value);
              }}
              value={field.value?.toString() || ""}
              disabled={disabled}
              defaultValue={field.value?.toString() || ""}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "w-full rounded-xs shadow-none",
                    triggerClassName
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={contentClassName}>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
