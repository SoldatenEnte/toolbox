import React from 'react';
import { QRCodeGenerator } from './pages/tools/QRCodeGenerator';

export interface Tool {
    name: string;
    description: string;
    path: string;
    component: React.ComponentType;
}

export const tools: Tool[] = [
    {
        name: 'QR Code Generator',
        description: 'Create and customize a QR code.',
        path: '/tools/qr-code-generator',
        component: QRCodeGenerator,
    },
    // Add your next tool here
];