"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Stepper
 *
 * Shows where you are in a task split into steps, like checkout or sign-up. There is no Base UI
 * part for this. It follows the common "progress steps" pattern:
 * - A <nav> (named "Steps", or your `label`) with an ordered list, so screen readers say how
 *   many steps there are and can jump to the list.
 * - The current step has aria-current="step".
 * - Each step ends with a visually hidden text: "Step 2 of 4, completed" / ", current step".
 *   The state is also shown without color: a check mark for completed steps, a thick ring and
 *   bold text for the current one, the step number for the others.
 * - Completed steps with an `href` are links (44px tall), so people can go back.
 * - The list is a column on narrow screens and a row from 640px, so it never scrolls sideways.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface StepperStep {
  /** Short name of the step, like "Shipping". */
  label: string;
  /** Link to go back to this step. Only used for completed steps. */
  href?: string;
}

export interface StepperProps extends Omit<React.ComponentProps<"nav">, "children"> {
  steps: StepperStep[];
  /** Index of the current step, starting at 0. */
  current: number;
  /** Name of the navigation. Default: "Steps" (or the AksoLocaleProvider text). */
  label?: string;
  /** Use your router's link for completed steps. Default: <a>. */
  renderLink?: (props: { href: string; className: string; children: React.ReactNode }) => React.ReactElement;
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Where you are in a task split into steps. */
function Stepper({ steps, current, label, renderLink, className, ...props }: StepperProps) {
  const messages = useAksoMessages();
  const total = steps.length;

  return (
    <nav data-slot="stepper" aria-label={label ?? messages.steps} className={className} {...props}>
      <ol className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
        {steps.map((step, i) => {
          const status = i < current ? "complete" : i === current ? "current" : "upcoming";
          const content = (
            <>
              <span
                aria-hidden="true"
                data-slot="stepper-marker"
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  status === "complete" && "bg-akso-primary text-akso-primary-foreground forced-colors:border forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
                  status === "current" && "border-[3px] border-akso-primary text-akso-foreground",
                  status === "upcoming" && "border border-akso-border text-akso-muted-foreground",
                )}
              >
                {status === "complete" ? <CheckIcon /> : i + 1}
              </span>
              <span className={cn(status === "current" ? "font-semibold text-akso-foreground" : status === "upcoming" ? "text-akso-muted-foreground" : "text-akso-foreground")}>
                {step.label}
                <span className="sr-only">, {messages.stepStatus(i + 1, total, status)}</span>
              </span>
            </>
          );
          const rowClassName = "flex min-h-11 items-center gap-3";
          const linkClassName = cn(rowClassName, "rounded-md pr-2 underline-offset-2 hover:underline", focusRingClassName);
          return (
            <li key={`${i}-${step.label}`} data-slot="stepper-step" data-status={status} aria-current={status === "current" ? "step" : undefined}>
              {status === "complete" && step.href ? (
                renderLink ? (
                  renderLink({ href: step.href, className: linkClassName, children: content })
                ) : (
                  <a href={step.href} className={linkClassName}>
                    {content}
                  </a>
                )
              ) : (
                <span className={rowClassName}>{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Stepper };
