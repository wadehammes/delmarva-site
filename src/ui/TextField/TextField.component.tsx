import classnames from "classnames";
import { type Ref, forwardRef } from "react";
import {
  type AriaTextFieldProps,
  useObjectRef,
  useTextField,
} from "react-aria";
import styles from "src/ui/TextField/TextField.module.css";

interface TextFieldProps extends AriaTextFieldProps<HTMLInputElement> {
  className?: string;
}

export const TextField = forwardRef(
  (props: TextFieldProps, ref: Ref<HTMLInputElement>) => {
    const { label, className } = props;
    const inputRef = useObjectRef(ref);
    const { labelProps, inputProps } = useTextField(props, inputRef);

    return (
      <fieldset className={styles.fieldset}>
        <label {...labelProps} htmlFor={inputProps.name}>
          {label}
        </label>
        <input
          {...inputProps}
          className={classnames(className, styles.input)}
          ref={inputRef}
          data-1p-ignore
        />
      </fieldset>
    );
  },
);
