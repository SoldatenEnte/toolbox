import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { tools } from '@/tools';
import Beams from './bits/Beams';
import { StaggeredMenu, StaggeredMenuItem, StaggeredMenuSocialItem } from './bits/StaggeredMenu';
import { ClickSpark } from './bits/ClickSpark';
import { Home } from 'lucide-react';

export type LayoutContext = {
    openMenu: () => void;
};

export const Layout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mousePosition.current = { x: event.clientX, y: event.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => setIsMenuOpen(false);

    const menuItems: StaggeredMenuItem[] = [
        {
            label: 'Home',
            ariaLabel: 'Go to Home page',
            link: '/',
        },
        ...tools.map(tool => ({
            label: tool.name,
            ariaLabel: `Go to ${tool.name}`,
            link: tool.path,
        })),
    ];

    const socialItems: StaggeredMenuSocialItem[] = [
        { label: 'GitHub', link: 'https://github.com' },
        { label: 'Twitter', link: 'https://twitter.com' },
    ];

    const logo = !isHomePage ? (
        <NavLink to="/" aria-label="Go to homepage" className="text-zinc-50 hover:text-white transition-colors">
            <Home className="h-7 w-7" />
        </NavLink>
    ) : null;

    return (
        <div className="h-screen font-sans antialiased relative">
            <ClickSpark>
                {isHomePage && (
                    <div className="absolute inset-0 -z-10">
                        <Beams
                            beamWidth={3}
                            beamHeight={30}
                            beamNumber={60}
                            speed={2}
                            noiseIntensity={1.75}
                            scale={0.2}
                            rotation={30}
                            lightIntensity={0.4}
                            envMapIntensity={3}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,black)] pointer-events-none" />
                    </div>
                )}

                <div className="relative z-10 h-full flex flex-col">
                    <StaggeredMenu
                        items={menuItems}
                        socialItems={socialItems}
                        displaySocials={true}
                        isFixed={true}
                        colors={['#18181b', '#27272a']} // zinc-900, zinc-800
                        accentColor="#FAFAFA" // zinc-50
                        openMenuButtonColor="#FAFAFA"
                        isOpen={isMenuOpen}
                        onToggle={toggleMenu}
                        onClose={closeMenu}
                        initialCursorPos={mousePosition.current}
                        logo={logo}
                    />

                    <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 overflow-y-auto">
                        <Outlet context={{ openMenu }} />
                    </main>
                </div>
            </ClickSpark>
        </div>
    );
};