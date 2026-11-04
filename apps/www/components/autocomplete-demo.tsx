"use client";

import { Autocomplete } from "@/registry/akso/ui/autocomplete";
import { Button } from "@/registry/akso/ui/button";

const cities = ["Asunción", "Bogotá", "Buenos Aires", "Caracas", "Cuenca", "Guayaquil", "La Paz", "Lima", "Montevideo", "Quito", "Santiago"];

/** Demo used by the docs page and by the e2e tests. */
export function AutocompleteDemo() {
  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
      <Autocomplete label="City" items={cities} placeholder="Type any city" name="city" />
      <div>
        <Button type="submit" variant="primary">
          Search
        </Button>
      </div>
    </form>
  );
}
