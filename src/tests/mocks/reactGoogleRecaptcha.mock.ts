import React from "react";

const MockReCAPTCHA = React.forwardRef(
  (
    _props: unknown,
    ref: React.Ref<{ executeAsync: () => Promise<string>; reset: () => void }>,
  ) => {
    React.useImperativeHandle(ref, () => ({
      executeAsync: jest.fn().mockResolvedValue("mock-captcha-token"),
      reset: jest.fn(),
    }));
    return null;
  },
);

export default MockReCAPTCHA;
