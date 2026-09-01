"use client";

import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Type and press Enter",
  id,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  id?: string;
}) {
  const [draft, setDraft] = useState("");
  const available = suggestions.filter(
    (item) => !value.some((existing) => existing.toLowerCase() === item.toLowerCase()),
  );

  const add = (tag: string) => {
    const cleaned = tag.trim();
    if (!cleaned) return;
    if (value.some((item) => item.toLowerCase() === cleaned.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, cleaned]);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(draft);
    }
    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 rounded-lg border bg-background px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
            <button
              type="button"
              className="ml-1 rounded-sm hover:text-destructive"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((item) => item !== tag))}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <Input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          placeholder={placeholder}
          className="h-7 min-w-32 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      {available.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {available.slice(0, 8).map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-foreground"
              onClick={() => add(item)}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
