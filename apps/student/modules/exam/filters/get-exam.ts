import { parseAsString, createLoader } from "nuqs/server";

const filterParmas = {
  status: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const getExams = createLoader(filterParmas);
