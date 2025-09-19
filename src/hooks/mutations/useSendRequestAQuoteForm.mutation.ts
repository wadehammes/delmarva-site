import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useSendRequestAQuoteFormMutation = () => {
  const mutation = useMutation({
    mutationFn: api.requestAQuote,
  });

  return mutation;
};
