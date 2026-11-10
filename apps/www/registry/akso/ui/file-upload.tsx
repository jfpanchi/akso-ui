"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { announce, useAnnouncerRegion } from "@/registry/akso/lib/akso-form";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { buttonClassName, focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · File upload
 *
 * Choose files with the browser's own file input, or drop them on the box. There is no Base UI
 * part for this.
 * - The file input is the native one (styled with `file:`), named by a visible <label>, so it
 *   works with every keyboard, screen reader, voice control and phone. Dropping files is only
 *   an extra; the button always works (WCAG 2.5.7: no dragging needed).
 * - Chosen files are listed with their size and a "Remove" button named after the file. After
 *   a removal, focus moves to the next file, or back to the input.
 * - Files that are too big or of the wrong type are not added. The reason is shown as text with
 *   an icon, linked to the input with aria-describedby, and announced. Added and removed files
 *   are announced too.
 * - The real input keeps the chosen files, so a normal form submit sends them.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface FileUploadProps extends Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange" | "size"> {
  /** Visible label. Required. */
  label: React.ReactNode;
  /** Help text under the label: allowed types and size. */
  description?: React.ReactNode;
  /** Largest file size in bytes. */
  maxSize?: number;
  /** Called with the current list of files. */
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

function matchesAccept(file: File, accept: string | undefined) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => (rule.startsWith(".") ? name.endsWith(rule) : rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule));
}

function formatSize(bytes: number, locale: string) {
  const units = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return new Intl.NumberFormat(locale, { style: "unit", unit: units[unit], unitDisplay: "short", maximumFractionDigits: unit === 0 ? 0 : 1 }).format(value);
}

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

/** Choose or drop files. The native file input stays the main way in. */
function FileUpload({
  label,
  description,
  maxSize,
  onFilesChange,
  multiple,
  accept,
  className,
  id: idProp,
  disabled,
  "aria-describedby": ariaDescribedBy,
  ...props
}: FileUploadProps) {
  const messages = useAksoMessages();
  const autoId = React.useId();
  const id = idProp ?? `${autoId}-input`;
  const descriptionId = `${autoId}-description`;
  const errorId = `${autoId}-error`;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [dragging, setDragging] = React.useState(false);
  useAnnouncerRegion();

  /** Keeps the real input in sync, so a form submit sends the chosen files. */
  const commit = (next: File[]) => {
    setFiles(next);
    onFilesChange?.(next);
    const input = inputRef.current;
    if (input && typeof DataTransfer !== "undefined") {
      const transfer = new DataTransfer();
      for (const file of next) transfer.items.add(file);
      input.files = transfer.files;
    }
  };

  const add = (incoming: File[]) => {
    const rejected: string[] = [];
    const accepted = incoming.filter((file) => {
      if (!matchesAccept(file, accept)) {
        rejected.push(messages.fileTypeNotAllowed(file.name));
        return false;
      }
      if (maxSize !== undefined && file.size > maxSize) {
        rejected.push(messages.fileTooBig(file.name, formatSize(maxSize, messages.dateLocale)));
        return false;
      }
      return true;
    });
    const merged = multiple ? [...files, ...accepted.filter((f) => !files.some((g) => fileKey(g) === fileKey(f)))] : accepted.slice(0, 1).length ? accepted.slice(0, 1) : files;
    commit(merged);
    setErrors(rejected);
    const parts = [accepted.length ? messages.filesAdded(multiple ? accepted.length : 1) : "", ...rejected].filter(Boolean);
    if (parts.length) announce(parts.join(" "));
  };

  const removeAt = (index: number) => {
    const file = files[index];
    if (!file) return;
    const next = files.filter((_, i) => i !== index);
    commit(next);
    announce(messages.fileRemoved(file.name));
    // Focus the next file's Remove button, the previous one, or the input.
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button");
      const target = buttons?.[Math.min(index, (buttons?.length ?? 1) - 1)];
      (target ?? inputRef.current)?.focus();
    });
  };

  const describedBy = [description ? descriptionId : null, errors.length ? errorId : null, ariaDescribedBy].filter(Boolean).join(" ") || undefined;

  return (
    <div data-slot="file-upload" className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="font-medium text-akso-foreground">
        {label}
      </label>
      {description ? (
        <p id={descriptionId} className="text-sm text-akso-muted-foreground">
          {description}
        </p>
      ) : null}
      {/* Only drag-and-drop events: a pointer extra. The native file input inside is the keyboard and screen reader way in. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        data-slot="file-upload-dropzone"
        data-dragging={dragging || undefined}
        onDragOver={(event) => {
          if (disabled) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          if (disabled) return;
          event.preventDefault();
          setDragging(false);
          add(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "flex flex-col items-start gap-2 rounded-md border-2 border-dashed border-akso-border bg-akso-surface p-4 sm:flex-row sm:items-center",
          "data-dragging:border-solid data-dragging:border-akso-primary data-dragging:bg-akso-surface-hover",
          errors.length > 0 && "border-akso-danger",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          data-slot="file-upload-input"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={errors.length > 0 || undefined}
          onChange={(event) => {
            const chosen = Array.from(event.currentTarget.files ?? []);
            // The browser replaced the list; add to what was there instead (or keep it if cancelled).
            if (chosen.length) add(chosen);
            else commit(files);
          }}
          className={cn(
            "w-full min-w-0 max-w-full rounded-md text-sm text-akso-muted-foreground sm:w-auto",
            "file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-md file:border file:border-solid file:border-akso-border file:bg-akso-surface file:px-4 file:text-base file:font-medium file:text-akso-foreground",
            "hover:file:bg-akso-surface-hover disabled:cursor-not-allowed disabled:opacity-60",
            focusRingClassName,
          )}
          {...props}
        />
        <span className="text-sm text-akso-muted-foreground">{messages.dropFilesHere}</span>
      </div>
      {errors.length > 0 ? (
        <div id={errorId} data-slot="file-upload-error" className="flex flex-col gap-1 text-sm font-medium text-akso-danger">
          {errors.map((error) => (
            <p key={error} className="flex items-start gap-1.5">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 7v6M12 17h.01" />
              </svg>
              <span>{error}</span>
            </p>
          ))}
        </div>
      ) : null}
      {files.length > 0 ? (
        <ul ref={listRef} aria-label={messages.selectedFiles} data-slot="file-upload-list" className="flex flex-col gap-2">
          {files.map((file, index) => (
            <li key={fileKey(file)} className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-akso-border px-3 py-1">
              <span className="min-w-0 [overflow-wrap:anywhere]">
                {file.name} <span className="text-sm text-akso-muted-foreground">({formatSize(file.size, messages.dateLocale)})</span>
              </span>
              <button type="button" aria-label={messages.removeFile(file.name)} onClick={() => removeAt(index)} className={buttonClassName({ variant: "ghost", className: "min-h-11 shrink-0 px-3" })}>
                {messages.remove}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { FileUpload };
