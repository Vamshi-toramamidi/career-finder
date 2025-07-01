"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  emptyText = "No options found.",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = React.useCallback(
    (value: string) => {
      const updatedSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
      onChange(updatedSelected)
    },
    [selected, onChange],
  )

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  }

  const selectedOptions = selected
    .map((value) => options.find((option) => option.value === value))
    .filter(Boolean) as Option[];

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between min-h-[40px] text-left", className)}
            >
            <span className="truncate">
              {selectedOptions.length > 0
                ? `${selectedOptions.length} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search options..." className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                    {option.label}
                    <Check
                      className={cn("ml-auto h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")}
                      />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Chips Card */}
      {selectedOptions.length > 0 && (
        <div className="mb-2 p-4 rounded border bg-background shadow flex flex-wrap gap-2 min-h-[40px]">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="flex items-center bg-border text-primary rounded px-2 py-0.5 text-xs w-36 justify-between"
            >
              <span className="truncate flex-1">{option.label}</span>
              <button
                type="button"
                className="ml-1 hover:text-destructive focus:outline-none"
                onClick={(e) => handleRemove(option.value, e)}
                tabIndex={-1}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}