export class Resend {
  emails = {
    send: jest
      .fn()
      .mockResolvedValue({ data: { id: "email-id" }, error: null }),
  };

  constructor(_apiKey?: string) {}
}
