"use client";

import { Checkbox } from "@/registry/akso/ui/checkbox";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/registry/akso/ui/drawer";

/** Demo used by the docs page and by the e2e tests. */
export function DrawerDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Drawer>
        <DrawerTrigger>Show filters</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Narrow down the list of products.</DrawerDescription>
          <div className="flex flex-col">
            <Checkbox>In stock only</Checkbox>
            <Checkbox>Free shipping</Checkbox>
          </div>
          <DrawerClose variant="primary">Apply filters</DrawerClose>
        </DrawerContent>
      </Drawer>
      <Drawer side="bottom" snapPoints={[0.4, 1]}>
        <DrawerTrigger>Order summary</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Order summary</DrawerTitle>
          <DrawerDescription>3 items, total $40. Drag the sheet or use the button to see more.</DrawerDescription>
          <ul className="list-disc pl-6">
            <li>Notebook, $12</li>
            <li>Pens, $6</li>
            <li>Backpack, $22</li>
          </ul>
        </DrawerContent>
      </Drawer>
      <Drawer side="bottom">
        <DrawerTrigger>Share</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Share this page</DrawerTitle>
          <DrawerDescription>Copy the link or send it by email.</DrawerDescription>
          <DrawerClose>Copy link</DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
