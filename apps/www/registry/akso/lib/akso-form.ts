"use client";

import * as React from "react";

/*
 * Akso UI · form helpers
 *
 * Shared by Field, Input, Textarea and Form. Installed as lib/akso-form.ts, so
 * components can work together without importing each other's files.
 */

/* -------------------------------------------------------------------------- */
/* Field context                                                               */
/* -------------------------------------------------------------------------- */

export interface AksoFieldContextValue {
  /** Set on <Field required>. Input and Textarea use it as their default `required`, and FieldLabel shows it as text. */
  required: boolean;
  /** Text shown after the label of a required field. */
  requiredText: string;
}

export const AksoFieldContext = React.createContext<AksoFieldContextValue | null>(null);

export function useAksoField() {
  return React.useContext(AksoFieldContext);
}

/* -------------------------------------------------------------------------- */
/* Announcements                                                               */
/* -------------------------------------------------------------------------- */

const REGION_ID = "akso-announcer";

/**
 * One polite live region for the whole page, created once and kept in the DOM.
 * Screen readers often miss live regions that are added together with their content,
 * so the region exists before any message is written to it.
 */
function getRegion(doc: Document): HTMLElement {
  let region = doc.getElementById(REGION_ID);
  if (!region) {
    region = doc.createElement("div");
    region.id = REGION_ID;
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "true");
    region.setAttribute("data-slot", "announcer");
    Object.assign(region.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      margin: "-1px",
      padding: "0",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0",
    });
    doc.body.appendChild(region);
  }
  return region;
}

let pending: ReturnType<typeof setTimeout> | undefined;

/** Announces `message` politely. Clearing first makes repeated messages announced again. */
export function announce(message: string, doc: Document = document) {
  const region = getRegion(doc);
  clearTimeout(pending);
  region.textContent = "";
  pending = setTimeout(() => {
    region.textContent = message;
  }, 100);
}

/** Creates the region on mount, so it is in the DOM before the first message. */
export function useAnnouncerRegion() {
  React.useEffect(() => {
    getRegion(document);
  }, []);
}

/* -------------------------------------------------------------------------- */
/* Submit marker                                                               */
/* -------------------------------------------------------------------------- */

const SUBMITTED_AT = "aksoSubmittedAt";

/** Called by Form when it is submitted. */
export function markSubmitted(form: HTMLFormElement) {
  form.dataset[SUBMITTED_AT] = String(Date.now());
}

/**
 * True right after the form containing `element` was submitted. On submit, Base UI moves
 * focus to the first invalid field, and its error is read through aria-describedby, so
 * Field does not announce errors again at that moment.
 */
export function wasJustSubmitted(element: Element | null, withinMs = 1000) {
  const form = element?.closest("form");
  const at = Number(form?.dataset[SUBMITTED_AT] ?? 0);
  return Date.now() - at < withinMs;
}
