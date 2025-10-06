import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { motion } from "motion/react";

interface PlaceholderToolProps {
    toolName: string;
}

export const PlaceholderTool = ({ toolName }: PlaceholderToolProps) => {
    return (
        <motion.div
            className="flex items-center justify-center h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
        >
            <Card className="bg-card/60 border-white/10 backdrop-blur-xl text-center p-8 w-full max-w-lg">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <Wrench className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">{toolName}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground mt-2">
                        This tool is currently under construction. Please check back later!
                    </CardDescription>
                </CardHeader>
            </Card>
        </motion.div>
    );
};