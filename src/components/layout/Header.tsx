
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart2, Calendar, Settings, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <BarChart2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">CalorieTracker</h1>
        </div>
        
        <nav className="flex items-center gap-4">
          {isMobile ? (
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-around p-2">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? "default" : "ghost"} 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                >
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/history">
                <Button 
                  variant={isActive('/history') ? "default" : "ghost"} 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/settings">
                <Button 
                  variant={isActive('/settings') ? "default" : "ghost"} 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/">
                <Button variant={isActive('/') ? "default" : "ghost"}>
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/history">
                <Button variant={isActive('/history') ? "default" : "ghost"}>
                  <Calendar className="h-4 w-4 mr-2" />
                  History
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant={isActive('/settings') ? "default" : "ghost"}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
