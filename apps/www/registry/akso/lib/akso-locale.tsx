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
  /** Name of the list of steps in a Stepper. */
  steps: string;
  /** Hidden text after each step: "Step 2 of 4, completed". */
  stepStatus: (n: number, total: number, status: "complete" | "current" | "upcoming") => string;
  /** Name of the checkbox that selects every row of a table. */
  selectAllRows: string;
  /** Name of the checkbox that selects one row: "Select Laura Torres". */
  selectRow: (row: string) => string;
  /** Announced when the selection changes. */
  rowsSelected: (count: number) => string;
  /** Visible text of the button that shows or hides a password. */
  showPassword: string;
  hidePassword: string;
  /** Added after "Show" / "Hide" in the button name: "Show password". */
  passwordWord: string;
  /** Announced after the password is shown or hidden. */
  passwordShown: string;
  passwordHidden: string;
  /** Hint next to the file picker. */
  dropFilesHere: string;
  /** Name of the list of chosen files. */
  selectedFiles: string;
  /** Name of the button that removes one file: "Remove report.pdf". */
  removeFile: (name: string) => string;
  /** Visible text of that button. */
  remove: string;
  /** Announced after files are added or removed. */
  filesAdded: (count: number) => string;
  fileRemoved: (name: string) => string;
  /** Errors for files that are not accepted. */
  fileTooBig: (name: string, max: string) => string;
  fileTypeNotAllowed: (name: string) => string;
  /** Carousel texts. */
  carousel: string;
  slide: string;
  slideOf: (n: number, total: number) => string;
  previousSlide: string;
  nextSlide: string;
  goToSlide: (n: number) => string;
  startAutoplay: string;
  stopAutoplay: string;
  /** Hidden text after a link that opens in a new tab. */
  opensInNewTab: string;
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
  steps: "Steps",
  stepStatus: (n, total, status) => `Step ${n} of ${total}${status === "complete" ? ", completed" : status === "current" ? ", current step" : ""}`,
  selectAllRows: "Select all rows",
  selectRow: (row) => `Select ${row}`,
  rowsSelected: (count) => (count === 0 ? "No rows selected" : count === 1 ? "1 row selected" : `${count} rows selected`),
  showPassword: "Show",
  hidePassword: "Hide",
  passwordWord: "password",
  passwordShown: "Your password is shown",
  passwordHidden: "Your password is hidden",
  dropFilesHere: "or drop files here",
  selectedFiles: "Selected files",
  removeFile: (name) => `Remove ${name}`,
  remove: "Remove",
  filesAdded: (count) => (count === 1 ? "1 file added" : `${count} files added`),
  fileRemoved: (name) => `${name} removed`,
  fileTooBig: (name, max) => `${name} is too big. Choose a file smaller than ${max}.`,
  fileTypeNotAllowed: (name) => `${name} is not an allowed type of file.`,
  carousel: "carousel",
  slide: "slide",
  slideOf: (n, total) => `${n} of ${total}`,
  previousSlide: "Previous slide",
  nextSlide: "Next slide",
  goToSlide: (n) => `Slide ${n}`,
  startAutoplay: "Play",
  stopAutoplay: "Pause",
  opensInNewTab: "(opens in a new tab)",
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
  steps: "Pasos",
  stepStatus: (n, total, status) => `Paso ${n} de ${total}${status === "complete" ? ", completado" : status === "current" ? ", paso actual" : ""}`,
  selectAllRows: "Seleccionar todas las filas",
  selectRow: (row) => `Seleccionar ${row}`,
  rowsSelected: (count) => (count === 0 ? "Ninguna fila seleccionada" : count === 1 ? "1 fila seleccionada" : `${count} filas seleccionadas`),
  showPassword: "Mostrar",
  hidePassword: "Ocultar",
  passwordWord: "contraseña",
  passwordShown: "Tu contraseña se muestra",
  passwordHidden: "Tu contraseña está oculta",
  dropFilesHere: "o suelta los archivos aquí",
  selectedFiles: "Archivos elegidos",
  removeFile: (name) => `Quitar ${name}`,
  remove: "Quitar",
  filesAdded: (count) => (count === 1 ? "1 archivo añadido" : `${count} archivos añadidos`),
  fileRemoved: (name) => `${name} quitado`,
  fileTooBig: (name, max) => `${name} es demasiado grande. Elige un archivo de menos de ${max}.`,
  fileTypeNotAllowed: (name) => `${name} no es un tipo de archivo permitido.`,
  carousel: "carrusel",
  slide: "diapositiva",
  slideOf: (n, total) => `${n} de ${total}`,
  previousSlide: "Diapositiva anterior",
  nextSlide: "Diapositiva siguiente",
  goToSlide: (n) => `Diapositiva ${n}`,
  startAutoplay: "Reproducir",
  stopAutoplay: "Pausar",
  opensInNewTab: "(se abre en una pestaña nueva)",
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
