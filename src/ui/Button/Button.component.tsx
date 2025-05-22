import { type Ref, forwardRef } from "react";
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
        style={style}
        data-tracking-click={dataTrackingClick}
      >
        {props.children}
      </button>
    );
  },
);
