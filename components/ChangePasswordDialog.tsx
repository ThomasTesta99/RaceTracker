"use client";

import { useState, type SubmitEvent } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { changeUserPassword } from "@/lib/auth-actions/auth-actions";
import { changePasswordSchema } from "@/lib/validations/password";
import { MIN_PASSWORD_LENGTH } from "@/constants";

interface ChangePasswordDialogProps {
  onSuccess: (message: string) => void;
}

const ChangePasswordDialog = ({ onSuccess }: ChangePasswordDialogProps) => {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    setError("");
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");

    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await changeUserPassword(parsed.data);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setOpen(false);
      resetForm();
      onSuccess("Your password has been changed successfully. Other sessions have been signed out.");
    } catch {
      setError("Unable to change your password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (isLoading) return;
      setOpen(value);
      if (!value) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer border-white/20 bg-white/10 font-medium text-white hover:bg-white/20 hover:text-white"
        >
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-neutral-950 text-white shadow-2xl sm:max-w-md [&>button]:cursor-pointer [&>button]:text-white/60">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-white/10">
            <KeyRound className="size-5 text-white/80" />
          </div>
          <DialogTitle className="text-xl font-semibold text-white">Change Password</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-white/60">
            Update your account password. Other active sessions will be signed out.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex cursor-pointer items-center gap-2 text-xs text-white/60 transition hover:text-white"
            >
              {showPasswords ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              {showPasswords ? "Hide Passwords" : "Show Passwords"}
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-white/80">Current Password</Label>
            <Input
              id="current-password"
              type={showPasswords ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-white/80">New Password</Label>
            <Input
              id="new-password"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-white/10"
            />
            <p className="text-xs text-white/50">At least {MIN_PASSWORD_LENGTH} characters.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-white/80">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-white/10"
            />
          </div>

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => setOpen(false)}
              className="cursor-pointer border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer bg-white font-semibold text-black hover:bg-white/90 disabled:cursor-not-allowed"
            >
              {isLoading ? <><Loader2 className="mr-2 size-4 animate-spin" />Updating...</> : "Update Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;