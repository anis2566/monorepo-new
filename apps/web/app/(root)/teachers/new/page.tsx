import { NewTeacherView } from "@/modules/teachers/ui/views/new-teacher-view";
import { HydrateClient } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Teacher",
    description: "Create a new Teacher",
};

const NewTeacher = () => {
    return (
        <HydrateClient>
            <NewTeacherView />
        </HydrateClient>
    );
};

export default NewTeacher;
