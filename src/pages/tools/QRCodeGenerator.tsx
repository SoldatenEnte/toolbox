import { useState, useRef, useEffect, ChangeEvent, RefObject, FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Palette, Image as ImageIcon, Trash2, Type, Link, UploadCloud, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    ColorPicker,
    ColorPickerSelection,
    ColorPickerHue,
    ColorPickerAlpha,
    ColorPickerEyeDropper,
    ColorPickerOutput,
    ColorPickerFormat
} from '@/components/ui/color-picker';
import { cn } from '@/lib/utils';
import PixelBlast from '@/components/bits/PixelBlast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DownloadButton } from '@/components/ui/download-button';

type Level = 'L' | 'M' | 'Q' | 'H';

interface QrCodeOptions {
    value: string;
    size: number;
    fgColor: string;
    bgColor: string;
    level: Level;
    imageSettings?: {
        src: string;
        height: number;
        width: number;
        excavate: boolean;
    };
}
interface QrCodePreviewProps {
    qrRef: RefObject<HTMLDivElement | null>;
    options: QrCodeOptions;
    size: number;
    onSizeChange: (size: number) => void;
    onFormatSelect: (format: 'png' | 'jpeg' | 'svg') => void;
    isTooLong: boolean;
    className?: string;
    delay?: number;
}
interface QrCodeControlsProps {
    text: string;
    onTextChange: (value: string) => void;
    level: Level;
    onLevelChange: (value: string) => void;
    fgColor: string;
    onFgColorChange: (value: string) => void;
    bgColor: string;
    onBgColorChange: (value: string) => void;
    onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    logoUrl: string;
    onLogoUrlChange: (value: string) => void;
    onRemoveLogo: () => void;
    finalLogoSrc: string;
    className?: string;
    delay?: number;
}

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const useFadeIn = (delay: number = 0) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return isVisible;
};

const QrErrorFallback = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-destructive p-4 bg-destructive/10 rounded-lg">
        <AlertTriangle className="w-10 h-10 mb-3" />
        <p className="font-semibold">Data Too Long</p>
        <p className="text-sm text-destructive/80">
            The input data is too long to be encoded in a QR code with the current settings. Try shortening the text or lowering the error correction level.
        </p>
    </div>
);

const QrCodePreview: FC<QrCodePreviewProps> = ({ qrRef, options, size, onSizeChange, onFormatSelect, isTooLong, className, delay = 0 }) => {
    const isVisible = useFadeIn(delay);

    return (
        <Card
            style={{ opacity: 0, backgroundColor: 'transparent' }}
            className={cn(
                "flex flex-col items-center justify-start border-white/10 p-6 sm:p-8 h-full transition-all duration-1000 ease-out",
                isVisible
                    ? "!opacity-100 bg-black/20 backdrop-blur-lg translate-y-0"
                    : "!opacity-0 bg-transparent backdrop-blur-none translate-y-8",
                className
            )}
        >
            <div className="flex-grow w-full flex items-center justify-center min-h-0">
                <div ref={qrRef} className="p-4 bg-white shadow-lg rounded-lg transition-all w-full max-w-[400px] aspect-square">
                    {isTooLong ? (
                        <QrErrorFallback />
                    ) : (
                        <ErrorBoundary fallback={<QrErrorFallback />}>
                            <QRCodeSVG {...options} style={{ width: '100%', height: '100%' }} />
                        </ErrorBoundary>
                    )}
                </div>
            </div>
            <div className="w-full max-w-xs mt-8 flex-shrink-0">
                <Label className="block text-center text-sm font-medium text-foreground mb-3">Resolution: {size}px</Label>
                <Slider value={[size]} onValueChange={([val]) => onSizeChange(val)} min={64} max={2048} step={8} />
            </div>
            <div className="mt-6 flex items-center gap-2 sm:gap-4 flex-shrink-0 flex-wrap justify-center">
                <DownloadButton onDownload={onFormatSelect} disabled={!options.value || isTooLong} />
            </div>
        </Card>
    );
};

