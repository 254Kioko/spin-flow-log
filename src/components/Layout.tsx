import { Outlet, Link, useLocation } from "react-router-dom";
import { Shirt, Truck, Search, LayoutDashboard, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CleanCare</h1>
                <p className="text-xs text-muted-foreground">Laundry Management</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  isActive("/")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Submit Order</span>
              </Link>
              <Link
                to="/track"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  isActive("/track")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </Link>
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  isActive("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="text-muted-foreground">
                      {userRole === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-accent transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-card animate-fade-in">
              <nav className="px-4 py-3 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-colors w-full ${
                    isActive("/")
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span>Submit Order</span>
                </Link>
                <Link
                  to="/track"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-colors w-full ${
                    isActive("/track")
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <Search className="w-5 h-5" />
                  <span>Track Order</span>
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-colors w-full ${
                    isActive("/admin")
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
                
                {/* Mobile User Actions */}
                <div className="border-t pt-3 mt-3">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground">
                        <User className="w-5 h-5" />
                        <span>Logged in as {userRole === 'admin' ? 'Admin' : 'User'}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={signOut}
                        className="w-full flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  ) : (
                    <Link 
                      to="/auth" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button className="w-full">
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 CleanCare Laundry Management System. Professional laundry services.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;