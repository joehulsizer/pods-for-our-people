"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, Mic, Upload, BookOpen, Users, Search, LogOut, Settings, User } from "lucide-react";
import { NotificationBell, NotificationPanel } from "./NotificationSystem";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: null },
    { href: "/podcasts", label: "Podcasts", icon: null },
    { href: "/live", label: "Live Stream", icon: null },
    { href: "/upload", label: "Upload Your Podcast", icon: Upload },
    { href: "/request", label: "Request a Podcast", icon: Mic },
    { href: "/resources", label: "Educational Resources", icon: BookOpen },
    { href: "/community", label: "Community", icon: Users },
  ];

  return (
    <>
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Mic className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground font-poppins">
                Pods for our People
              </h1>
              <p className="text-xs text-muted-foreground">Internal Podcasting Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="flex items-center space-x-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>

            {user && (
              <NotificationBell
                onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
                isOpen={isNotificationOpen}
              />
            )}

            {user ? (
              <>
                <Link href="/upload">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Upload className="h-4 w-4 mr-2" />
                    Create Podcast
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                        <AvatarFallback>
                          {user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        {user.user_metadata?.department && (
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.user_metadata.department}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="pt-2 border-t">
                <Link href="/upload">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Create Podcast
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      </nav>
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};

export default Navigation;
