import { FC } from 'react';
import { Download, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DownloadFormat = 'png' | 'jpeg' | 'svg';

interface DownloadButtonProps {
    onDownload: (format: DownloadFormat) => void;
    disabled?: boolean;
}

export const DownloadButton: FC<DownloadButtonProps> = ({ onDownload, disabled = false }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={disabled}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
                <div className="grid gap-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => onDownload('png')}
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        PNG
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => onDownload('jpeg')}
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        JPG
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => onDownload('svg')}
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        SVG
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};