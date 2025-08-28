import clsx from "clsx";
import { forwardRef, type Ref } from "react";
import {
  type AriaTextFieldProps,
  useObjectRef,
  useTextField,
} from "react-aria";
import styles from "src/ui/TextField/TextField.module.css";

interface TextFieldProps extends AriaTextFieldProps<HTMLTextAreaElement> {
  className?: string;
}

export const TextField = forwardRef(
  (props: TextFieldProps, ref: Ref<HTMLTextAreaElement>) => {
    const { label, className } = props;
    const inputRef = useObjectRef(ref);
    const { labelProps, inputProps } = useTextField(
      {
        ...props,
        inputElementType: "textarea",
      },
      inputRef,
    );

    return (
      <fieldset className={styles.fieldset}>
        <label {...labelProps} htmlFor={inputProps.name}>
          {label}
        </label>
        <textarea
          {...inputProps}
          className={clsx(className, styles.input)}
          data-1p-ignore
          ref={inputRef}
        />
      </fieldset>
    );
  },
);
