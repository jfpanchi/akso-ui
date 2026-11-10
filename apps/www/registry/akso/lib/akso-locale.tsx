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
  /** Drawer with snap points: button to change its height. */
  showMore: string;
  showLess: string;
  /** Slider step buttons. */
  decrease: string;
  increase: string;
  /** Read after the name of a number field, instead of "edit text". */
  numberField: string;
  /** Name of the breadcrumb navigation landmark. */
  breadcrumb: string;
  /** Name of the pagination navigation landmark. */
  pagination: string;
  previousPage: string;
  nextPage: string;
  /** Accessible name of a page link, like "Page 3". */
  page: (n: number) => string;
  /** Announced after sorting a table, like "Sorted by Name, ascending". */
  sortedBy: (column: string, direction: "ascending" | "descending") => string;
  /** BCP 47 locale used to format dates, like "en-US". */
  dateLocale: string;
  /** Order of day, month and year when a date is typed. */
  dateOrder: "mdy" | "dmy";
  /** Visible hint for the date format, like "mm/dd/yyyy". */
  dateFormatHint: string;
  /** First day of the week in calendars: 0 = Sunday, 1 = Monday. */
  weekStartsOn: 0 | 1;
  /** Name of the button that opens the calendar. */
  chooseDate: string;
  previousMonth: string;
  nextMonth: string;
  /** Error when a typed date cannot be read. */
  invalidDate: string;
  /** Name of each code box after the first one (the first one uses the field label). */
  otpSlot: (n: number, total: number, kind: "digit" | "character") => string;
  /** Announced when a typed or pasted character is not allowed in the code. */
  otpRejected: (allowed: "numeric" | "alpha" | "alphanumeric") => string;
  /** Announced when content that was loading is ready. */
  loaded: string;
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
  showMore: "Show more",
  showLess: "Show less",
  decrease: "Decrease",
  increase: "Increase",
  numberField: "Number field",
  breadcrumb: "Breadcrumb",
  pagination: "Pagination",
  previousPage: "Previous",
  nextPage: "Next",
  page: (n) => `Page ${n}`,
  sortedBy: (column, direction) => `Sorted by ${column}, ${direction}`,
  dateLocale: "en-US",
  dateOrder: "mdy",
  dateFormatHint: "mm/dd/yyyy",
  weekStartsOn: 0,
  chooseDate: "Choose date",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  invalidDate: "Enter a real date, like 03/25/2026.",
  otpSlot: (n, total, kind) => `${kind === "digit" ? "Digit" : "Character"} ${n} of ${total}`,
  otpRejected: (allowed) =>
    allowed === "numeric" ? "Only numbers are allowed." : allowed === "alpha" ? "Only letters are allowed." : "Only letters and numbers are allowed.",
  loaded: "Loaded",
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
  showMore: "Mostrar más",
  showLess: "Mostrar menos",
  decrease: "Disminuir",
  increase: "Aumentar",
  numberField: "Campo numérico",
  breadcrumb: "Ruta de navegación",
  pagination: "Paginación",
  previousPage: "Anterior",
  nextPage: "Siguiente",
  page: (n) => `Página ${n}`,
  sortedBy: (column, direction) => `Ordenado por ${column}, ${direction === "ascending" ? "ascendente" : "descendente"}`,
  dateLocale: "es",
  dateOrder: "dmy",
  dateFormatHint: "dd/mm/aaaa",
  weekStartsOn: 1,
  chooseDate: "Elegir fecha",
  previousMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
  invalidDate: "Escribe una fecha real, como 25/03/2026.",
  otpSlot: (n, total, kind) => `${kind === "digit" ? "Dígito" : "Carácter"} ${n} de ${total}`,
  otpRejected: (allowed) =>
    allowed === "numeric" ? "Solo se permiten números." : allowed === "alpha" ? "Solo se permiten letras." : "Solo se permiten letras y números.",
  loaded: "Cargado",
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
