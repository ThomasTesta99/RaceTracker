import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth-actions/auth-helpers";
import AccountSettings from "@/components/AccountSettings";

const SettingsPage = async () => {
  const session = await getUserSession();
  if (!session?.user) redirect("/sign-in");

  return (
    <AccountSettings
      user={{
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
      }}
    />
  );
};

export default SettingsPage;