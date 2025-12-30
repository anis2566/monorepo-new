import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constant";
import {
    parseAsBoolean,
    parseAsInteger,
    parseAsString,
    useQueryStates,
} from "nuqs";

export const useGetMcqs = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        subjectId: parseAsString
            .withDefault("")
            .withOptions({ clearOnDefault: true }),
        chapterId: parseAsString
            .withDefault("")
            .withOptions({ clearOnDefault: true }),
        isMath: parseAsBoolean
            .withDefault(false)
            .withOptions({ clearOnDefault: true }),
        type: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger
            .withDefault(DEFAULT_PAGE)
            .withOptions({ clearOnDefault: true }),
        limit: parseAsInteger
            .withDefault(DEFAULT_PAGE_SIZE)
            .withOptions({ clearOnDefault: true }),
        sort: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    });
};