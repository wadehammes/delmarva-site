import classNames from "classnames";
import type { InputHTMLAttributes } from "react";
import styles from "src/components/Input/Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error: boolean;
}

export const Input = (props: InputProps) => {
  const { type, className, error, ...rest } = props;

  return (
    <input
      className={classNames(styles.input, { [styles.error]: error })}
      type={type}
      {...rest}
    />
  );
};
