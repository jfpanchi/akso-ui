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
    </main>
  );
}
