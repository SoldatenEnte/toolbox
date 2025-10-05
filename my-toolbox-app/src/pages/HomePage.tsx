import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { tools } from '@/tools';

export const HomePage = () => {
    return (
        <div className="container mx-auto h-full flex flex-col items-center justify-center">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                    Essential Online Tools
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    A collection of free and simple web utilities for everyday tasks. Select a tool to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                {tools.map(tool => (
                    <Card key={tool.path} className="bg-card/60 border-white/10 backdrop-blur-xl hover:bg-card/80 hover:-translate-y-1 transition-all duration-300">
                        <CardHeader>
                            <CardTitle>{tool.name}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <NavLink to={tool.path} className="text-sm font-semibold text-primary hover:underline">
                                Open Tool &rarr;
                            </NavLink>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};