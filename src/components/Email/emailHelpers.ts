export const hasPhone = (phone: string) =>
  phone && phone !== "No phone number provided.";

export const getPhoneDigits = (phone: string) => phone.replace(/\D/g, "");
