// src/components/Layout/HomeLayout.jsx
import { Outlet } from "react-router-dom";
import { Home, Wallet, Bell, Settings } from "lucide-react";

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
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-indigo-100">Welcome back</p>
            <p className="text-sm font-semibold">Hello, Alexandre!</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bell className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl py-6 text-center mb-5">
          <p className="text-xs text-indigo-100 mb-1">Total Balance</p>
          <p className="text-2xl font-bold">$3,756.00</p>
        </div>

        <div className="flex gap-3 mb-5">
          <Button className="flex-1 bg-sky-400 hover:bg-sky-500 text-white rounded-xl py-5.5">
            Create Order
          </Button>
          <Button className="flex-1 bg-rose-400 hover:bg-rose-500 text-white rounded-xl py-5.5">
            Create Receipt
          </Button>
        </div>
      </div>

      <Card className="bg-white border-none ring-0 shadow-none text-slate-900 w-full rounded-t-[30px] rounded-b-none pt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-extrabold">Just for you</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <button className="flex items-center gap-3 bg-slate-50 rounded-2xl px-3 py-2">
              <div className="h-9 w-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-medium">Customers</span>
            </button>

            <button className="flex items-center gap-3 bg-slate-50 rounded-2xl px-3 py-2">
              <div className="h-9 w-9 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-medium">Products</span>
            </button>

            <button className="flex items-center gap-3 bg-slate-50 rounded-2xl px-3 py-2">
              <div className="h-9 w-9 rounded-2xl bg-red-100 flex items-center justify-center text-red-500">
                <AlertCircle className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-medium">Outstandings</span>
            </button>

            <button className="flex items-center gap-3 bg-slate-50 rounded-2xl px-3 py-2">
              <div className="h-9 w-9 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-500">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-medium">Statements</span>
            </button>

            <button className="flex items-center gap-3 bg-slate-50 rounded-2xl px-3 py-2">
              <div className="h-9 w-9 rounded-2xl bg-green-100 flex items-center justify-center text-green-500">
                <Boxes className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-medium">Stock register</span>
            </button>

            <button className="flex items-center gap-3 bg-slate-50 rounded-2xl px-3 py-2">
              <div className="h-9 w-9 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-500">
                <Banknote className="h-4 w-4" />
              </div>
              <span className="text-[12px] font-medium">Cash / Bank</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MobileShell() {
  return (
    <div className="md:hidden min-h-screen bg-white flex flex-col border-none">
      {/* main content */}
      <main className="flex-1  ">
        <MobileWalletCard />
        <div className="mt-4">
          <Outlet />
        </div>
      </main>

      {/* bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center text-xs">
        <button className="flex flex-col items-center text-indigo-500">
          <div className="h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center">
            <Home className="h-4 w-4" />
          </div>
          <span>Home</span>
        </button>
        <button className="flex flex-col items-center text-slate-500">
          <Wallet className="h-5 w-5 mb-1" />
          <span>Market</span>
        </button>
        <button className="flex flex-col items-center text-slate-500">
          <Bell className="h-5 w-5 mb-1" />
          <span>Notifications</span>
        </button>
        <button className="flex flex-col items-center text-slate-500">
          <Settings className="h-5 w-5 mb-1" />
          <span>Settings</span>
        </button>
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
