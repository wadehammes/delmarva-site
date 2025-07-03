import { Accordion } from "./Accordion.component";

/**
 * Example usage of the Accordion component
 * Demonstrates different configurations and use cases
 */
export const AccordionExample = () => {
  return (
    <div>
      <Accordion headerElement="h1" title="H1 Header">
        <p>This accordion uses an h1 element for the header.</p>
      </Accordion>

      <Accordion headerElement="h2" title="H2 Header">
        <p>This accordion uses an h2 element for the header.</p>
      </Accordion>
    </div>
  );
};
