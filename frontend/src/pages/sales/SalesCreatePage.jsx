// src/features/sales/pages/SalesCreatePage.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, CreditCard, User2, Package2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/client/apiClient";
import VoucherHeader from "@/components/VoucherHeader";
import { useSelector } from "react-redux";


function SectionCard({ title, required, subtitle, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {title}
            {required && <span className="ml-1 text-red-500">*</span>}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>
          )}
        </div>
      </header>
      <div className="px-4 py-3.5">{children}</div>
    </section>
  );
}

function PartySection() {
  return (
    <SectionCard
      title="Party"
      required
      subtitle="Select the customer for this order"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-between rounded-lg border border-dashed border-violet-300 bg-violet-50/40 px-3 py-2.5 text-xs font-medium text-violet-700 transition hover:bg-violet-50 hover:border-violet-400"
        >
          <span className="inline-flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <User2 className="h-3.5 w-3.5" />
            </span>
            <span>+ Add Party Name</span>
          </span>
          <span className="text-[10px] text-violet-500">Search / Create</span>
        </button>
      </div>
    </SectionCard>
  );
}

function DetailsSection() {
  return (
    <SectionCard
      title="Order details"
      required
      subtitle="Control dates, reference and series"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500">
            Despatch details
          </label>
          <button
            type="button"
            className="inline-flex w-full items-center justify-between rounded-md border border-dashed border-slate-300 bg-slate-50/40 px-3 py-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-400"
          >
            <span>+ Add Despatch Details</span>
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

function ItemsSection( onCreate, createLoading) {
  return (
    <SectionCard
      title="Items"
      required
      subtitle="Add products and quantities"
    >
      <div className="space-y-3">
        <button
          type="button"
          className="inline-flex w-full items-center justify-between rounded-lg border border-dashed border-emerald-300 bg-emerald-50/40 px-3 py-2.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 hover:border-emerald-400"
        >
          <span className="inline-flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Package2 className="h-3.5 w-3.5" />
            </span>
            <span>+ Add Item</span>
          </span>
          <span className="text-[10px] text-emerald-500">
            Search by name / code
          </span>
        </button>

        <div className="flex justify-end text-[11px] text-slate-500">
          <div className="space-y-0.5">
            <div className="flex justify-between gap-6">
              <span>Sub total</span>
              <span className="tabular-nums">0.00</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Tax</span>
              <span className="tabular-nums">0.00</span>
            </div>
            <div className="flex justify-between gap-6 font-semibold text-slate-700">
              <span>Net amount</span>
              <span className="tabular-nums">0.00</span>
            </div>
          </div>
        </div>
  <button
          type="button"
          onClick={onCreate}
          disabled={createLoading}
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Create Sales Order
        </button>
        
      </div>
    </SectionCard>
  );
}

export default function SalesCreatePage() {
   const cmpId = useSelector((state) => state.company.selectedCompanyId);
  const { mutate: createSaleOrder, isLoading: createLoading } = useMutation({
    mutationFn: async (headerPayload) => {
      const payload = {
        ...headerPayload,
        // TODO: add party, items, totals from state when wired
      };

      const res = await api.post("/api/sUsers/createSaleOrder", payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      // TODO: navigate to details page if required
      // navigate(`/sUsers/saleOrderDetails/${data.data._id}`);
      console.log("Sale order created", data);
    },
  });

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <VoucherHeader
        cmpId={cmpId}
        voucherType="saleOrder"
        title="Order"
        numberField="salesOrderNumber"
        onCreate={createSaleOrder}
        createLoading={createLoading}
      />

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <PartySection />
          <DetailsSection />
          <ItemsSection 
            onCreate={() => createSaleOrder()}
            createLoading={createLoading}
            />
        </div>
      </main>
    </div>
  );
}
