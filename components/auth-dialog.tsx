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
import { User } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthDialog() {
  const { user, setUser, isAuthenticated } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would call an API
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: loginData.email,
    };
    setUser(mockUser);
    setIsOpen(false);
    setLoginData({ email: "", password: "" });

    // Redirect to profile page after successful login
    router.push("/profile");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Mock registration - in real app, this would call an API
    const mockUser = {
      id: "1",
      name: registerData.name,
      email: registerData.email,
    };
    setUser(mockUser);
    setIsOpen(false);
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });

    // Redirect to profile page after successful registration
    router.push("/profile");
  };

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

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
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
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
              >
                Login
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
              >
                Register
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
