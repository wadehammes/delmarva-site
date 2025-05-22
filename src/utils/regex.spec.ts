import {
  EMAIL_VALIDATION_REGEX,
  PHONE_NUMBER_VALIDATION_REGEX,
} from "src/utils/regex";

describe("regex", () => {
  it("email regex", () => {
    const validEmail1 = "w@w.com";

    const invalidEmail1 = "w";
    const invalidEmail2 = "w.w";
    const invalidEmail3 = "aaa@.com";

    expect(EMAIL_VALIDATION_REGEX.test(validEmail1)).toBeTruthy();

    expect(EMAIL_VALIDATION_REGEX.test(invalidEmail1)).toBeFalsy();
    expect(EMAIL_VALIDATION_REGEX.test(invalidEmail2)).toBeFalsy();
    expect(EMAIL_VALIDATION_REGEX.test(invalidEmail3)).toBeFalsy();
  });

  it("phone number regex", () => {
    const validPhone1 = "540-555-5555";
    const validPhone2 = "+1 540-555-5555";
    const validPhone3 = "5405555555";
    const validPhone4 = "540.555.5555";
    const validPhone5 = "(123) 456-7890";
    const validPhone6 = "(540)5555555";

    const invalidPhone1 = "540-555-55555";
    const invalidPhone2 = "54055555555";
    const invalidPhone3 = "5400.555.55555";
    const invalidPhone4 = "+12 540-555-5555";
    const invalidPhone5 = "1540-555-5555";
    const invalidPhone6 = "1 540-555-5555";

    expect(PHONE_NUMBER_VALIDATION_REGEX.test(validPhone1)).toBeTruthy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(validPhone2)).toBeTruthy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(validPhone3)).toBeTruthy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(validPhone4)).toBeTruthy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(validPhone5)).toBeTruthy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(validPhone6)).toBeTruthy();

    expect(PHONE_NUMBER_VALIDATION_REGEX.test(invalidPhone1)).toBeFalsy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(invalidPhone2)).toBeFalsy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(invalidPhone3)).toBeFalsy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(invalidPhone4)).toBeFalsy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(invalidPhone5)).toBeFalsy();
    expect(PHONE_NUMBER_VALIDATION_REGEX.test(invalidPhone6)).toBeFalsy();
  });
});
