import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChefHat, Home, Grid3X3, Heart, User, LogOut, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/categories', label: 'Categories', icon: Grid3X3 },
    { path: '/search', label: 'Search', icon: Search },
  ];

  const protectedLinks = [
    { path: '/favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-warm p-2 rounded-xl shadow-warm">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              RecipeApp
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Button>
              </Link>
            ))}
            
            {isAuthenticated && protectedLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Hello, {user?.username}!
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-3 flex justify-center space-x-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={isActive(link.path) ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-1"
              >
                <link.icon className="h-4 w-4" />
                <span className="text-xs">{link.label}</span>
              </Button>
            </Link>
          ))}
          
          {isAuthenticated && protectedLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={isActive(link.path) ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-1"
              >
                <link.icon className="h-4 w-4" />
                <span className="text-xs">{link.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;