import { parseAsString, useQueryStates } from "nuqs";

export const useGetMcqs = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
