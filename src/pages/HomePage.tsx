import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LayoutContext } from '@/components/Layout';
import ShinyText from '@/components/bits/ShinyText';
import { BlurryButton } from '@/components/ui/blurry-button';
import CircularText from '@/components/bits/CircularText';
import { motion } from 'motion/react';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.8,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            ease: [0.3, 1, 0.5, 1] as [number, number, number, number]
        }
    },
};

export const HomePage = () => {
    const { openMenu } = useOutletContext<LayoutContext>();
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoaded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div
                className="fixed inset-0 bg-black pointer-events-none transition-opacity duration-1000 ease-out z-40"
                style={{ opacity: pageLoaded ? 0 : 1 }}
            />

            <motion.div
                className="container mx-auto h-full flex flex-col items-center justify-center text-center flex-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <ShinyText
                        text="Essential Online Tools"
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
                    />
                </motion.div>
                <motion.p variants={itemVariants} className="max-w-lg mx-auto mt-4 text-lg sm:text-xl text-muted-foreground">
                    A collection of free and simple web utilities for everyday tasks, right in your browser.
                </motion.p>
                <BlurryButton
                    variants={itemVariants}
                    className="mt-7"
                    onClick={openMenu}
                >
                    Discover Tools
                </BlurryButton>
            </motion.div>

            <motion.div
                className="fixed bottom-8 right-8 hidden lg:block z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.0 }}
            >
                <CircularText
                    text="VISIT GITHUB * VISIT GITHUB * "
                    href="https://github.com/SoldatenEnte"
                    spinDuration={25}
                    onHover="speedUp"
                />
            </motion.div>
        </>
    );
};