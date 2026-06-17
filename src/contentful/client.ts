import { type ContentfulClientApi, createClient } from "contentful";

interface InitOptions {
  preview?: boolean;
}

type ContentfulClient = ContentfulClientApi<undefined>;

let deliveryClient: ContentfulClient | undefined;
let previewClient: ContentfulClient | undefined;

function createDeliveryClient(): ContentfulClient {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY;

  if (!space || !accessToken) {
    throw new Error(
      "Missing CONTENTFUL_SPACE_ID or CONTENTFUL_CONTENT_DELIVERY_API_KEY",
    );
  }

  return createClient({
    accessToken,
    space,
  });
}

function createPreviewClient(): ContentfulClient {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_PREVIEW_API_KEY;

  if (!space || !accessToken) {
    throw new Error(
      "Missing CONTENTFUL_SPACE_ID or CONTENTFUL_PREVIEW_API_KEY",
    );
  }

  return createClient({
    accessToken,
    host: "preview.contentful.com",
    space,
  });
}

export const contentfulClient = ({ preview = false }: InitOptions = {}) => {
  if (preview) {
    if (!previewClient) {
      previewClient = createPreviewClient();
    }
    return previewClient;
  }

  if (!deliveryClient) {
    deliveryClient = createDeliveryClient();
  }
  return deliveryClient;
};
