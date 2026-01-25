import { Metadata } from "next";

import { SearchParams } from "nuqs";
import { getTeachers } from "@/modules/teachers/filters/get-teachers";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { TeachersView } from "@/modules/teachers/ui/views/teachers-view";

export const metadata: Metadata = {
    title: "Teachers",
    description: "Teachers",
};

interface Props {
    searchParams: Promise<SearchParams>;
}

const Teachers = async ({ searchParams }: Props) => {
    const params = await getTeachers(searchParams);

    prefetch(trpc.admin.teacher.getMany.queryOptions(params));

    return (
        <HydrateClient>
            <TeachersView />
        </HydrateClient>
    );
};

export default Teachers;
