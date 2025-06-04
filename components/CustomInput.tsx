import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface CustomInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

const CustomInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
  disabled = false,
}: CustomInputProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <FormLabel>{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                {...field}
                id={name}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                className="text-sm placeholder:text-16 rounded-lg border border-gray-300 text-gray-500 placeholder:text-gray-500"
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
