'use client';

import { Button } from "@/components/ui/button";

interface OptionsSelectorProps {
  options: string[];
  onSelect: (option: string) => void;
  multiSelect?: boolean;
  selected?: string[];
}

export function OptionsSelector({ 
  options, 
  onSelect, 
  multiSelect = false, 
  selected = [] 
}: OptionsSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option, index) => (
        <Button
          key={index}
          variant={selected.includes(option) ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(option)}
          className="rounded-full text-sm font-medium"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}