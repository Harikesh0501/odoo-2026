import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ to, icon, label, collapsed }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-secondary hover:bg-gray-50 hover:text-gray-900'
            }`
        }
    >
        <span className="text-xl">{icon}</span>
        {!collapsed && <span className="text-sm">{label}</span>}
    </NavLink>
);

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { logout, user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 sticky top-0 h-screen ${collapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                            D
                        </div>
                        {!collapsed && <span className="font-bold text-xl text-gray-900 tracking-tight">Dayflow</span>}
                    </div>
                </div>

                <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
                    <SidebarItem to="/dashboard" icon="📊" label="Dashboard" collapsed={collapsed} />
                    <SidebarItem to="/profile" icon="👤" label="My Profile" collapsed={collapsed} />
                    <SidebarItem to="/present" icon="✅" label="Mark Present" collapsed={collapsed} />
                    <SidebarItem to="/attendance" icon="📅" label="Attendance" collapsed={collapsed} />
                    <SidebarItem to="/leaves" icon="🌴" label="Leaves" collapsed={collapsed} />
                    <SidebarItem to="/payroll" icon="💰" label="Payroll" collapsed={collapsed} />
                    <SidebarItem to="/organization" icon="🏢" label="Organization" collapsed={collapsed} />
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center p-2 rounded-lg text-secondary hover:bg-gray-50 transition-colors"
                    >
                        {collapsed ? '→' : '← Collapse'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">Overview</h1>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                            🔔
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 p-0.5 shadow-lg shadow-blue-500/20 cursor-pointer focus:outline-none"
                            >
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-primary font-bold">
                                    {user?.name ? user.name.charAt(0).toUpperCase() + user.name.charAt(1).toUpperCase() : 'JD'}
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                        <p className="text-xs text-secondary truncate">{user?.email || 'user@example.com'}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
