import * as React from 'react';
import { cn } from '@/lib/utils';

const BlurryButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const internalRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current!);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = internalRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        button.style.setProperty('--mouse-x', `${x}px`);
        button.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <button
            className={cn(
                // Base styles
                'relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 py-2 text-base font-medium text-foreground transition-colors overflow-hidden',

                // Glass effect
                'bg-black/20 backdrop-blur-sm',

                // Glassy border
                'border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',

                // Hover and focus states
                'hover:bg-black/30',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',

                // Disabled state
                'disabled:pointer-events-none disabled:opacity-50',

                // Pseudo-element for the mouse-reactive highlight
                "before:content-[''] before:absolute before:inset-0 before:rounded-full",
                'before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
                "before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.15)_0%,transparent_70%)]",

                className
            )}
            ref={internalRef}
            onMouseMove={handleMouseMove}
            {...props}
        >
            {children}
        </button>
    );
});
BlurryButton.displayName = 'BlurryButton';

export { BlurryButton };