import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/form";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import { Label } from "../components/label";

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface FormRadioProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: RadioOption[];
  disabled?: boolean;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function FormRadio<T extends FieldValues>({
  name,
  label,
  options,
  disabled = false,
  className,
  orientation = "vertical",
}: FormRadioProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
              className={
                orientation === "horizontal"
                  ? "flex flex-row gap-4"
                  : "flex flex-col gap-2"
              }
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${name}-${option.value}`}
                    disabled={option.disabled || disabled}
                  />
                  <Label
                    htmlFor={`${name}-${option.value}`}
                    className={
                      option.disabled || disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
