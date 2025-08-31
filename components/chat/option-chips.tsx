'use client';

import { Button } from "@/components/ui/button";

interface OptionChip {
  chipName: string;
  userMessage: string;
}

interface OptionChipsProps {
  options: OptionChip[];
  onSelect: (userMessage: string) => void;
}

export function OptionChips({ options, onSelect }: OptionChipsProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(option.userMessage)}
          className="rounded-full border-2 border-[#FF6B2D] text-[#FF6B2D] hover:bg-[#FF6B2D] hover:text-white font-medium text-sm transition-all duration-200 px-4 py-2"
        >
          {option.chipName}
        </Button>
      ))}
    </div>
  );
}