import { useState, useEffect } from 'react';

export const useFontLoader = (fontFamily: string) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        if (document.fonts.check(`1em ${fontFamily}`)) {
            setIsLoaded(true);
            return;
        }

        document.fonts.load(`1em ${fontFamily}`)
            .then(() => {
                if (!isCancelled) {
                    setIsLoaded(true);
                }
            })
            .catch((err) => {
                console.error(`Failed to load font: ${fontFamily}`, err);
            });

        return () => {
            isCancelled = true;
        };
    }, [fontFamily]);

    return isLoaded;
};