import { NavLink, Outlet } from 'react-router-dom';
import { tools } from '../tools';
import type { Tool } from '../tools'; // Use 'import type' for type-only imports

export const Layout = () => {
    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
            <aside className="w-64 flex-shrink-0 bg-slate-800 text-slate-100 p-4 flex flex-col">
                <h1 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-4">
                    Toolbox
                </h1>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {tools.map((tool: Tool) => (
                            <li key={tool.path}>
                                <NavLink
                                    to={tool.path}
                                    className={({ isActive }: { isActive: boolean }) =>
                                        `flex items-center gap-3 py-2.5 px-4 rounded-md transition-colors duration-200 text-sm font-medium ${isActive
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'hover:bg-slate-700 text-slate-300'
                                        }`
                                    }
                                >
                                    {tool.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <footer className="text-xs text-slate-500 text-center mt-4">
                    Version 1.0.0
                </footer>
            </aside>

            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};