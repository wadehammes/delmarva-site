import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useSendGeneralInquiryFormMutation = () => {
  const mutation = useMutation({
    mutationFn: api.generalInquiry,
  });

  return mutation;
};
