"use client";

import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import { Popover as BasePopover } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";
import { useAksoField } from "@/registry/akso/lib/akso-form";
import { useAksoMessages, type AksoMessages } from "@/registry/akso/lib/akso-locale";
import { buttonClassName, focusRingClassName, inputClassName, popupSurfaceClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Date picker
 *
 * Typing comes first: a text field (inside a Field) where people type the date in the format
 * shown under it ("mm/dd/yyyy", or "dd/mm/aaaa" in Spanish). The hint is a Field description,
 * so screen readers read it with the field. A date that cannot be read sets an error that
 * FieldError shows and Base UI links with aria-describedby.
 *
 * The calendar is optional help: the "Choose date" button opens a Base UI Popover with a grid
 * that follows the WAI-ARIA date picker pattern (Base UI has no calendar, so the grid keyboard
 * is ours): arrows move by day and week, Home/End to the start/end of the week, Page Up/Down
 * by month (with Shift, by year), Enter or Space picks the day, Escape closes and focus goes
 * back to the button. Each day is named with its full date; today has aria-current="date";
 * the shown month is announced when it changes.
 *
 * For dates people know by heart (a birthday), the text field alone is easier: hide the
 * calendar with `calendar={false}`.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

/* -------------------------------------------------------------------------- */
/* Dates (local, no time zones)                                                */
/* -------------------------------------------------------------------------- */

interface Day {
  y: number;
  m: number; // 0-11
  d: number;
}

const pad = (n: number, width = 2) => String(n).padStart(width, "0");
const toIso = ({ y, m, d }: Day) => `${pad(y, 4)}-${pad(m + 1)}-${pad(d)}`;
const toDate = ({ y, m, d }: Day) => new Date(y, m, d);
const fromDate = (date: Date): Day => ({ y: date.getFullYear(), m: date.getMonth(), d: date.getDate() });
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const compare = (a: Day, b: Day) => toIso(a).localeCompare(toIso(b));
const sameDay = (a: Day | null, b: Day | null) => !!a && !!b && compare(a, b) === 0;

function isValid(day: Day) {
  return day.m >= 0 && day.m <= 11 && day.d >= 1 && day.d <= daysInMonth(day.y, day.m) && day.y >= 1000 && day.y <= 9999;
}

/** Reads "YYYY-MM-DD". */
export function parseIsoDate(value: string | undefined): Day | null {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const day = { y: Number(match[1]), m: Number(match[2]) - 1, d: Number(match[3]) };
  return isValid(day) ? day : null;
}

/** Reads a typed date in the given order ("mdy" or "dmy"), with any separator. */
export function parseTypedDate(text: string, order: "mdy" | "dmy"): Day | null {
  const parts = text.trim().split(/[^\d]+/).filter(Boolean);
  const [first, second, year] = parts;
  if (parts.length !== 3 || first === undefined || second === undefined || year?.length !== 4) return null;
  const [a, b, y] = [Number(first), Number(second), Number(year)];
  const day = order === "mdy" ? { y, m: a - 1, d: b } : { y, m: b - 1, d: a };
  return isValid(day) ? day : null;
}

function formatTyped(day: Day, order: "mdy" | "dmy") {
  return order === "mdy" ? `${pad(day.m + 1)}/${pad(day.d)}/${day.y}` : `${pad(day.d)}/${pad(day.m + 1)}/${day.y}`;
}

function addDays(day: Day, n: number): Day {
  return fromDate(new Date(day.y, day.m, day.d + n));
}

function addMonths(day: Day, n: number): Day {
  const first = new Date(day.y, day.m + n, 1);
  return { y: first.getFullYear(), m: first.getMonth(), d: Math.min(day.d, daysInMonth(first.getFullYear(), first.getMonth())) };
}

function clamp(day: Day, min: Day | null, max: Day | null) {
  if (min && compare(day, min) < 0) return min;
  if (max && compare(day, max) > 0) return max;
  return day;
}

/* -------------------------------------------------------------------------- */
/* Date picker                                                                 */
/* -------------------------------------------------------------------------- */

export interface DatePickerProps {
  /** The date as "YYYY-MM-DD", or "" when empty. */
  value?: string;
  defaultValue?: string;
  /** Called with "YYYY-MM-DD" (or "") when the date changes. */
  onValueChange?: (value: string) => void;
  /** Earliest and latest allowed dates, as "YYYY-MM-DD". */
  min?: string;
  max?: string;
  /** Name of the hidden input that sends "YYYY-MM-DD" with the form. */
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  /** Set to false for dates people type from memory, like a birthday. Default: true. */
  calendar?: boolean;
  /** For example "bday" for a date of birth (WCAG 1.3.5). */
  autoComplete?: string;
  className?: string;
}

/** A date field: type the date, or choose it in a calendar. Put it inside a Field with a FieldLabel. */
function DatePicker({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  min,
  max,
  name,
  id,
  required,
  disabled,
  calendar = true,
  autoComplete = "off",
  className,
}: DatePickerProps) {
  const messages = useAksoMessages();
  const field = useAksoField();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const selected = parseIsoDate(value);
  const [text, setText] = React.useState(() => (selected ? formatTyped(selected, messages.dateOrder) : ""));
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const minDay = parseIsoDate(min);
  const maxDay = parseIsoDate(max);

  // Keep the typed text in step when the value changes from outside (React's "adjust state
  // while rendering" pattern, instead of an effect).
  const [synced, setSynced] = React.useState({ value, order: messages.dateOrder });
  if (synced.value !== value || synced.order !== messages.dateOrder) {
    setSynced({ value, order: messages.dateOrder });
    const day = parseIsoDate(value);
    const typed = parseTypedDate(text, messages.dateOrder);
    if (day && !sameDay(typed, day)) setText(formatTyped(day, messages.dateOrder));
    else if (value === "" && typed) setText("");
  }

  const commit = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  // A date that cannot be read (or is out of range) is a custom error, shown by FieldError.
  const validate = (input: HTMLInputElement, raw: string) => {
    if (raw.trim() === "") return input.setCustomValidity("");
    const day = parseTypedDate(raw, messages.dateOrder);
    const inRange = day && (!minDay || compare(day, minDay) >= 0) && (!maxDay || compare(day, maxDay) <= 0);
    input.setCustomValidity(inRange ? "" : messages.invalidDate);
  };

  return (
    <div data-slot="date-picker" className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {/* Read with the field as its description (Base UI links it). */}
      <BaseField.Description data-slot="date-picker-format" className="text-sm text-akso-muted-foreground">
        {messages.dateFormatHint}
      </BaseField.Description>
      <div className="flex max-w-xs items-start gap-2">
        <BaseInput
          ref={inputRef}
          id={id}
          data-slot="date-picker-input"
          type="text"
          inputMode="numeric"
          autoComplete={autoComplete}
          required={required ?? field?.required}
          disabled={disabled}
          value={text}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setText(event.target.value);
            validate(event.target, event.target.value);
          }}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            const raw = event.target.value;
            const day = parseTypedDate(raw, messages.dateOrder);
            if (raw.trim() === "") commit("");
            else if (day) {
              setText(formatTyped(day, messages.dateOrder));
              commit(toIso(day));
            }
          }}
          className={inputClassName("min-w-0 flex-1 tabular-nums")}
        />
        {calendar ? (
          <BasePopover.Root open={open} onOpenChange={setOpen}>
            <BasePopover.Trigger
              data-slot="date-picker-trigger"
              disabled={disabled}
              aria-label={messages.chooseDate}
              className={buttonClassName({ variant: "secondary", size: "icon" })}
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            </BasePopover.Trigger>
            <Calendar
              messages={messages}
              selected={selected}
              min={minDay}
              max={maxDay}
              onSelect={(day) => {
                setText(formatTyped(day, messages.dateOrder));
                if (inputRef.current) inputRef.current.setCustomValidity("");
                commit(toIso(day));
                setOpen(false);
              }}
            />
          </BasePopover.Root>
        ) : null}
      </div>
      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Calendar                                                                    */
