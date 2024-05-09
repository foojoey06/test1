
import { auth } from "@/server/auth";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react"
import DashboardNav from "@/components/navigation/dashboard-nav";

export default async function Dashboard({
    children
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    const userlink = [
        {
            label: "Orders",
            path: "/dashboard/orders",
            icon: <Truck size={16} />,
        },
        {
            label: "User Profile",
            path: "/dashboard/settings",
            icon: <Settings size={16} />,
        },
    ] as const

    const adminlink = session?.user.role === "admin" ? [
        {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
        },
        {
            label: "Add Product",
            path: "/dashboard/add-product",
            icon: <PenSquare size={16} />,
        },
        {
            label: "Products",
            path: "/dashboard/products",
            icon: <Package size={16} />,
        },
    ] : []

    const alllink = [...adminlink, ...userlink]

    return (

        <div>
           <DashboardNav alllink={alllink}/>
            {children}
        </div>
    )
}