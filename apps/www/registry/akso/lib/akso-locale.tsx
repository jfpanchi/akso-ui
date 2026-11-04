"use client";

import * as React from "react";

/*
 * Akso UI · default texts
 *
 * Every text that a component shows or announces by default (button names, status words,
 * messages) comes from here. Wrap your app in <AksoLocaleProvider locale="es"> to get them in
 * Spanish, or pass `messages` to change some of them. A prop on a component (for example
 * `closeLabel`) always wins over these defaults.
 *
 * Remember to also set the page language: <html lang="es">. Screen readers use it to pick
 * the right voice and pronunciation (WCAG 3.1.1).
 */

export type AksoStatus = "info" | "success" | "warning" | "error";

export interface AksoMessages {
  /** Name of "×" close buttons (Dialog, Drawer). */
  close: string;
  /** Name of the close button on toasts. */
  dismiss: string;
  /** Button text while loading. */
  loading: string;
  /** Text after the label of a required field. */
  required: string;
  /** Announced after a form submit with errors. */
  fieldsNeedAttention: (count: number) => string;
  /** Heading of the form error summary. */
  errorSummaryTitle: string;
  /** Hidden word read before alert and toast titles. */
  status: Record<AksoStatus, string>;
  /** Combobox and Autocomplete texts. */
  noResults: string;
  noSuggestions: string;
  results: (count: number) => string;
  suggestions: (count: number) => string;
  showOptions: string;
  clear: string;
  /** Textarea counter. */
  charactersLeft: (count: number) => string;
  /** Slider step buttons. */
  decrease: string;
  increase: string;
}

export const en: AksoMessages = {
  close: "Close",
  dismiss: "Dismiss",
  loading: "Loading",
  required: "(required)",
  fieldsNeedAttention: (n) => (n === 1 ? "1 field needs attention." : `${n} fields need attention.`),
  errorSummaryTitle: "There is a problem",
  status: { info: "Information", success: "Success", warning: "Warning", error: "Error" },
  noResults: "No results.",
  noSuggestions: "No suggestions.",
  results: (n) => (n === 1 ? "1 result" : `${n} results`),
  suggestions: (n) => (n === 1 ? "1 suggestion" : `${n} suggestions`),
  showOptions: "Show options",
  clear: "Clear",
  charactersLeft: (n) => (n === 1 ? "1 character left" : `${n} characters left`),
  decrease: "Decrease",
  increase: "Increase",
};

export const es: AksoMessages = {
  close: "Cerrar",
  dismiss: "Cerrar aviso",
  loading: "Cargando",
  required: "(obligatorio)",
  fieldsNeedAttention: (n) => (n === 1 ? "Revisa 1 campo." : `Revisa ${n} campos.`),
  errorSummaryTitle: "Hay un problema",
  status: { info: "Información", success: "Hecho", warning: "Atención", error: "Error" },
  noResults: "Sin resultados.",
  noSuggestions: "Sin sugerencias.",
  results: (n) => (n === 1 ? "1 resultado" : `${n} resultados`),
  suggestions: (n) => (n === 1 ? "1 sugerencia" : `${n} sugerencias`),
  showOptions: "Mostrar opciones",
  clear: "Borrar",
  charactersLeft: (n) => (n === 1 ? "Queda 1 carácter" : `Quedan ${n} caracteres`),
  decrease: "Disminuir",
  increase: "Aumentar",
};

export const locales = { en, es } as const;
export type AksoLocale = keyof typeof locales;

const AksoLocaleContext = React.createContext<AksoMessages>(en);

export interface AksoLocaleProviderProps {
  /** Built-in texts to use. Default: "en". */
  locale?: AksoLocale;
  /** Change some texts, or provide a whole new language. */
  messages?: Partial<AksoMessages>;
  children: React.ReactNode;
}

/** Sets the default texts of every Akso UI component inside it. */
export function AksoLocaleProvider({ locale = "en", messages, children }: AksoLocaleProviderProps) {
  const value = React.useMemo(() => ({ ...locales[locale], ...messages }), [locale, messages]);
  return <AksoLocaleContext.Provider value={value}>{children}</AksoLocaleContext.Provider>;
}

/** The default texts for the current language. */
export function useAksoMessages(): AksoMessages {
  return React.useContext(AksoLocaleContext);
}
