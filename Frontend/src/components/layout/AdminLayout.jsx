import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiUsers, FiBox, FiLogOut } from 'react-icons/fi';

const AdminSidebar = () => {
    const linkClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
    const activeLinkClasses = "bg-green-600 text-white";
    const inactiveLinkClasses = "hover:bg-gray-100 dark:hover:bg-gray-700";

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen sticky top-0">
            <nav className="p-4 space-y-2">
                <NavLink to="/admin/dashboard" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                    <FiGrid /><span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/sellers" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                    <FiUsers /><span>Manage Sellers</span>
                </NavLink>
                <NavLink to="/admin/products" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                    <FiBox /><span>All Products</span>
                </NavLink>
            </nav>
        </aside>
    );
};

const AdminLayout = () => {
    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet /> {/* Child routes will be rendered here */}
            </main>
        </div>
    );
};

export default AdminLayout;
