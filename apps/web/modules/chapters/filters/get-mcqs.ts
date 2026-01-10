import { parseAsString, createLoader } from "nuqs/server";

const filterParmas = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const getMcqs = createLoader(filterParmas);
