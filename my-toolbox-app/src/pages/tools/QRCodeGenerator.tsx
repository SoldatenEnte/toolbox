import { useState, useRef, useEffect, ChangeEvent, RefObject, FC } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Palette, Download, Image as ImageIcon, Trash2, Type, Link as LinkIcon, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import PixelBlast from '@/components/bits/PixelBlast';

type Level = 'L' | 'M' | 'Q' | 'H';

// --- Type Definitions for Component Props ---
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
    onDownload: (format: 'png' | 'jpeg') => void;
    className?: string;
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
}

// --- Custom Hook ---
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

// --- Sub-Components with Typed Props ---
const QrCodePreview: FC<QrCodePreviewProps> = ({ qrRef, options, size, onSizeChange, onDownload, className }) => (
    <Card className={cn("lg:col-span-2 flex flex-col items-center justify-start bg-black/20 border-white/10 backdrop-blur-lg p-6 sm:p-8 h-full", className)}>
        <div className="flex-grow w-full flex items-center justify-center min-h-0">
            <div ref={qrRef} className="p-4 bg-white shadow-lg rounded-lg transition-all w-full max-w-[400px] aspect-square">
                <QRCodeCanvas {...options} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
        <div className="w-full max-w-xs mt-8 flex-shrink-0">
            <Label className="block text-center text-sm font-medium text-foreground mb-3">Resolution: {size}px</Label>
            <Slider value={[size]} onValueChange={([val]) => onSizeChange(val)} min={64} max={1024} step={8} />
        </div>
        <div className="mt-6 flex items-center gap-4 flex-shrink-0">
            <Button onClick={() => onDownload('png')} disabled={!options.value}>
                <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
            <Button variant="secondary" onClick={() => onDownload('jpeg')} disabled={!options.value}>
                Download JPG
            </Button>
        </div>
    </Card>
);

const QrCodeControls: FC<QrCodeControlsProps> = ({ text, onTextChange, level, onLevelChange, fgColor, onFgColorChange, bgColor, onBgColorChange, onImageUpload, logoUrl, onLogoUrlChange, onRemoveLogo, finalLogoSrc, className }) => (
    <div className={cn("lg:col-span-1 space-y-6 flex flex-col h-full", className)}>
        <Card className="bg-card/60 border-white/10 backdrop-blur-xl flex flex-col flex-grow">
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
        </Card>

        <Card className="bg-card/60 border-white/10 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette size={18} /> Style</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="fgColor" className="mb-2 block">Foreground</Label>
                    <Input id="fgColor" type="color" value={fgColor} onChange={e => onFgColorChange(e.target.value)} className="p-1 h-12" />
                </div>
                <div>
                    <Label htmlFor="bgColor" className="mb-2 block">Background</Label>
                    <Input id="bgColor" type="color" value={bgColor} onChange={e => onBgColorChange(e.target.value)} className="p-1 h-12" />
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card/60 border-white/10 backdrop-blur-xl">
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
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
        </Card>
    </div>
);


// --- Main Component ---
export const QRCodeGenerator = () => {
    const [text, setText] = useState('https://reactbits.dev/');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [level, setLevel] = useState<Level>('M');
    const [logoImage, setLogoImage] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const debouncedText = useDebounce(text, 500);
    const debouncedLogoUrl = useDebounce(logoUrl, 500);
    const qrRef = useRef<HTMLDivElement>(null);
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
    const handleDownload = (format: 'png' | 'jpeg') => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `qrcode.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    const finalLogoSrc = logoImage || debouncedLogoUrl;
    const qrOptions: QrCodeOptions = {
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
        <div className="relative h-full flex flex-col">
            <div className="fixed inset-0 -z-10">
                <PixelBlast
                    variant="circle"
                    pixelSize={6}
                    color="#B19EEF"
                    patternScale={3}
                    patternDensity={1.2}
                    pixelSizeJitter={0.5}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.6}
                    edgeFade={0.25}
                    transparent
                />
            </div>

            <div className="flex-grow min-h-0 relative z-10">
                <div className="h-full flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:items-stretch pt-10">
                    <QrCodeControls
                        className="order-2 lg:order-1"
                        text={text} onTextChange={setText}
                        level={level} onLevelChange={(value) => setLevel(value as Level)}
                        fgColor={fgColor} onFgColorChange={setFgColor}
                        bgColor={bgColor} onBgColorChange={setBgColor}
                        onImageUpload={handleImageUpload}
                        logoUrl={logoUrl} onLogoUrlChange={handleLogoUrlChange}
                        onRemoveLogo={removeLogo}
                        finalLogoSrc={finalLogoSrc}
                    />
                    <QrCodePreview
                        className="order-1 lg:order-2"
                        qrRef={qrRef}
                        options={qrOptions}
                        size={size}
                        onSizeChange={setSize}
                        onDownload={handleDownload}
                    />
                </div>
            </div>
        </div>
    );
};