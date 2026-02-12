'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BrainCircuit, 
  LayoutDashboard, 
  History, 
  PlusSquare, 
  ClipboardCheck, 
  Users, 
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useUser } from '@/firebase';

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/forging-room', icon: PlusSquare, label: 'Forging Room' },
    { href: '/dashboard/history', icon: History, label: 'History' },
    { href: '/dashboard/evaluations', icon: ClipboardCheck, label: 'Evaluations' },
    { href: '/dashboard/social-learn', icon: Users, label: 'Social Learn' },
    { href: '/dashboard/preferences', icon: Settings, label: 'Preferences' },
  ];
  
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'P';

  return (
    <aside className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="">StudySmart AI</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/36/36`} alt="User avatar" />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold">{user?.displayName || "Priyadharshini"}</p>
                        <p className="text-xs text-muted-foreground">MEDIUM LEVEL</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>
    </aside>
  );
}
