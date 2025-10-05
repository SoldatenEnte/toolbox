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
                    color="#27272a"
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
                "mt-5 ml-4 transition-opacity duration-500",
                isChewyLoaded ? "opacity-100" : "opacity-0"
            )}>
                <FuzzyText
                    baseIntensity={0.15}
                    hoverIntensity={0.4}
                    enableHover={true}
                    fontSize="clamp(2rem, 5vw, 5rem)"
                    fontWeight="400"
                    fontFamily='"Chewy", cursive'
                >
                    not found
                </FuzzyText>
            </div>
        </div>
    );
};