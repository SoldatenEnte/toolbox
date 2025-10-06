import { motion, MotionValue, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import React, { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

export type DockItemData = {
    id: string;
    icon: React.ReactNode;
    label: string;
    path: string;
};

export type DockProps = {
    items: DockItemData[];
    className?: string;
};

type DockItemProps = {
    children: React.ReactNode;
    path: string;
    mouseX: MotionValue<number>;
};

function DockItem({ children, path, mouseX }: DockItemProps) {
    const ref = useRef<HTMLAnchorElement>(null);
    const isHovered = useMotionValue(0);
    const distance = useTransform(mouseX, val => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });
    const width = useTransform(distance, [-100, 0, 100], [50, 100, 50]);
    const widthSync = useSpring(width, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.div onHoverStart={() => isHovered.set(1)} onHoverEnd={() => isHovered.set(0)} className="relative">
            <NavLink ref={ref} to={path} className="aspect-square w-14 bg-zinc-900/80 rounded-full flex items-center justify-center border-2 border-white/10"
                // FIX: Acknowledge the intentional use of `any` to satisfy the linter.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={{ width: widthSync as any }}>
                {Children.map(children, child => React.isValidElement(child) ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered }) : child)}
            </NavLink>
        </motion.div>
    );
}

function DockLabel({ children, isHovered }: { children: React.ReactNode, isHovered?: MotionValue<number> }) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        if (!isHovered) return;
        const unsubscribe = isHovered.on('change', latest => setIsVisible(latest === 1));
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-white border border-white/10"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DockIcon({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center justify-center text-white">{children}</div>;
}

export default function Dock({ items, className = '' }: DockProps) {
    const mouseX = useMotionValue(Infinity);
    return (
        <div onMouseMove={e => mouseX.set(e.pageX)} onMouseLeave={() => mouseX.set(Infinity)}
            className={`${className} flex h-16 items-end gap-4 rounded-2xl bg-black/30 px-4 pb-3 border border-white/10 backdrop-blur-lg`}
        >
            {items.map((item) => (
                <DockItem key={item.id} path={item.path} mouseX={mouseX}>
                    <DockIcon>{item.icon}</DockIcon>
                    <DockLabel>{item.label}</DockLabel>
                </DockItem>
            ))}
        </div>
    );
}