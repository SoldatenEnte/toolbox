import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import FuzzyText from '@/components/bits/FuzzyText';
import Silk from '@/components/bits/Silk';
import { useFontLoader } from '@/hooks/useFontLoader';

export const NotFoundPage = () => {
    const isChewyLoaded = useFontLoader('Chewy');
    const chewyControls = useAnimation();

    useEffect(() => {
        if (isChewyLoaded) {
            chewyControls.start({ opacity: 1, y: 0 });
        }
    }, [isChewyLoaded, chewyControls]);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
            <div className="fixed inset-0 -z-10">
                <Silk
                    speed={5}
                    scale={1}
                    color="#1b1b1bff"
                    noiseIntensity={1.2}
                    rotation={0.1}
                />
            </div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            >
                <FuzzyText
                    baseIntensity={0.2}
                    hoverIntensity={0.5}
                    enableHover={true}
                    fontSize="clamp(4rem, 12vw, 12rem)"
                    fontWeight="900"
                >
                    404
                </FuzzyText>
            </motion.div>
            <motion.div
                className="mt-3 ml-25 -rotate-6"
                initial={{ opacity: 0, y: 20 }}
                animate={chewyControls}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <FuzzyText
                    baseIntensity={0.15}
                    hoverIntensity={0.4}
                    enableHover={true}
                    fontSize="clamp(1rem, 3vw, 3rem)"
                    fontWeight="400"
                    fontFamily='"Chewy", cursive'
                >
                    not found
                </FuzzyText>
            </motion.div>
        </div>
    );
};