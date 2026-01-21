import { parseAsString, parseAsInteger, useQueryStates } from "nuqs";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constant";

export const useGetCourses = () => {
  return useQueryStates({
    type: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    isActive: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
    isPopular: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
    limit: parseAsInteger
      .withDefault(DEFAULT_PAGE_SIZE)
      .withOptions({ clearOnDefault: true }),
    sort: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
