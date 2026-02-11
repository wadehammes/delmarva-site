import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  isTypeContentModules,
  type TypeContentModulesFields,
  type TypeContentModulesWithoutUnresolvableLinksResponse,
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
  | TypeContentModulesWithoutUnresolvableLinksResponse
  | undefined;

export function parseContentModule(
  entry: ContentModuleEntry,
): ContentModule | null {
  if (!entry || !isTypeContentModules(entry)) {
    return null;
  }

  return {
    id: entry.sys.id,
    module: entry.fields.module,
  };
}
