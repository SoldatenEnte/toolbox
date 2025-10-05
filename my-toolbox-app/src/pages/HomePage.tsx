import { useOutletContext } from 'react-router-dom';
import { LayoutContext } from '@/components/Layout';
import ShinyText from '@/components/bits/ShinyText';
import { BlurryButton } from '@/components/ui/blurry-button';

export const HomePage = () => {
    const { openMenu } = useOutletContext<LayoutContext>();

    return (
        <div className="container mx-auto h-full flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)]">
            <ShinyText
                text="Essential Online Tools"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
            />
            <p className="max-w-lg mx-auto mt-4 text-lg sm:text-xl text-muted-foreground">
                A collection of free and simple web utilities for everyday tasks, right in your browser.
            </p>
            <BlurryButton className="mt-8" onClick={openMenu}>
                Discover Tools
            </BlurryButton>
        </div>
    );
};