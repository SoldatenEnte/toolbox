import { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Palette, Download, Image as ImageIcon, Trash2, Settings } from 'lucide-react';

// Custom Debounce Hook for performance optimization
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

// A reusable UI component for control sections
const ControlSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white/50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
            {icon}{title}
        </h3>
        {children}
    </div>
);

export const QRCodeGenerator = () => {
    const [text, setText] = useState('https://github.com');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#0f172a'); // slate-900
    const [bgColor, setBgColor] = useState('#ffffff');
    const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
    const [logoImage, setLogoImage] = useState<string | null>(null);

    const debouncedText = useDebounce(text, 500);
    const qrRef = useRef<HTMLDivElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = (format: 'png' | 'jpeg') => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL(`image/${format}`);
            const link = document.createElement('a');
            link.download = `qrcode.${format}`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const qrOptions = {
        value: debouncedText,
        size: size,
        fgColor: fgColor,
        bgColor: bgColor,
        level: level,
        imageSettings: logoImage ? {
            src: logoImage,
            height: size * 0.2,
            width: size * 0.2,
            excavate: true,
        } : undefined,
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-0">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                    Advanced QR Code Generator
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <ControlSection title="Content & Settings" icon={<Settings size={16} />}>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 h-28 resize-none"
                                placeholder="Enter text or URL"
                            />
                            <label className="block text-xs font-medium text-slate-500 mt-3">
                                Error Correction Level
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                                    className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                                    <option value="L">Low (L)</option>
                                    <option value="M">Medium (M)</option>
                                    <option value="Q">Quartile (Q)</option>
                                    <option value="H">High (H)</option>
                                </select>
                            </label>
                        </ControlSection>

                        <ControlSection title="Colors" icon={<Palette size={16} />}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Foreground</label>
                                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 p-1 border border-slate-300 rounded-md cursor-pointer" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Background</label>
                                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 p-1 border border-slate-300 rounded-md cursor-pointer" />
                                </div>
                            </div>
                        </ControlSection>

                        <ControlSection title="Center Logo" icon={<ImageIcon size={16} />}>
                            <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleImageUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 w-full" />
                            {logoImage && (
                                <button onClick={() => setLogoImage(null)} className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-red-600 hover:text-red-800 font-semibold">
                                    <Trash2 size={14} /> Remove Logo
                                </button>
                            )}
                        </ControlSection>
                    </div>

                    {/* Preview & Download Column */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-50 p-8 rounded-xl border-2 border-dashed border-slate-200">
                        <div ref={qrRef} className="p-4 bg-white shadow-md rounded-lg" style={{ backgroundColor: bgColor }}>
                            <QRCodeCanvas {...qrOptions} />
                        </div>

                        <div className="mt-6 w-full max-w-xs">
                            <label className="block text-center text-sm font-medium text-slate-700 mb-2">Size: {size}px</label>
                            <input type="range" min="64" max="1024" step="8" value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                        </div>

                        <div className="mt-8 flex items-center gap-4">
                            <button onClick={() => handleDownload('png')} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md disabled:bg-slate-400" disabled={!debouncedText}>
                                <Download size={16} /> Download PNG
                            </button>
                            <button onClick={() => handleDownload('jpeg')} className="flex items-center gap-2 bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-slate-800 transition-all shadow-sm hover:shadow-md disabled:bg-slate-400" disabled={!debouncedText}>
                                <Download size={16} /> Download JPG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};