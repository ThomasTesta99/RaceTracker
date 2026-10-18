import { getUserSession } from "@/lib/auth-actions/auth-helpers";
import AccountSettings from "@/components/AccountSettings";

const SettingsPage = async () => {
  const session = await getUserSession();
  if(!session) {
    return (
      <div>
        <h2>Unauthorized</h2>
      </div>
    )
  }
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