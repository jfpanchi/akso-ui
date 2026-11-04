"use client";

import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/registry/akso/ui/accordion";

/** Demo used by the docs page and by the e2e tests. */
export function AccordionDemo() {
  return (
    <Accordion>
      <AccordionItem value="ship">
        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
        <AccordionPanel>Between 3 and 5 working days. Express shipping takes 1 to 2 days.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="return">
        <AccordionTrigger>Can I return an item?</AccordionTrigger>
        <AccordionPanel>Yes, within 30 days. We pay the restocking fee.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="pay">
        <AccordionTrigger>Which payment methods do you accept?</AccordionTrigger>
        <AccordionPanel>Cards, bank transfer and cash on delivery.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
