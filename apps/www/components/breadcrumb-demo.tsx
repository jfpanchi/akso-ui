import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/registry/akso/ui/breadcrumb";

/** Demo used by the docs page and by the e2e tests. */
export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#home">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#store">Store</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#phones">Phones</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage>Phone with a very long product name, model 2026</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
