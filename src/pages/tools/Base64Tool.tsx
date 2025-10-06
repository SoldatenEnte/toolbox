import { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft, Copy, Trash2, ShieldAlert, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import PixelBlast from '@/components/bits/PixelBlast';

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [textToCopy]);

    return (
        <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!textToCopy} aria-label="Copy to clipboard">
            <Copy className={cn("h-4 w-4 transition-transform", copied && "scale-0")} />
            <span className={cn("absolute transition-transform", !copied && "scale-0")}>✓</span>
        </Button>
    );
};

export const Base64Tool = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isDesktop, setIsDesktop] = useState(false);
    const [showBackground, setShowBackground] = useState(false);

    useEffect(() => {
        const bgTimer = setTimeout(() => {
            setShowBackground(true);
        }, 300);
        return () => clearTimeout(bgTimer);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        const handleMediaQueryChange = (e: MediaQueryListEvent) => {
            setIsDesktop(e.matches);
        };
        setIsDesktop(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleMediaQueryChange);
        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);

    const handleEncode = useCallback(() => {
        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            setOutput(encoded);
            setError(null);
        } catch (_e) {
            setError('Could not encode the input. Please ensure it is valid text.');
            setOutput('');
        }
    }, [input]);

    const handleDecode = useCallback(() => {
        try {
            if (!/^[A-Za-z0-9+/]*=?=?$/.test(input) || input.length % 4 !== 0) {
                throw new Error('Invalid Base64 string');
            }
            const decoded = decodeURIComponent(escape(atob(input)));
            setOutput(decoded);
            setError(null);
        } catch (_e) {
            setError('Invalid Base64 string. Please check the input for errors.');
            setOutput('');
        }
    }, [input]);

    const handleSwap = () => {
        setInput(output);
        setOutput(input);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setError(null);
    };

    return (
        <div className="relative h-full">
            {isDesktop && (
                <div
                    className="fixed inset-0 -z-10 transition-opacity duration-[2000ms] ease-in-out"
                    style={{ opacity: showBackground ? 1 : 0 }}
                >
                    <PixelBlast
                        variant="square"
                        pixelSize={5}
                        color="#a1a1aa"
                        patternScale={2.5}
                        patternDensity={0.8}
                        speed={0.4}
                        edgeFade={0.15}
                        transparent
                    />
                </div>
            )}
            <motion.div
                className="flex flex-col items-center justify-start h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
            >
                <Card className="bg-card/60 border-white/10 backdrop-blur-xl w-full max-w-4xl flex-grow flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <KeyRound className="h-6 w-6" />
                            Base64 Encoder / Decoder
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow gap-4">
                        <div className="flex flex-col flex-grow">
                            <Label htmlFor="input-textarea" className="mb-2">Input</Label>
                            <div className="relative flex-grow">
                                <Textarea
                                    id="input-textarea"
                                    placeholder="Enter plain text or Base64 here..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="resize-none h-full pr-12"
                                />
                                <div className="absolute top-2 right-2 z-10">
                                    <CopyButton textToCopy={input} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 flex-wrap my-2">
                            <Button onClick={handleEncode}>Encode</Button>
                            <Button onClick={handleDecode}>Decode</Button>
                            <Button variant="outline" size="icon" onClick={handleSwap} aria-label="Swap input and output">
                                <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={handleClear} aria-label="Clear fields">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex flex-col flex-grow">
                            <Label htmlFor="output-textarea" className="mb-2">Output</Label>
                            <div className="relative flex-grow">
                                <Textarea
                                    id="output-textarea"
                                    placeholder="Result will appear here..."
                                    value={output}
                                    readOnly
                                    className="resize-none h-full bg-muted/50 pr-12"
                                />
                                <div className="absolute top-2 right-2 z-10">
                                    <CopyButton textToCopy={output} />
                                </div>
                            </div>
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md mt-2">
                                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};