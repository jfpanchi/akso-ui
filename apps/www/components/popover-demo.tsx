"use client";

import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/registry/akso/ui/popover";

/** Demo used by the docs page and by the e2e tests. */
export function PopoverDemo() {
  return (
    <div className="flex items-center gap-2">
      <span>Delivery: 3 to 5 days</span>
      <Popover>
        <PopoverTrigger openOnHover variant="ghost" size="icon" aria-label="About delivery times">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 11v6M12 7h.01" />
          </svg>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Delivery times</PopoverTitle>
          <PopoverDescription>Orders placed before 2 pm ship the same day. Weekends are not counted.</PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
}
