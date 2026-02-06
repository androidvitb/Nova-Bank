"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Eye, EyeOff, UserPlus, Mail, ShieldCheck, KeyRound } from "lucide-react";

function RegisterPage() {
  const { setIsLoggedIn } = useAuth() || {}; 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!setIsLoggedIn) {
      console.warn("Auth context is not available.");
    }
  }, [setIsLoggedIn]);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsOtpLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          type: 'send-otp',
          email 
        }),
      });

      if (response.ok) {
        setOtpSent(true);
        toast.success("OTP sent to your email!");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending OTP");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setIsSignupLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, otp }),
      });

      if (response.ok) {
        toast.success("Registration successful! Redirecting...");
        setIsLoggedIn(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        const errorData = await response.json();
        if (errorData.message === "Email already registered") {
          toast.error("Email already registered! Please log in.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred during signup. Please try again.");
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-4">
            <div className="flex justify-center mb-2">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Logo" width={32} height={32} />
                <span className="text-2xl font-bold text-primary tracking-tighter">NOVA</span>
              </Link>
            </div>
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Join Nova Bank today and manage your finances with ease.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={otpSent}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={otpSent}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {!otpSent ? (
                <Button 
                  className="w-full" 
                  onClick={handleSendOTP} 
                  disabled={isOtpLoading}
                >
                  {isOtpLoading ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Send OTP
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      placeholder="Enter the 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="text-center tracking-[0.5em] font-bold"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleSignup} 
                    disabled={isSignupLoading}
                  >
                    {isSignupLoading ? (
                      "Signing up..."
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Verify & Sign Up
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="link" 
                    className="w-full text-xs" 
                    onClick={() => setOtpSent(false)}
                  >
                    Change Email Address
                  </Button>
                </div>
              )}
            </div>

            <div className="text-center space-y-4">
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="#" className="underline hover:text-primary">Terms of Service</Link> and{" "}
                <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
              </p>
              <p className="text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="hidden lg:block">
          <div className="relative aspect-square">
            <Image
              src="/Signup.png"
              alt="Signup illustration"
              fill
              className="object-contain dark:opacity-80"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
