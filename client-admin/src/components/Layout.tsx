import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Truck, MapPin,
  Image, Star, ShoppingBag, Users, UserCheck, Shield, KeyRound,
} from "lucide-react";
import TopBar from "./TopBar";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const topNav: NavItem = { to: "/", label: "Dashboard", icon: LayoutDashboard };

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Commerce",
    items: [
      { to: "/products", label: "Products", icon: Package },
      { to: "/categories", label: "Categories", icon: Tag },
      { to: "/orders", label: "Orders", icon: ShoppingCart },
      { to: "/shipping-zones", label: "Shipping Zones", icon: Truck },
      { to: "/locations", label: "Locations", icon: MapPin },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/media", label: "Media", icon: Image },
      { to: "/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Marketing",
    items: [{ to: "/abandoned-carts", label: "Abandoned Carts", icon: ShoppingBag }],
  },
  {
    label: "Access",
    items: [
      { to: "/users", label: "Users", icon: Users },
      { to: "/customers", label: "Customers", icon: UserCheck },
      { to: "/admins", label: "Admins", icon: Shield },
      { to: "/roles", label: "Roles & Permissions", icon: KeyRound },
    ],
  },
];

function NavRow({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-brand-gold/15 text-brand-gold"
            : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-brand-cream">
      <aside className="flex w-60 shrink-0 flex-col bg-brand-black">
        <div className="border-b border-white/10 px-5 py-5">
          <span className="font-serif-brand text-lg tracking-wide text-brand-gold">
            VELIOMART <span className="text-brand-gold-soft/80">Admin</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
          <NavRow item={topNav} />

          {navGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <p className="px-3 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                {group.label}
              </p>
              {group.items.map((item) => (
                <NavRow key={item.to} item={item} />
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
