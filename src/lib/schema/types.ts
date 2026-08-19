import type {
  AboutPage,
  Brand,
  BreadcrumbList,
  CollectionPage,
  ContactPage,
  ImageObject,
  ItemList,
  LocalBusiness,
  Service,
  Thing,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts";

export type SchemaObject<T extends Thing> = WithContext<T> &
  Record<string, unknown>;

export type PageEntityType =
  | "WebPage"
  | "AboutPage"
  | "ContactPage"
  | "CollectionPage";

export type SchemaGraphItem = Omit<
  | SchemaObject<LocalBusiness>
  | SchemaObject<WebSite>
  | SchemaObject<Brand>
  | SchemaObject<ImageObject>
  | SchemaObject<WebPage>
  | SchemaObject<AboutPage>
  | SchemaObject<ContactPage>
  | SchemaObject<CollectionPage>
  | SchemaObject<Service>
  | SchemaObject<ItemList>
  | SchemaObject<BreadcrumbList>,
  "@context"
>;

export interface SchemaGraphDocument {
  "@context": "https://schema.org";
  "@graph": SchemaGraphItem[];
}