/* -------------------------------------------------------------------------- */

interface CalendarProps {
  messages: AksoMessages;
  selected: Day | null;
  min: Day | null;
  max: Day | null;
  onSelect: (day: Day) => void;
}

function Calendar({ messages, selected, min, max, onSelect }: CalendarProps) {
  const today = fromDate(new Date());
  const [focused, setFocused] = React.useState<Day>(() => clamp(selected ?? today, min, max));
  const focusedRef = React.useRef<HTMLButtonElement | null>(null);
  const shouldFocus = React.useRef(false);
  const headingId = React.useId();

  React.useEffect(() => {
    if (shouldFocus.current) focusedRef.current?.focus();
    shouldFocus.current = false;
  }, [focused]);

  const monthLabel = new Intl.DateTimeFormat(messages.dateLocale, { month: "long", year: "numeric" }).format(new Date(focused.y, focused.m, 1));
  const fullDate = new Intl.DateTimeFormat(messages.dateLocale, { dateStyle: "full" });
  const weekdayLong = new Intl.DateTimeFormat(messages.dateLocale, { weekday: "long" });
  const weekdayShort = new Intl.DateTimeFormat(messages.dateLocale, { weekday: "short" });

  // Weekday headers, starting on the locale's first day (2023-01-01 was a Sunday).
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, 1 + ((i + messages.weekStartsOn) % 7)));
  const offset = (new Date(focused.y, focused.m, 1).getDay() - messages.weekStartsOn + 7) % 7;
  const count = daysInMonth(focused.y, focused.m);
  const cells: (Day | null)[] = [...Array<null>(offset).fill(null), ...Array.from({ length: count }, (_, i) => ({ y: focused.y, m: focused.m, d: i + 1 }))];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const outOfRange = (day: Day) => (min && compare(day, min) < 0) || (max && compare(day, max) > 0);

  const move = (next: Day, focus = true) => {
    shouldFocus.current = focus;
    setFocused(clamp(next, min, max));
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const dow = (toDate(focused).getDay() - messages.weekStartsOn + 7) % 7;
    const moves: Record<string, () => Day> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -dow),
      End: () => addDays(focused, 6 - dow),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
    };
    const next = moves[event.key];
    if (!next) return;
    event.preventDefault();
    move(next());
  };

  const navButton = cn(buttonClassName({ variant: "ghost", size: "icon" }));

  return (
    <BasePopover.Portal>
      <BasePopover.Positioner data-slot="date-picker-positioner" className="z-50 outline-none" sideOffset={4} collisionPadding={16} align="start">
        <BasePopover.Popup
          data-slot="date-picker-calendar"
          aria-labelledby={headingId}
          initialFocus={focusedRef}
          className={cn(popupSurfaceClassName, "p-3")}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <button type="button" aria-label={messages.previousMonth} className={navButton} onClick={() => move(addMonths(focused, -1), false)}>
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 6-6 6 6 6" />
              </svg>
            </button>
            {/* Announced when the month changes. */}
            <h2 id={headingId} aria-live="polite" className="text-base font-semibold first-letter:uppercase">
              {monthLabel}
            </h2>
            <button type="button" aria-label={messages.nextMonth} className={navButton} onClick={() => move(addMonths(focused, 1), false)}>
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </div>
          {/* The WAI-ARIA date picker pattern uses <table role="grid">; the keyboard is handled below. */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
          <table role="grid" aria-labelledby={headingId} data-slot="date-picker-grid" className="border-collapse" onKeyDown={onKeyDown}>
            <thead>
              <tr>
                {weekdays.map((day) => (
                  <th key={day.getDay()} scope="col" abbr={weekdayLong.format(day)} className="size-9 text-center text-sm font-medium text-akso-muted-foreground sm:size-11">
                    {weekdayShort.format(day).slice(0, 2)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, w) => (
                <tr key={w}>
                  {week.map((day, i) =>
                    day ? (
                      <td key={i} role="gridcell" aria-selected={sameDay(day, selected)} className="p-0 text-center">
                        <button
                          ref={sameDay(day, focused) ? focusedRef : undefined}
                          type="button"
                          tabIndex={sameDay(day, focused) ? 0 : -1}
                          aria-label={fullDate.format(toDate(day))}
                          aria-current={sameDay(day, today) ? "date" : undefined}
                          aria-disabled={outOfRange(day) || undefined}
                          data-slot="date-picker-day"
                          onClick={() => (outOfRange(day) ? undefined : onSelect(day))}
                          onKeyDown={(event) => {
                            if ((event.key === "Enter" || event.key === " ") && !outOfRange(day)) {
                              event.preventDefault();
                              onSelect(day);
                            }
                          }}
                          onFocus={() => (sameDay(day, focused) ? undefined : setFocused(day))}
                          className={cn(
                            "inline-flex size-9 items-center justify-center rounded-md text-base tabular-nums text-akso-foreground hover:bg-akso-surface-hover sm:size-11",
                            "aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:bg-transparent",
                            // Today: underlined. Selected: filled and bold. Not color alone.
                            sameDay(day, today) && "underline decoration-2 underline-offset-4",
                            sameDay(day, selected) &&
                              "bg-akso-primary font-bold text-akso-primary-foreground hover:bg-akso-primary-hover forced-colors:forced-color-adjust-none forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
                            focusRingClassName,
                          )}
                        >
                          {day.d}
                        </button>
                      </td>
                    ) : (
                      <td key={i} role="gridcell" aria-hidden="true" />
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export { DatePicker };