const ColorPickerInput: FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <Label className="mb-2 block">{label}</Label>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal gap-2">
                    <div className="w-5 h-5 rounded-sm border" style={{ backgroundColor: value }} />
                    <span className="flex-1 truncate">{value}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 border-none bg-card/80 backdrop-blur-xl shadow-2xl">
                <ColorPicker value={value} onChange={onChange} className="w-full">
                    <ColorPickerSelection className="h-40" />
                    <ColorPickerHue className="h-4" />
                    <ColorPickerAlpha className="h-4" />
                    <div className="flex items-center justify-between pt-2">
                        <ColorPickerEyeDropper />
                        <ColorPickerOutput />
                    </div>
                    <ColorPickerFormat />
                </ColorPicker>
            </PopoverContent>
        </Popover>
    </div>
);

const AnimatedCard: FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
    const isVisible = useFadeIn(delay);

    return (
        <Card
            style={{ opacity: 0, backgroundColor: 'transparent' }}
            className={cn(
                "border-white/10 transition-all duration-1000 ease-out",
                isVisible
                    ? "!opacity-100 bg-card/60 backdrop-blur-xl translate-y-0"
                    : "!opacity-0 bg-transparent backdrop-blur-none translate-y-8",
                className
            )}
        >
            {children}
        </Card>
    );
};

