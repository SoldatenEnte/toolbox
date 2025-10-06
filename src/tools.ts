import React from 'react';
import { QRCodeGenerator } from '@/pages/tools/QRCodeGenerator';
import { PlaceholderTool } from '@/pages/tools/PlaceholderTool';
import { Base64Tool } from '@/pages/tools/Base64Tool';

export interface Tool {
    name: string;
    description: string;
    path: string;
    component: React.ComponentType;
}

const createPlaceholder = (toolName: string): React.ComponentType => {
    const PlaceholderComponent = () => React.createElement(PlaceholderTool, { toolName });
    PlaceholderComponent.displayName = `Placeholder(${toolName})`;
    return PlaceholderComponent;
};

export const tools: Tool[] = [
    {
        name: 'QR Code Generator',
        description: 'Create and customize a QR code.',
        path: '/tools/qr-code-generator',
        component: QRCodeGenerator,
    },
    {
        name: 'Base64 Encoder / Decoder',
        description: 'Encode and decode text to Base64.',
        path: '/tools/base64-encoder',
        component: Base64Tool,
    },
    {
        name: 'JSON Formatter',
        description: 'Beautify and validate your JSON data.',
        path: '/tools/json-formatter',
        component: createPlaceholder('JSON Formatter'),
    },
    {
        name: 'Color Converter',
        description: 'Convert colors between HEX, RGB, and HSL.',
        path: '/tools/color-converter',
        component: createPlaceholder('Color Converter'),
    },
    {
        name: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text for your designs.',
        path: '/tools/lorem-ipsum-generator',
        component: createPlaceholder('Lorem Ipsum Generator'),
    },
];