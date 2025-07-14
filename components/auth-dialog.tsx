"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/components/ui/toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthDialog() {
  const {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    clearError,
    initializeAuth,
  } = useAuthStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [mounted, setMounted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateLoginForm = (): boolean => {
    const errors: string[] = [];

    if (!loginData.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!loginData.password.trim()) {
      errors.push("Password is required");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors([]);

    if (!validateLoginForm()) {
      return;
    }

    const result = await login(loginData);

    if (result.success) {
      setIsOpen(false);
      setLoginData({ email: "", password: "" });
      toast.success("Welcome back! You have been successfully logged in.");
      router.push("/profile");
    }
  };

  const validateRegisterForm = (): boolean => {
    const errors: string[] = [];

    if (!registerData.name.trim()) {
      errors.push("Name is required");
    } else if (registerData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    if (!registerData.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!registerData.password.trim()) {
      errors.push("Password is required");
    } else if (registerData.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (registerData.password !== registerData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors([]);

    if (!validateRegisterForm()) {
      return;
    }

    const result = await register({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
    });

    if (result.success) {
      setIsOpen(false);
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      toast.success("Account created successfully! Welcome to ShareInfo.");
      router.push("/profile");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info("You have been logged out successfully.");
    router.push("/");
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" className="flex items-center space-x-2">
        <User className="w-5 h-5" />
        <span className="hidden md:inline">Login</span>
      </Button>
    );
  }

  if (isAuthenticated()) {
    return (
      <div className="flex items-center space-x-2">
        <User className="w-5 h-5" />
        <span className="hidden md:inline">Hello, {user?.name}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span className="hidden md:inline">Login</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        {/* Error Alert */}
        {(error || validationErrors.length > 0) && (
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription>
              {error && <div className="text-red-600">{error}</div>}
              {validationErrors.length > 0 && (
                <ul className="list-disc list-inside text-red-600 text-sm mt-1">
                  {validationErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" disabled={isLoading}>
              Login
            </TabsTrigger>
            <TabsTrigger value="register" disabled={isLoading}>
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
