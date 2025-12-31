import {
  useFormContext,
  type FieldValues,
  type Path,
  Controller,
} from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/form";
import { Calendar } from "../components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { cn } from "@workspace/ui/lib/utils";

interface FormCalendarProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  disabled?: boolean;
  placeholder?: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  withTime?: boolean;
}

export function FormCalendar<T extends FieldValues>({
  name,
  label,
  placeholder = "Pick a date",
  disabled = false,
  disableFuture = false,
  disablePast = false,
  withTime = false,
}: FormCalendarProps<T>) {
  const { control } = useFormContext<T>();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const dateValue = field.value ? new Date(field.value) : undefined;
        const timeValue = dateValue
          ? `${String(dateValue.getUTCHours()).padStart(2, "0")}:${String(dateValue.getUTCMinutes()).padStart(2, "0")}`
          : "12:00";

        const handleTimeChange = (time: string) => {
          if (!dateValue) return;

          const [hours, minutes] = time.split(":").map(Number);
          const localYear = dateValue.getFullYear();
          const localMonth = dateValue.getMonth();
          const localDay = dateValue.getDate();

          const newDate = new Date(
            Date.UTC(localYear, localMonth, localDay, hours, minutes, 0)
          );

          field.onChange(newDate.toISOString());
        };

        const formatDisplayValue = () => {
          if (!field.value) return placeholder;
          if (withTime) {
            return format(new Date(field.value), "PPP 'at' p");
          }
          return format(new Date(field.value), "PPP");
        };

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full rounded-xs shadow-none dark:bg-background dark:hover:bg-background pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <span>{formatDisplayValue()}</span>
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xs" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={(date) => {
                    if (date) {
                      const localYear = date.getFullYear();
                      const localMonth = date.getMonth();
                      const localDay = date.getDate();

                      // Preserve time if it exists, otherwise default to 12:00
                      const hours = dateValue?.getUTCHours() || 12;
                      const minutes = dateValue?.getUTCMinutes() || 0;

                      const fixedDate = new Date(
                        Date.UTC(
                          localYear,
                          localMonth,
                          localDay,
                          hours,
                          minutes,
                          0
                        )
                      );

                      field.onChange(fixedDate.toISOString());
                    } else {
                      field.onChange("");
                    }
                  }}
                  disabled={(date) => {
                    if (disabled) return true;
                    if (disableFuture && date > new Date()) return true;
                    if (disablePast && date < new Date()) return true;
                    return false;
                  }}
                />
                {withTime && (
                  <div className="p-3 border-t">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`time-${name}`}
                        className="text-sm font-medium"
                      >
                        Time:
                      </label>
                      <Input
                        id={`time-${name}`}
                        type="time"
                        value={timeValue}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        disabled={!dateValue}
                        className="w-[130px] rounded-xs shadow-none"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setOpen(false)}
                        className="ml-auto"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
