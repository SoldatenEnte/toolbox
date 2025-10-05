'use client';

import Color from 'color';
import { PipetteIcon } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import {
    type ComponentProps,
    createContext,
    type HTMLAttributes,
    memo,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Use InstanceType to get the type of a Color instance
type ColorInstance = InstanceType<typeof Color>;

interface ColorPickerContextValue {
    color: ColorInstance;
    mode: string;
    setColor: (color: ColorInstance) => void;
    setMode: (mode: string) => void;
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
    undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useColorPicker = () => {
    const context = useContext(ColorPickerContext);
    if (!context) {
        throw new Error('useColorPicker must be used within a ColorPickerProvider');
    }
    return context;
};

// Omit conflicting `onChange` from HTMLAttributes and define our own
export type ColorPickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
};

export const ColorPicker = ({
    value,
    defaultValue = '#000000',
    onChange,
    className,
    ...props
}: ColorPickerProps) => {
    const [colorState, setColorState] = useState(() => Color(value ?? defaultValue));
    const [mode, setMode] = useState('hex');

    useEffect(() => {
        if (value) {
            try {
                setColorState(Color(value));
            } catch {
                // ignore invalid color
            }
        }
    }, [value]);

    const setColor = (newColor: ColorInstance) => {
        setColorState(newColor);
        if (onChange) {
            onChange(newColor.hexa());
        }
    };

    return (
        <ColorPickerContext.Provider
            value={{
                color: colorState,
                mode,
                setColor,
                setMode,
            }}
        >
            <div
                className={cn('flex size-full flex-col gap-4', className)}
                {...props}
            />
        </ColorPickerContext.Provider>
    );
};

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = memo(
    ({ className, ...props }: ColorPickerSelectionProps) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const [isDragging, setIsDragging] = useState(false);
        const { color, setColor } = useColorPicker();
        const { h, s, v } = color.hsv().object();

        const handlePointerMove = useCallback(
            (event: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
                const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));

                const newSaturation = (x / rect.width) * 100;
                const newValue = 100 - (y / rect.height) * 100;

                setColor(Color({ h, s: newSaturation, v: newValue }));
            },
            [h, setColor]
        );

        useEffect(() => {
            const handlePointerUp = () => setIsDragging(false);
            if (isDragging) {
                document.addEventListener('pointermove', handlePointerMove);
                document.addEventListener('pointerup', handlePointerUp);
            }
            return () => {
                document.removeEventListener('pointermove', handlePointerMove);
                document.removeEventListener('pointerup', handlePointerUp);
            };
        }, [isDragging, handlePointerMove]);

        return (
            <div
                className={cn('relative size-full cursor-crosshair rounded', className)}
                onPointerDown={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                    handlePointerMove(e.nativeEvent);
                }}
                ref={containerRef}
                style={{
                    backgroundColor: `hsl(${h}, 100%, 50%)`,
                }}
                {...props}
            >
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, transparent)`
                    }}
                >
                    <div
                        className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
                        style={{
                            left: `${s}%`,
                            top: `${100 - v}%`,
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
                            backgroundColor: color.hex()
                        }}
                    />
                </div>
            </div>
        );
    }
);

ColorPickerSelection.displayName = 'ColorPickerSelection';

export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerHue = ({
    className,
    ...props
}: ColorPickerHueProps) => {
    const { color, setColor } = useColorPicker();
    const { h } = color.hsl().object();

    return (
        <Slider.Root
            className={cn('relative flex h-4 w-full touch-none items-center', className)}
            max={360}
            onValueChange={([hue]) => setColor(color.hue(hue))}
            step={1}
            value={[h]}
            {...props}
        >
            <Slider.Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]" />
            <Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </Slider.Root>
    );
};

export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerAlpha = ({
    className,
    ...props
}: ColorPickerAlphaProps) => {
    const { color, setColor } = useColorPicker();
    const { r, g, b } = color.rgb().object();
    const a = color.alpha();

    return (
        <Slider.Root
            className={cn('relative flex h-4 w-full items-center touch-none', className)}
            max={1}
            onValueChange={([alpha]) => setColor(color.alpha(alpha))}
            step={0.01}
            value={[a]}
            {...props}
        >
            <Slider.Track
                className="relative my-0.5 h-3 w-full grow rounded-full"
                style={{
                    background:
                        'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center',
                }}
            >
                <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(to right, transparent, rgb(${r}, ${g}, ${b}))` }} />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </Slider.Root>
    );
};

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;

export const ColorPickerEyeDropper = ({
    className,
    ...props
}: ColorPickerEyeDropperProps) => {
    const { setColor } = useColorPicker();

    const handleEyeDropper = async () => {
        try {
            // @ts-expect-error - EyeDropper API is experimental
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            setColor(Color(result.sRGBHex));
        } catch (error) {
            console.error('EyeDropper failed:', error);
        }
    };

    return (
        <Button
            className={cn('shrink-0 text-muted-foreground', className)}
            onClick={handleEyeDropper}
            size="icon"
            variant="outline"
            type="button"
            {...props}
        >
            <PipetteIcon size={16} />
        </Button>
    );
};

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;

const formats = ['hex', 'rgb', 'hsl'];

export const ColorPickerOutput = ({
    className,
    ...props
}: ColorPickerOutputProps) => {
    const { mode, setMode } = useColorPicker();

    return (
        <Select onValueChange={setMode} value={mode}>
            <SelectTrigger className={cn("h-8 w-20 shrink-0 text-xs", className)} {...props}>
                <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
                {formats.map((format) => (
                    <SelectItem className="text-xs" key={format} value={format}>
                        {format.toUpperCase()}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export type ColorPickerFormatProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>;

export const ColorPickerFormat = ({
    className,
    ...props
}: ColorPickerFormatProps) => {
    const { color, mode, setColor } = useColorPicker();
    const [inputValue, setInputValue] = useState(color.hex());

    const formatValue = useCallback(() => {
        switch (mode) {
            case 'hex':
                return color.hexa();
            case 'rgb':
                return color.rgb().string();
            case 'hsl':
                return color.hsl().string();
            default:
                return color.hexa();
        }
    }, [color, mode]);

    useEffect(() => {
        setInputValue(formatValue());
    }, [color, mode, formatValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputValue(text);
        try {
            setColor(Color(text));
        } catch {
            // Ignore invalid color strings
        }
    }

    return (
        <div className={cn('w-full rounded-md shadow-sm', className)} {...props}>
            <Input
                className="h-8 w-full bg-secondary px-2 text-xs shadow-none"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
            />
        </div>
    );
};