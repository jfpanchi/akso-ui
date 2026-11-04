import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

// The announcer is one live region shared by the whole page (lib/akso-form.ts).
// Remove it between tests so a message from one test cannot leak into the next.
beforeEach(() => document.getElementById("akso-announcer")?.remove());
afterEach(() => cleanup());
