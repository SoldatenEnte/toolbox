import { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Trash2, ShieldAlert, Code, Pilcrow, TestTube2 } from 'lucide-react';
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

const sampleJson = {
    "id": "0001",
    "type": "donut",
    "name": "Cake",
    "ppu": 0.55,
    "batters": {
        "batter": [
            { "id": "1001", "type": "Regular" },
            { "id": "1002", "type": "Chocolate" },
            { "id": "1003", "type": "Blueberry" },
            { "id": "1004", "type": "Devil's Food" }
        ]
    },
    "topping": [
        { "id": "5001", "type": "None" },
        { "id": "5002", "type": "Glazed" },
        { "id": "5005", "type": "Sugar" }
    ]
};

export const JsonFormatterTool = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [indentation, setIndentation] = useState<string | number>(2);
    const [isDesktop, setIsDesktop] = useState(false);
    const [showBackground, setShowBackground] = useState(false);

    useEffect(() => {
        const bgTimer = setTimeout(() => setShowBackground(true), 300);
        return () => clearTimeout(bgTimer);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        const handleMediaQueryChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        setIsDesktop(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleMediaQueryChange);
        return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }, []);

    const handleIndentationChange = (value: string) => {
        if (value === 'tab') {
            setIndentation('\t');
        } else {
            setIndentation(parseInt(value, 10));
        }
    };

    const processJson = useCallback((action: 'format' | 'minify') => {
        if (!input.trim()) {
            setOutput('');
            setError(null);
            return;
        }
        try {
            const jsonObj = JSON.parse(input);
            const result = action === 'format' ? JSON.stringify(jsonObj, null, indentation) : JSON.stringify(jsonObj);
            setOutput(result);
            setError(null);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format.';
            setError(`Parsing Error: ${errorMessage}`);
            setOutput('');
        }
    }, [input, indentation]);

    const handleClear = () => {
        setInput('');
        setOutput('');
        setError(null);
    };

    const handleLoadSample = () => {
        const sampleString = JSON.stringify(sampleJson, null, 2);
        setInput(sampleString);
        setOutput('');
        setError(null);
    };

    return (
        <div className="relative h-full w-full flex flex-col items-center">
            {isDesktop && (
                <div
                    className="fixed inset-0 -z-10 transition-opacity duration-[2000ms] ease-in-out"
                    style={{ opacity: showBackground ? 1 : 0 }}
                >
                    <PixelBlast
                        variant="square"
                        pixelSize={7}
                        color="#4ade80"
                        patternScale={2}
                        patternDensity={1}
                        speed={0.3}
                        edgeFade={0.2}
                        transparent
                    />
                </div>
            )}
            <motion.div
                className="w-full max-w-7xl flex-grow flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
            >
                <Card className="bg-card/60 border-white/10 backdrop-blur-xl w-full flex-grow flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                            <Code className="h-6 w-6" />
                            JSON Formatter & Validator
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow gap-4">
                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex-grow flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
                            <div className="flex flex-col flex-grow lg:flex-grow-0 lg:order-1 min-h-[250px] lg:min-h-0">
                                <Label htmlFor="input-textarea" className="mb-2">Input JSON</Label>
                                <div className="relative flex-grow">
                                    <Textarea
                                        id="input-textarea"
                                        placeholder='{ "paste": "your JSON here" }'
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className={cn(
                                            "resize-none h-full pr-12 whitespace-pre-wrap font-mono text-sm [tab-size:4] overflow-y-auto",
                                            error && "border-destructive/50 ring-destructive/20 focus-visible:border-destructive"
                                        )}
                                    />
                                    <div className="absolute top-2 right-2 z-10">
                                        <CopyButton textToCopy={input} />
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex flex-col items-center justify-start gap-4 px-4 lg:order-2 pt-8">
                                <Button onClick={() => processJson('format')} className="w-full">Format</Button>
                                <Button onClick={() => processJson('minify')} className="w-full">Minify</Button>
                                <Select value={indentation === '\t' ? 'tab' : indentation.toString()} onValueChange={handleIndentationChange}>
                                    <SelectTrigger className="w-full">
                                        <Pilcrow className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Indentation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">2 Spaces</SelectItem>
                                        <SelectItem value="4">4 Spaces</SelectItem>
                                        <SelectItem value="tab">Tabs</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex w-full gap-2">
                                    <Button variant="outline" onClick={handleLoadSample} className="flex-grow">
                                        <TestTube2 className="h-4 w-4 mr-2" /> Sample
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={handleClear} aria-label="Clear fields" className="flex-shrink-0">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col flex-grow lg:flex-grow-0 lg:order-3 min-h-[250px] lg:min-h-0 mt-4 lg:mt-0">
                                <Label htmlFor="output-textarea" className="mb-2">Output</Label>
                                <div className="relative flex-grow">
                                    <Textarea
                                        id="output-textarea"
                                        placeholder="Formatted JSON will appear here..."
                                        value={output}
                                        readOnly
                                        className={cn(
                                            "resize-none h-full bg-muted/50 pr-12 whitespace-pre-wrap font-mono text-sm overflow-y-auto",
                                            `[tab-size:${indentation === '\t' ? 4 : indentation}]`
                                        )}
                                    />
                                    <div className="absolute top-2 right-2 z-10">
                                        <CopyButton textToCopy={output} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex lg:hidden items-center justify-center gap-2 flex-wrap mt-4">
                            <Button onClick={() => processJson('format')}>Format</Button>
                            <Button onClick={() => processJson('minify')}>Minify</Button>
                            <Select value={indentation === '\t' ? 'tab' : indentation.toString()} onValueChange={handleIndentationChange}>
                                <SelectTrigger>
                                    <Pilcrow className="h-4 w-4" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2 Spaces</SelectItem>
                                    <SelectItem value="4">4 Spaces</SelectItem>
                                    <SelectItem value="tab">Tabs</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={handleLoadSample} aria-label="Load Sample">
                                <TestTube2 className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={handleClear} aria-label="Clear fields">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};