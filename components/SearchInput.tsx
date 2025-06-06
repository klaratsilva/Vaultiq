"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ placeholder, value, onChange }: SearchInputProps) => {
  return (
    <div className={`mb-4 p-2`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default SearchInput;
