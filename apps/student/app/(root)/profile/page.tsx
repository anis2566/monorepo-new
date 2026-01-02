import { Metadata } from "next";
import { ProfileView } from "@/modules/profile/ui/views/profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile",
};

const Profile = () => {
  return <ProfileView />;
};

export default Profile;
