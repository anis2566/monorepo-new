import { NewProgramView } from "@/modules/programm/ui/views/new-programm-view";
import { HydrateClient } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Program",
  description: "Create a new Program",
};

const NewProgram = () => {
  return (
    <HydrateClient>
      <NewProgramView />
    </HydrateClient>
  );
};

export default NewProgram;
