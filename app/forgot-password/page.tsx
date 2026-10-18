import AuthPageShell from "@/components/Auth/AuthPageShell";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      icon={Mail}
      title="Forgot password?"
      description="Enter the email address associated with your account. We'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}