import { Outlet } from "react-router-dom";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";


function AdminLayout() {

    const [openSidbar, setOpenSidebar] = useState(false);

    return ( 
        <div className="flex min-h-screen w-full">
            {/* Sidebar Admin D:L */}
            <AdminSidebar open={openSidbar} setOpen={setOpenSidebar} />
            <div className="flex flex-1 flex-col">
                {/* Header Admin D:L */}
                <AdminHeader setOpen={setOpenSidebar} />
                <main className="flex-1 flex bg-muted/40 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
     );
}

export default AdminLayout;