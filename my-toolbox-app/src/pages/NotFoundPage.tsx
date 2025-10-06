import FuzzyText from '@/components/bits/FuzzyText';
import Silk from '@/components/bits/Silk';
import { useFontLoader } from '@/hooks/useFontLoader';
import { cn } from '@/lib/utils';

export const NotFoundPage = () => {
    const isChewyLoaded = useFontLoader('Chewy');

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
            <FuzzyText
                baseIntensity={0.2}
                hoverIntensity={0.5}
                enableHover={true}
                fontSize="clamp(4rem, 12vw, 12rem)"
                fontWeight="900"
            >
                404
            </FuzzyText>
            <div className={cn(
                "mt-3 ml-25 -rotate-6 transition-opacity duration-500",
                isChewyLoaded ? "opacity-100" : "opacity-0"
            )}>
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
            </div>
        </div>
    );
};