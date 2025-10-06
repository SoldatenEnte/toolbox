import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
        { label: 'GitHub', link: 'https://github.com/SoldatenEnte' },
        { label: 'Instagram', link: 'https://www.instagram.com/apos.tels/' },
    ];

    const logo = !isHomePage ? (
        <NavLink to="/" aria-label="Go to homepage" className="text-zinc-50 hover:text-white transition-all duration-200 ease-in-out hover:scale-110">
            <Home className="h-7 w-7" />
        </NavLink>
    ) : null;

    return (
        <div className="h-screen font-sans antialiased relative">
            <ClickSpark>
                {isHomePage && (
                    <motion.div
                        className="absolute inset-0 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, ease: 'linear' }}
                    >
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
                    </motion.div>
                )}

                <div className="relative z-10 h-full flex flex-col">
                    {/* Mobile top gradient for header contrast */}
                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background/80 via-background/50 to-transparent pointer-events-none z-30 lg:hidden" />

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

                    <main className="flex-1 flex flex-col overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 lg:pt-20 pt-20"
                            >
                                <Outlet context={{ openMenu }} />
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </ClickSpark>
        </div>
    );
};