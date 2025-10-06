import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, MotionValue, Transition, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface CircularTextProps {
    text: string;
    href: string;
    spinDuration?: number;
    onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
    className?: string;
}

const getRotationTransition = (duration: number, from: number, loop: boolean = true) => ({
    from,
    to: from + 360,
    ease: 'linear' as const,
    duration,
    type: 'tween' as const,
    repeat: loop ? Infinity : 0
});

const getTransition = (duration: number, from: number) => ({
    rotate: getRotationTransition(duration, from),
    scale: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 300
    }
});

const CircularText: React.FC<CircularTextProps> = ({
    text,
    href,
    spinDuration = 20,
    onHover = 'speedUp',
    className = ''
}) => {
    const letters = Array.from(text);
    const controls = useAnimation();
    const rotation: MotionValue<number> = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    const ref = useRef<HTMLAnchorElement>(null);
    const magneticX = useMotionValue(0);
    const magneticY = useMotionValue(0);

    const springConfig = { damping: 40, stiffness: 300, mass: 1 };
    const springX = useSpring(magneticX, springConfig);
    const springY = useSpring(magneticY, springConfig);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = el.getBoundingClientRect();

            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;

            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const magneticRadius = 250;
            const maxPullStrength = 0.4;

            if (distance < magneticRadius) {
                const pullFactor = 1 - distance / magneticRadius;
                magneticX.set(deltaX * maxPullStrength * pullFactor);
                magneticY.set(deltaY * maxPullStrength * pullFactor);
            } else {
                magneticX.set(0);
                magneticY.set(0);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [magneticX, magneticY]);

    useEffect(() => {
        const start = rotation.get();
        controls.start({
            rotate: start + 360,
            scale: 1,
            transition: getTransition(spinDuration, start)
        });
    }, [spinDuration, text, onHover, controls, rotation]);

    const handleHoverStart = () => {
        setIsHovered(true);
        const start = rotation.get();

        if (!onHover) return;

        let transitionConfig: ReturnType<typeof getTransition> | Transition;
        let scaleVal = 1;

        switch (onHover) {
            case 'slowDown':
                transitionConfig = getTransition(spinDuration * 2, start);
                break;
            case 'speedUp':
                transitionConfig = getTransition(spinDuration / 4, start);
                break;
            case 'pause':
                controls.stop();
                return;
            case 'goBonkers':
                transitionConfig = getTransition(spinDuration / 20, start);
                scaleVal = 0.8;
                break;
            default:
                transitionConfig = getTransition(spinDuration, start);
        }

        controls.start({
            rotate: start + 360,
            scale: scaleVal,
            transition: transitionConfig
        });
    };

    const handleHoverEnd = () => {
        setIsHovered(false);
        const start = rotation.get();
        controls.start({
            rotate: start + 360,
            scale: 1,
            transition: getTransition(spinDuration, start)
        });
    };

    const innerCircleVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <motion.a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            style={{ x: springX, y: springY }}
        >
            <motion.div
                className={`m-0 mx-auto rounded-full w-[120px] h-[120px] relative font-black text-white text-center cursor-pointer origin-center flex items-center justify-center ${className}`}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
            >
                <motion.div
                    className="absolute w-[60%] h-[60%] bg-white rounded-full flex items-center justify-center"
                    variants={innerCircleVariants}
                    initial="hidden"
                    animate={isHovered ? "visible" : "hidden"}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                    <ArrowUpRight className="text-black h-8 w-8" />
                </motion.div>

                <motion.div
                    className="absolute w-full h-full"
                    style={{ rotate: rotation }}
                    animate={controls}
                >
                    {letters.map((letter, i) => {
                        const angle = (i / letters.length) * 360;
                        return (
                            <span
                                key={i}
                                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 origin-bottom text-sm"
                                style={{ transform: `rotate(${angle}deg)` }}
                            >
                                {letter}
                            </span>
                        );
                    })}
                </motion.div>
            </motion.div>
        </motion.a>
    );
};

export default CircularText;