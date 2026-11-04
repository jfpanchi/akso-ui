"use client";

import { useState } from "react";
import { Checkbox } from "@/registry/akso/ui/checkbox";

/** Demo used by the docs page and by the e2e tests. */
export function CheckboxDemo() {
  const [items, setItems] = useState({ milk: true, bread: false });
  const all = items.milk && items.bread;
  const some = items.milk !== items.bread;
  return (
    <div className="flex flex-col items-start gap-1">
      <Checkbox defaultChecked>Remember me on this device</Checkbox>
      <Checkbox
        checked={all}
        indeterminate={some}
        onCheckedChange={(checked) => setItems({ milk: checked, bread: checked })}
      >
        Select all items
      </Checkbox>
      <div className="flex flex-col pl-9">
        <Checkbox checked={items.milk} onCheckedChange={(milk) => setItems((s) => ({ ...s, milk }))}>
          Milk
        </Checkbox>
        <Checkbox checked={items.bread} onCheckedChange={(bread) => setItems((s) => ({ ...s, bread }))}>
          Bread
        </Checkbox>
      </div>
      <Checkbox disabled>Not available right now</Checkbox>
    </div>
  );
}
