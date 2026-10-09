import { type Ref, useImperativeHandle } from "react";

type MockReCAPTCHAHandle = {
  executeAsync: () => Promise<string>;
  reset: () => void;
};

const MockReCAPTCHA = ({ ref }: { ref?: Ref<MockReCAPTCHAHandle> }) => {
  useImperativeHandle(ref, () => ({
    executeAsync: jest.fn().mockResolvedValue("mock-captcha-token"),
    reset: jest.fn(),
  }));
  return null;
};

export default MockReCAPTCHA;
