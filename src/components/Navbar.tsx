import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bookmark, Compass, Home, Sparkles } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const { user, signOutUser } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary group-hover:animate-glow-pulse" />
              <div className="absolute inset-0 blur-xl bg-primary/20 group-hover:bg-primary/40 transition-all" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Nephra
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </form>

          <div className="flex items-center gap-1">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              >
                <Home className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
            <Link to="/explore">
              <Button
                variant="ghost"
                size="sm"
                className={isActive("/explore") ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              >
                <Compass className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Explore</span>
              </Button>
            </Link>
            <Link to="/bookmarks">
              <Button
                variant="ghost"
                size="sm"
                className={isActive("/bookmarks") ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              >
                <Bookmark className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Bookmarks</span>
              </Button>
            </Link>
            {/* Readlist removed */}
            {!user && (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={async () => {
                  await signOutUser();
                }}
              >
                Sign out
              </Button>
            )}
          </div>
        </div>

        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-border/50"
              />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};
