import { createClient } from "contentful";

interface InitOptions {
  preview?: boolean;
}

const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID as string;
const contentfulContentDeliveryToken = process.env
  .CONTENTFUL_CONTENT_DELIVERY_API_KEY as string;
const contentfulPreviewToken = process.env.CONTENTFUL_PREVIEW_API_KEY as string;

// This is the standard Contentful client. It fetches
// content that has been published.
const client = createClient({
  accessToken: contentfulContentDeliveryToken,
  space: contentfulSpaceId,
});

// This is a Contentful client that's been configured
// to fetch drafts and unpublished content.
const previewClient = createClient({
  accessToken: contentfulPreviewToken,
  host: "preview.contentful.com",
  space: contentfulSpaceId,
});

export const contentfulClient = ({ preview = false }: InitOptions) => {
  if (preview) {
    return previewClient;
  }

  return client;
};
