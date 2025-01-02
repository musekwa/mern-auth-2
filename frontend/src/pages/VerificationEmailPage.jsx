import { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

const VerifyEmailPage = () => {
  const [value, setValue] = useState("");
  const { verifyEmail, isLoading, error } = useAuthStore();
  const { toast } = useToast();

  const handleVerifyEmail = async () => {
    try{
      await verifyEmail(value);
      toast({
        title: "Email verified successfully",
        description: "You can now login to your account",
      })
    }
    catch(error){
      console.log(error)
    }
  };

  return (
    <div className="space-y-2 flex flex-col max-w-md w-full mx-auto border border-gray-200 rounded-lg p-4 shadow-sm">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup className="mx-auto">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value === "" ? (
          <>Enter your verification email code.</>
        ) : (
          <>You entered: {value}</>
        )}
      </div>
      <Button onClick={handleVerifyEmail} disabled={isLoading}>
        Verify Email Now
      </Button>
    </div>
  )
}

export default VerifyEmailPage;
