import { useState, useRef, useEffect, ChangeEvent, RefObject, FC } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Palette, Download, Image as ImageIcon, Trash2, Type, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

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
    logoImage: string | null;
    logoUrl: string;
    onLogoUrlChange: (value: string) => void;
    onRemoveLogo: () => void;
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

const QrCodePreview: FC<QrCodePreviewProps> = ({ qrRef, options, size, onSizeChange, onDownload }) => (
    <Card className="lg:col-span-2 flex flex-col items-center justify-center bg-muted/40 p-6 sm:p-8 border-2 border-dashed">
        <div ref={qrRef} className="p-4 bg-white shadow-md rounded-lg transition-all" style={{ backgroundColor: options.bgColor }}>
            <QRCodeCanvas {...options} />
        </div>
        <div className="w-full max-w-xs mt-6">
            <Label className="block text-center text-sm font-medium text-foreground mb-3">Size: {size}px</Label>
            <Slider value={[size]} onValueChange={([val]) => onSizeChange(val)} min={64} max={1024} step={8} />
        </div>
        <div className="mt-8 flex items-center gap-4">
            <Button onClick={() => onDownload('png')} disabled={!options.value}>
                <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
            <Button variant="secondary" onClick={() => onDownload('jpeg')} disabled={!options.value}>
                Download JPG
            </Button>
        </div>
    </Card>
);

const QrCodeControls: FC<QrCodeControlsProps> = ({ text, onTextChange, level, onLevelChange, fgColor, onFgColorChange, bgColor, onBgColorChange, onImageUpload, logoImage, logoUrl, onLogoUrlChange, onRemoveLogo }) => (
    <div className="lg:col-span-1 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Type size={18} /> Content</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea value={text} onChange={e => onTextChange(e.target.value)} placeholder="Enter text or URL" className="h-28" />
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

        <Card>
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

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon size={18} /> Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="logoFile" className="mb-2 block text-sm">Upload File</Label>
                    <Input id="logoFile" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={onImageUpload} className="file:text-primary file:font-semibold" />
                </div>
                <div className="relative">
                    <Separator className="absolute top-1/2 -translate-y-1/2" />
                    <p className="text-xs text-muted-foreground bg-card px-2 relative z-10 w-min mx-auto">OR</p>
                </div>
                <div>
                    <Label htmlFor="logoUrl" className="mb-2 block text-sm">Paste Image URL</Label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="logoUrl" type="url" placeholder="https://example.com/logo.png" value={logoUrl} onChange={e => onLogoUrlChange(e.target.value)} className="pl-9" />
                    </div>
                </div>
                {(logoImage || logoUrl) && (
                    <Button variant="ghost" size="sm" className="mt-3 w-full text-destructive hover:text-destructive" onClick={onRemoveLogo}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Logo
                    </Button>
                )}
            </CardContent>
        </Card>
    </div>
);


// --- Main Component ---

export const QRCodeGenerator = () => {
    const [text, setText] = useState('Your text or URL goes here');
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
                setLogoUrl(''); // Prioritize file upload
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoUrlChange = (value: string) => {
        setLogoUrl(value);
        if (value) {
            setLogoImage(null); // Prioritize URL if user types in it
        }
    };

    const removeLogo = () => {
        setLogoImage(null);
        setLogoUrl('');
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
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
                QR Code Generator
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <QrCodeControls
                    text={text} onTextChange={setText}
                    level={level} onLevelChange={(value) => setLevel(value as Level)}
                    fgColor={fgColor} onFgColorChange={setFgColor}
                    bgColor={bgColor} onBgColorChange={setBgColor}
                    logoImage={logoImage} onImageUpload={handleImageUpload}
                    logoUrl={logoUrl} onLogoUrlChange={handleLogoUrlChange}
                    onRemoveLogo={removeLogo}
                />
                <QrCodePreview
                    qrRef={qrRef}
                    options={qrOptions}
                    size={size}
                    onSizeChange={setSize}
                    onDownload={handleDownload}
                />
            </div>
        </div>
    );
};