import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Alert } from "@/registry/akso/ui/alert";
import { Button } from "@/registry/akso/ui/button";
import { Combobox } from "@/registry/akso/ui/combobox";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/registry/akso/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/registry/akso/ui/field";
import { Form } from "@/registry/akso/ui/form";
import { Input } from "@/registry/akso/ui/input";
import { Slider } from "@/registry/akso/ui/slider";

const es = (ui: React.ReactNode) => render(<AksoLocaleProvider locale="es">{ui}</AksoLocaleProvider>);

describe("AksoLocaleProvider", () => {
  it("without a provider, texts stay in English", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Loading");
  });

  it("Spanish: loading button, required text and alert status word", () => {
    es(
      <main>
        <Button loading>Guardar</Button>
        <Field required>
          <FieldLabel>Nombre</FieldLabel>
          <Input />
        </Field>
        <Alert status="warning" title="Tu sesión termina pronto" />
      </main>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Cargando");
    expect(screen.getByText("(obligatorio)")).toBeInTheDocument();
    expect(screen.getByText("Tu sesión termina pronto").closest("p")).toHaveTextContent("Atención: Tu sesión termina pronto");
  });

  it("Spanish: dialog close button", async () => {
    const user = userEvent.setup();
    es(
      <Dialog>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent>
          <DialogTitle>Título</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(await screen.findByRole("button", { name: "Cerrar" })).toBeInTheDocument();
  });

  it("Spanish: form announcement", async () => {
    const user = userEvent.setup();
    es(
      <Form>
        <Field name="a" required>
          <FieldLabel>A</FieldLabel>
          <Input />
          <FieldError match="valueMissing">Escribe algo.</FieldError>
        </Field>
        <Field name="b" required>
          <FieldLabel>B</FieldLabel>
          <Input />
        </Field>
        <button type="submit">Enviar</button>
      </Form>,
    );
    await user.click(screen.getByRole("button", { name: "Enviar" }));
    await waitFor(() => expect(document.getElementById("akso-announcer")).toHaveTextContent("Revisa 2 campos."));
  });

  it("Spanish: combobox and slider button names", () => {
    es(
      <>
        <Combobox label="País" items={[{ value: "ec", label: "Ecuador" }]} />
        <Slider label="Volumen" defaultValue={10} />
      </>,
    );
    expect(screen.getByRole("button", { name: "Mostrar opciones" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Aumentar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Disminuir" })).toBeInTheDocument();
  });

  it("a prop wins over the provider, and messages can be changed", () => {
    render(
      <AksoLocaleProvider locale="es" messages={{ loading: "Un momento" }}>
        <Button loading>A</Button>
        <Button loading loadingText="Enviando">
          B
        </Button>
      </AksoLocaleProvider>,
    );
    const [a, b] = screen.getAllByRole("button");
    expect(a).toHaveAccessibleName("Un momento");
    expect(b).toHaveAccessibleName("Enviando");
  });
});
