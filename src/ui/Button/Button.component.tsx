import { forwardRef, type Ref } from "react";
import { type AriaButtonProps, useButton, useObjectRef } from "react-aria";

interface ButtonProps extends AriaButtonProps {
  "data-tracking-click": string;
  className?: string;
  style?: React.CSSProperties;
}

export const Button = forwardRef(
  (props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const {
      className,
      style,
      "data-tracking-click": dataTrackingClick,
    } = props;
    const buttonRef = useObjectRef(ref);
    const { buttonProps } = useButton(props, buttonRef);

    return (
      <button
        {...buttonProps}
        className={className}
        data-tracking-click={dataTrackingClick}
        style={style}
      >
        {props.children}
      </button>
    );
  },
);
