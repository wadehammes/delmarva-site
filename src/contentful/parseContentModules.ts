import type { Entry } from "contentful";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type {
  TypeContentModulesFields,
  TypeContentModulesSkeleton,
} from "src/contentful/types";

type ModuleType = ExtractSymbolType<
  NonNullable<TypeContentModulesFields["module"]>
>;

export interface ContentModule {
  id: string;
  module: ModuleType;
}

const _validateContentModuleCheck: ContentfulTypeCheck<
  ContentModule,
  TypeContentModulesFields,
  "id" | "module"
> = true;

export type ContentModuleEntry =
  | Entry<TypeContentModulesSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentModule(
  entry: ContentModuleEntry,
): ContentModule | null {
  if (!entry) {
    return null;
  }

  if (!("fields" in entry)) {
    return null;
  }

  return {
    id: entry.sys.id,
    module: entry.fields.module,
  };
}
