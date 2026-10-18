"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { changeUserEmail } from "@/lib/auth-actions/auth-actions";

interface ChangeEmailDialogProps {
  currentEmail: string;
  disabled?: boolean;
  onSuccess: (message: string) => void;
}

const ChangeEmailDialog = ({ currentEmail, disabled, onSuccess }: ChangeEmailDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await changeUserEmail({ email });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setOpen(false);
      setEmail("");
      onSuccess("Check your current email to approve the change. You'll then receive a verification link at your new address.");
    } catch {
      setError("Unable to change your email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (isLoading) return;
      setOpen(value);
      if (!value) {
        setEmail("");
        setError("");
      }
    }}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="cursor-pointer border-white/20 bg-white/10 font-medium text-white hover:bg-white/20 hover:text-white disabled:cursor-not-allowed"
        >
          Change Email
        </Button>
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-neutral-950 text-white shadow-2xl sm:max-w-md [&>button]:cursor-pointer [&>button]:text-white/60">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-white/10">
            <Mail className="size-5 text-white/80" />
          </div>
          <DialogTitle className="text-xl font-semibold text-white">Change Email</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-white/60">
            Enter your new email address. You&apos;ll need to approve the change from your current inbox before verifying your new address.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-5">
          <div className="space-y-2">
            <Label className="text-white/80">Current Email</Label>
            <div className="break-all rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              {currentEmail}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-email" className="text-white/80">New Email</Label>
            <Input
              id="new-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? <><Loader2 className="mr-2 size-4 animate-spin" />Sending...</> : "Continue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;