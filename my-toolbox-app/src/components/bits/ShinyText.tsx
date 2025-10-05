import React from 'react';

interface ShinyTextProps {
    text: string;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, className = '' }) => {
    return (
        <p className={`text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text animate-shine ${className}`}
            style={{
                backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 60%, rgba(255, 255, 255, 0) 80%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
            }}
        >
            {text}
        </p>
    );
};

export default ShinyText;