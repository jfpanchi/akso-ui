"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowCheckbox,
  TableSelectAll,
  useTableSelection,
} from "@/registry/akso/ui/table";

const people = [
  { id: "p1", name: "Laura Torres", role: "Designer" },
  { id: "p2", name: "Mateo Ruiz", role: "Developer" },
  { id: "p3", name: "Ana Gómez", role: "Product manager" },
];

/** Row selection demo, used by the docs page and by the e2e tests. */
export function TableSelectionDemo() {
  const selection = useTableSelection(people.map((p) => p.id));
  const count = people.filter((p) => selection.isSelected(p.id)).length;

  return (
    <div className="flex flex-col gap-2">
      <Table>
        <TableCaption>Team members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14 p-0 text-center">
              <TableSelectAll selection={selection} />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person) => (
            <TableRow key={person.id} selected={selection.isSelected(person.id)}>
              <TableCell className="p-0 text-center">
                <TableRowCheckbox selection={selection} id={person.id} rowName={person.name} />
              </TableCell>
              <TableHead scope="row" className="align-middle">
                {person.name}
              </TableHead>
              <TableCell className="align-middle">{person.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-akso-muted-foreground" data-testid="selected-count">
        {count} of {people.length} selected
      </p>
    </div>
  );
}
