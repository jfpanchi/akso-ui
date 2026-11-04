import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Registry install check</h1>
      <Button variant="primary" loading loadingText="Saving" className="mb-4">
        Save
      </Button>
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Installed from the registry</DialogTitle>
            <DialogDescription>This dialog was added with npx shadcn add.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <DialogClose variant="primary">OK</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Form className="mt-8 max-w-md">
        <Fieldset>
          <FieldsetLegend>Contact</FieldsetLegend>
          <Field name="name" required>
            <FieldLabel>Name</FieldLabel>
            <Input autoComplete="name" />
            <FieldError match="valueMissing">Enter your name.</FieldError>
          </Field>
        </Fieldset>
        <Field name="message" required>
          <FieldLabel>Message</FieldLabel>
          <Textarea />
          <FieldError match="valueMissing">Write a message.</FieldError>
        </Field>
        <Button type="submit" variant="primary">
          Send
        </Button>
      </Form>
    </main>
  );
}
