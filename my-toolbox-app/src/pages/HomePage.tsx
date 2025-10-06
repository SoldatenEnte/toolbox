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
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export const HomePage = () => {
    const { openMenu } = useOutletContext<LayoutContext>();

    return (
        <>
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
                <motion.div variants={itemVariants} className="mt-7">
                    <BlurryButton onClick={openMenu}>
                        Discover Tools
                    </BlurryButton>
                </motion.div>
            </motion.div>

            <motion.div
                className="fixed bottom-8 right-8 hidden lg:block z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
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