const QrCodeControls: FC<QrCodeControlsProps> = ({
    text,
    onTextChange,
    level,
    onLevelChange,
    fgColor,
    onFgColorChange,
    bgColor,
    onBgColorChange,
    onImageUpload,
    logoUrl,
    onLogoUrlChange,
    onRemoveLogo,
    finalLogoSrc,
    className,
    delay = 0
}) => (
    <div className={cn("space-y-6 flex flex-col h-full", className)}>
        <AnimatedCard delay={delay} className="flex flex-col flex-grow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Type size={18} /> Content</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col flex-grow'>
                <Textarea value={text} onChange={e => onTextChange(e.target.value)} placeholder="Enter text or URL" className="flex-grow min-h-28" />
                <Separator className="my-4" />
                <Label className="mb-2 block">Error Correction</Label>
                <Select value={level} onValueChange={onLevelChange}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="L">Low</SelectItem>
                        <SelectItem value="M">Medium</SelectItem>
                        <SelectItem value="Q">Quartile</SelectItem>
                        <SelectItem value="H">High</SelectItem>
                    </SelectContent>
                </Select>
            </CardContent>
        </AnimatedCard>

        <AnimatedCard delay={delay + 100}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette size={18} /> Style</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <ColorPickerInput label="Foreground" value={fgColor} onChange={onFgColorChange} />
                <ColorPickerInput label="Background" value={bgColor} onChange={onBgColorChange} />
            </CardContent>
        </AnimatedCard>

        <AnimatedCard delay={delay + 200}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon size={18} /> Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full">
                    <Label htmlFor="logoFile" className="cursor-pointer">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload an Image
                    </Label>
                </Button>
                <Input id="logoFile" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={onImageUpload} className="hidden" />

                <div className="relative flex justify-center">
                    <Separator className="absolute top-1/2 -translate-y-1/2 w-full" />
                    <span className="text-xs text-muted-foreground bg-card px-2 relative z-10">OR</span>
                </div>
                <div>
                    <Label htmlFor="logoUrl" className="mb-2 block text-sm">Paste Image URL</Label>
                    <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="logoUrl" type="url" placeholder="https://example.com/logo.png" value={logoUrl} onChange={e => onLogoUrlChange(e.target.value)} className="pl-9" />
                    </div>
                </div>

                {finalLogoSrc && (
                    <div className="pt-2 space-y-3">
                        <Separator />
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <img src={finalLogoSrc} alt="Logo Preview" className="h-12 w-12 rounded-md border object-contain p-1 flex-shrink-0" />
                                <p className="text-sm font-medium text-foreground truncate">Logo Preview</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive flex-shrink-0" onClick={onRemoveLogo}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </AnimatedCard>
    </div>
);

const QR_CAPACITY_MAP: Record<Level, number> = {
    L: 2953,
    M: 2331,
    Q: 1663,
    H: 1273,
};

export const QRCodeGenerator = () => {
    const [text, setText] = useState('https://ducklin.de/toolbox/');
    const [size, setSize] = useState(512);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [level, setLevel] = useState<Level>('M');
    const [logoImage, setLogoImage] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const debouncedText = useDebounce(text, 500);
    const debouncedLogoUrl = useDebounce(logoUrl, 500);
    const qrRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showBackground, setShowBackground] = useState(false);

    useEffect(() => {
        setPageLoaded(true);
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

    const isTooLong = debouncedText.length > QR_CAPACITY_MAP[level];

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoImage(reader.result as string);
                setLogoUrl('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoUrlChange = (value: string) => {
        setLogoUrl(value);
        if (value) {
            setLogoImage(null);
        }
    };

    const removeLogo = () => {
        setLogoImage(null);
        setLogoUrl('');
        const fileInput = document.getElementById('logoFile') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleDownloadRaster = (format: 'png' | 'jpeg') => {
        const svgElement = qrRef.current?.querySelector('svg');
        if (svgElement) {
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const userSize = options.size;
            canvas.width = userSize;
            canvas.height = userSize;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new window.Image();
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                ctx.save();
                if (format === 'jpeg' || (bgColor && bgColor !== '#ffffff00' && bgColor !== 'transparent')) {
                    ctx.fillStyle = bgColor || '#ffffff';
                    ctx.fillRect(0, 0, userSize, userSize);
                }
                ctx.drawImage(img, 0, 0, userSize, userSize);
                ctx.restore();
                URL.revokeObjectURL(url);

                const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
                const link = document.createElement('a');
                link.download = `qrcode.${format}`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            img.src = url;
        }
    };

    const handleDownloadSVG = () => {
        const svgElement = qrRef.current?.querySelector('svg');
        if (svgElement) {
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'qrcode.svg';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const handleFormatSelect = (format: 'png' | 'jpeg' | 'svg') => {
        if (format === 'svg') {
            handleDownloadSVG();
        } else {
            handleDownloadRaster(format);
        }
    };

    const finalLogoSrc = logoImage || debouncedLogoUrl;

    const options: QrCodeOptions = {
        value: debouncedText,
        size: size,
        fgColor: fgColor,
        bgColor: bgColor,
        level: level,
        imageSettings: finalLogoSrc ? {
            src: finalLogoSrc,
            height: size * 0.2,
            width: size * 0.2,
            excavate: true,
        } : undefined,
    };

    return (
        <div className="relative h-full w-full flex flex-col items-center">
            <div
                className="fixed inset-0 bg-black pointer-events-none transition-opacity duration-700 ease-out z-50"
                style={{ opacity: pageLoaded ? 0 : 1 }}
            />

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
            <div className="w-full max-w-7xl flex-grow">
                <div className="w-full flex flex-col lg:grid lg:grid-cols-3 gap-8 h-full">
                    <QrCodeControls
                        className="order-2 lg:order-1 lg:col-span-1"
                        text={text} onTextChange={setText}
                        level={level} onLevelChange={(value) => setLevel(value as Level)}
                        fgColor={fgColor} onFgColorChange={setFgColor}
                        bgColor={bgColor} onBgColorChange={setBgColor}
                        onImageUpload={handleImageUpload}
                        logoUrl={logoUrl} onLogoUrlChange={handleLogoUrlChange}
                        onRemoveLogo={removeLogo}
                        finalLogoSrc={finalLogoSrc}
                        delay={200}
                    />
                    <QrCodePreview
                        className="order-1 lg:order-2 lg:col-span-2"
                        qrRef={qrRef}
                        options={options}
                        size={size}
                        onSizeChange={setSize}
                        onFormatSelect={handleFormatSelect}
                        isTooLong={isTooLong}
                        delay={0}
                    />
                </div>
            </div>
        </div>
    );
};