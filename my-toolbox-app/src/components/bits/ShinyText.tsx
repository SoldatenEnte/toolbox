import React from 'react';
import { cn } from '@/lib/utils';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={cn(
                'bg-clip-text text-transparent',
                !disabled && 'animate-shine',
                className
            )}
            style={{
                backgroundImage:
                    'linear-gradient(60deg, var(--color-muted-foreground) 10%, white 50%, var(--color-muted-foreground) 70%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                animationDuration,
            }}
        >
            {text}
        </div>
    );
};

export default ShinyText;