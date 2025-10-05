export const HomePage = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center p-12 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto border border-slate-200">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Welcome to Your Personal Toolbox
                </h1>
                <p className="text-lg text-slate-600">
                    Select a tool from the sidebar to get started. Each tool is designed to be simple, powerful, and efficient.
                </p>
            </div>
        </div>
    );
};