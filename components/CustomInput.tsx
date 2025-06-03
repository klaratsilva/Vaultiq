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
        <div className="form-item">
          <FormLabel>{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                {...field}
                id={name}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                className="input-class"
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
