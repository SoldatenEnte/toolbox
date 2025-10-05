import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { tools } from '@/tools';
import type { Tool } from '@/tools';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <nav className="flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-6 border-b border-zinc-700/80 pb-4">
            Toolbox
        </h1>
        <ul className="space-y-2 flex-grow">
            {tools.map((tool: Tool) => (
                <li key={tool.path}>
                    <NavLink
                        to={tool.path}
                        onClick={onLinkClick}
                        className={({ isActive }: { isActive: boolean }) =>
                            `flex items-center gap-3 py-2.5 px-4 rounded-md transition-all duration-200 text-sm font-medium ${isActive
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'hover:bg-zinc-700/60 text-zinc-300'
                            }`
                        }
                    >
                        {tool.name}
                    </NavLink>
                </li>
            ))}
        </ul>
        <footer className="text-xs text-zinc-500 text-center mt-4">
            Version 2.0.0
        </footer>
    </nav>
);

export const Layout = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground antialiased relative">
            {/* Aurora Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full filter blur-3xl animate-blob"></div>
                <div className="absolute top-[10%] left-[50%] w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[5%] right-[5%] w-[300px] h-[300px] bg-teal-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="flex h-screen">
                {/* Desktop Sidebar with Glassmorphism */}
                <aside className="hidden lg:block w-64 flex-shrink-0 bg-black/30 text-card-foreground p-4 border-r border-white/10 backdrop-blur-xl">
                    <NavContent />
                </aside>

                <div className="flex flex-col flex-1 w-full min-w-0">
                    {/* Mobile Header with Glassmorphism */}
                    <header className="lg:hidden flex items-center justify-between p-4 bg-black/30 border-b border-white/10 sticky top-0 z-30 backdrop-blur-xl">
                        <h1 className="text-lg font-bold">Toolbox</h1>
                        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-zinc-900/80 text-card-foreground p-4 border-r-0 w-64 backdrop-blur-xl">
                                <NavContent onLinkClick={() => setMobileMenuOpen(false)} />
                            </SheetContent>
                        </Sheet>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};