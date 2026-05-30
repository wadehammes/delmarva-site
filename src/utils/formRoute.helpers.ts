export const FORM_FALLBACK_NOTIFICATION_TO = "w@dehammes.com";

export const formRouteJsonError = (
  message: string,
  status: number,
  errorName: string,
  detail?: unknown,
) => {
  return Response.json(
    {
      detail: detail instanceof Error ? detail.message : detail,
      error: {
        message,
        name: errorName,
      },
    },
    { status },
  );
};
