import { parseAsString, useQueryStates } from "nuqs";

export const useGetExams = () => {
  return useQueryStates({
    status: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
