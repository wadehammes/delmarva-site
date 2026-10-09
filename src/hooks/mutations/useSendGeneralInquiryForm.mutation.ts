import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useSendGeneralInquiryFormMutation = () => {
  return useMutation({
    mutationFn: api.generalInquiry,
  });
};
