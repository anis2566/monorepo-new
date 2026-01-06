import { Metadata } from "next";
import { ProfileView } from "@/modules/profile/ui/views/profile-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and manage your profile",
};

const Profile = () => {
  // Prefetch profile data
  prefetch(trpc.student.profile.get.queryOptions());

  return (
    <HydrateClient>
      <ProfileView />
    </HydrateClient>
  );
};

export default Profile;
