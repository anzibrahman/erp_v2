// src/components/Layout/HomeLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Home,
  Wallet,
  Bell,
  Settings,
  Building2,
  CircleUserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Users,
  Package,
  AlertCircle,
  FileText,
  Boxes,
  Banknote,
} from "lucide-react";

function DesktopShell() {
  return (
    <div className="hidden md:flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center px-4 border-b font-semibold">
          MyWallet
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 text-sm">
          <button className="flex items-center gap-2 w-full text-left font-medium text-primary">
            <Home className="h-4 w-4" />
            Dashboard
          </button>
          <button className="flex items-center gap-2 w-full text-left text-muted-foreground">
            <Wallet className="h-4 w-4" />
            Transactions
          </button>
          <button className="flex items-center gap-2 w-full text-left text-muted-foreground">
            <Bell className="h-4 w-4" />
            Notifications
          </button>
          <button className="flex items-center gap-2 w-full text-left text-muted-foreground">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </nav>
        <div className="p-4 border-t text-xs text-muted-foreground">
          © 2026 MyWallet
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <div>
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <p className="text-sm font-semibold">Hello, Alexandre!</p>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="Alexandre" />
            <AvatarFallback>AX</AvatarFallback>
          </Avatar>
        </header>

        {/* Desktop content (reuse the same card style as mobile) */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-md">
            <MobileWalletCard />
          </div>
          <div className="mt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileWalletCard() {
  return (
    <div className="bg-linear-to-b from-blue-800 to-indigo-600   text-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-700 text-white">
        {/* Subtle background pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Decorative blurred blobs */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-indigo-400/20 blur-2xl" />

        <div className="relative p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-300 to-indigo-400 flex items-center justify-center ring-2 ring-white/20 shadow-lg">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <div>
                <p className="text-[11px] text-blue-200 leading-tight">
                  Welcome back
                </p>
                <p className="text-sm font-semibold leading-tight">
                  Hello, Alexandre!
                </p>
              </div>
            </div>

            {/* Bell */}
            <button className="relative h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center backdrop-blur-sm">
              <Bell className="h-4 w-4" />
              {/* Notification dot */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-400 ring-1 ring-blue-900" />
            </button>
          </div>

          {/* Balance card */}
          <div className="relative bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl py-6 text-center mb-5 overflow-hidden">
            {/* Inner shimmer line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <p className="text-[11px] text-blue-200 mb-1 tracking-wide uppercase">
              Total Balance
            </p>
            <p className="text-3xl font-bold tracking-tight">$3,756.00</p>
            <p className="text-[11px] text-blue-300 mt-1">↑ 4.2% this month</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-sky-500/90 hover:bg-sky-500 text-white rounded-xl py-5 text-[13px] font-semibold shadow-md shadow-sky-900/30 transition-all hover:-translate-y-0.5 border border-sky-400/30">
              Create Order
            </Button>
            <Button className="flex-1 bg-rose-500/90 hover:bg-rose-500 text-white rounded-xl py-5 text-[13px] font-semibold shadow-md shadow-rose-900/30 transition-all hover:-translate-y-0.5 border border-rose-400/30">
              Create Receipt
            </Button>
          </div>
        </div>
      </div>

      <Card className="bg-white border-none ring-0 shadow-none text-slate-900 w-full rounded-t-[30px] rounded-b-none pt-6">
        <CardHeader className="pb-2">
          {/* <CardTitle className="text-sm font-extrabold">Just for you</CardTitle> */}
        </CardHeader>
        <CardContent className="space-y-4 pb-7">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Quick Actions
            </p>
            {/* <p className="text-[11px] font-medium text-slate-500">6 modules</p> */}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <button className="group relative rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Users className="h-4 w-4" />
              </div>
              <p className="text-[13px] font-semibold text-slate-800">
                Customers
              </p>
              <p className="text-[11px] text-slate-500">Manage parties</p>
              <span className="absolute right-3 top-3 text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </button>

            <button className="group relative rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                <Package className="h-4 w-4" />
              </div>
              <p className="text-[13px] font-semibold text-slate-800">
                Products
              </p>
              <p className="text-[11px] text-slate-500">Catalog items</p>
              <span className="absolute right-3 top-3 text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </button>

            <button className="group col-span-2 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-semibold text-slate-800">
                    Outstandings
                  </p>
                  <p className="text-[11px] text-slate-500">Pending dues</p>
                </div>
              </div>
              <span className="text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </button>

            <button className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-500">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-[12px] font-semibold text-slate-800">
                  Statements
                </p>
              </div>
            </button>

            <button className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-500">
                <Boxes className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-[12px] font-semibold text-slate-800">
                  Stock register
                </p>
              </div>
            </button>

            <button className="group col-span-2 flex items-center justify-between rounded-2xl border border-slate-100 bg-gradient-to-r from-teal-50/80 to-white px-3 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-500">
                  <Banknote className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-semibold text-slate-800">
                    Cash / Bank
                  </p>
                  <p className="text-[11px] text-slate-500">Ledger & balance</p>
                </div>
              </div>
              <span className="text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MobileShell() {
  const [activeTab, setActiveTab] = useState("home");

  const mobileTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "company", label: "Company", icon: Building2 },
    { id: "user", label: "User", icon: CircleUserRound },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="md:hidden min-h-screen bg-white flex flex-col border-none">
      {/* main content */}
      <main className="flex-1 pb-[104px]">
        <MobileWalletCard />
        <div className="mt-4">
          <Outlet />
        </div>
      </main>

      {/* bottom bar */}
      <nav className="fixed bottom-3 left-0 right-0 px-4">
        <div className="mx-auto h-[76px] max-w-md rounded-3xl border border-slate-200/80 bg-white/90 px-2 shadow-[0_8px_30px_rgba(15,23,42,0.12)] backdrop-blur-md">
          <div className="grid h-full grid-cols-4 items-center text-xs">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="relative z-10 flex flex-col items-center justify-center"
                >
                  <div
                    className={`flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "h-10 w-16 rounded-2xl bg-slate-600 text-white shadow-md"
                        : "h-10 w-10 rounded-full text-slate-500"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isActive ? "scale-105" : "scale-100"
                      }`}
                    />
                  </div>
                  <span
                    className={`mt-1 text-[11px] font-medium transition-colors duration-300 ${
                      isActive ? "text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default function HomeLayout() {
  return (
    <>
      <DesktopShell />
      <MobileShell />
    </>
  );
}
