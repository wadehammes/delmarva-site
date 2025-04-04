export enum ActionTypes {
  Click = "click",
  CTAClick = "cta_clicked",
  StartProjectFormSubmitted = "submit_start_project_form",
  ZipCodeSubmitted = "zipcodeSubmitted",
}

export enum EventTypes {
  Click = "click",
  EnrollmentClick = "enrollmentClick",
  FormSubmit = "formSubmit",
}

interface SegmentEventProps {
  [key: string]: string | number | boolean;
  action: string | ActionTypes;
  category: string;
  label: string;
  value: string | boolean;
}

interface TrackEventProps {
  event: EventTypes;
  properties: SegmentEventProps;
  sendToSegment?: boolean;
}

export const trackEvent = ({ event, properties }: TrackEventProps) => {
  return window.dataLayer?.push({ event, ...properties });
};
