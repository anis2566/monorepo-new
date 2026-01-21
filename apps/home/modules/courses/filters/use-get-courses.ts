import { parseAsString, useQueryStates } from "nuqs";

export const useGetCourses = () => {
  return useQueryStates({
    type: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
