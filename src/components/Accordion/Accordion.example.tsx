import { Accordion } from "./Accordion.component";

/**
 * Example usage of the Accordion component
 * Demonstrates different configurations and use cases
 */
export const AccordionExample = () => {
  return (
    <div>
      <Accordion title="H1 Header" headerElement="h1">
        <p>This accordion uses an h1 element for the header.</p>
      </Accordion>

      <Accordion title="H2 Header" headerElement="h2">
        <p>This accordion uses an h2 element for the header.</p>
      </Accordion>
    </div>
  );
};
