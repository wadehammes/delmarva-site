import classNames from "classnames";
import type { InputHTMLAttributes } from "react";
import styles from "src/components/Input/Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error: boolean;
}

export const Input = (props: InputProps) => {
  const { error, ...rest } = props;

  return (
    <input
      className={classNames(styles.input, { [styles.error]: error })}
      {...rest}
    />
  );
};
