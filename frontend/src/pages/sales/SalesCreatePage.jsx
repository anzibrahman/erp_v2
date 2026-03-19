// src/features/sales/pages/SalesCreatePage.jsx
import { useEffect, useState } from "react";
import { AlertCircle, LoaderCircle, Package2, User2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import api from "@/api/client/apiClient";
import DespatchDetailsSheet from "@/components/DespatchDetailsSheet";
import PartySelectSheet from "@/components/PartySelectSheet";
import TransactionHeader from "@/components/TransactionHeader";
import { setCompany } from "@/store/slices/transactionSlice";

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
  const [open, setOpen] = useState(false);
  const party = useSelector((state) => state.transaction.party);

  return (
    <>
      <SectionCard
        title="Party"
        required
        subtitle="Select the customer for this order"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex flex-1 items-center justify-between rounded-lg border border-dashed border-violet-300 bg-violet-50/40 px-3 py-2.5 text-xs font-medium text-violet-700 transition hover:bg-violet-50 hover:border-violet-400"
          >
            <span className="inline-flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <User2 className="h-3.5 w-3.5" />
              </span>
              <span>{party?.partyName ? party.partyName : "+ Add Party Name"}</span>
            </span>
            <span className="text-[10px] text-violet-500">
              {party?.totalOutstanding != null
                ? `Outstanding: Rs.${party.totalOutstanding.toFixed(2)}`
                : "Search / Select"}
            </span>
          </button>
        </div>
      </SectionCard>

      <PartySelectSheet open={open} onOpenChange={setOpen} />
    </>
  );
}

function DetailsSection() {
  const [open, setOpen] = useState(false);
  const despatch = useSelector((state) => state.transaction.despatchDetails);

  const hasDetails = Boolean(
    despatch?.challanNo ||
      despatch?.destination ||
      despatch?.vehicleNo ||
      despatch?.despatchThrough
  );

  return (
    <>
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
              onClick={() => setOpen(true)}
              className="inline-flex w-full items-center justify-between rounded-md border border-dashed border-slate-300 bg-slate-50/40 px-3 py-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-400"
            >
              <span>
                {hasDetails
                  ? "Edit Despatch Details"
                  : "+ Add Despatch Details"}
              </span>
            </button>
            {hasDetails && (
              <p className="mt-1 text-[10px] text-slate-500">
                {despatch?.despatchThrough
                  ? `Via ${despatch.despatchThrough}`
                  : ""}
                {despatch?.despatchThrough && despatch?.vehicleNo ? " · " : ""}
                {despatch?.vehicleNo ? `Vehicle: ${despatch.vehicleNo}` : ""}
                {(despatch?.despatchThrough || despatch?.vehicleNo) &&
                despatch?.destination
                  ? " · "
                  : ""}
                {despatch?.destination ? `Dest: ${despatch.destination}` : ""}
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      <DespatchDetailsSheet open={open} onOpenChange={setOpen} />
    </>
  );
}

function ItemsSection({ onCreate, createLoading, createError, disableCreate }) {
  const errorMessage =
    createError?.response?.data?.message ||
    createError?.message ||
    null;

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
          disabled={createLoading || disableCreate}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Create Sales Order
        </button>

        {disableCreate && !createLoading && (
          <p className="text-xs text-amber-600">
            Wait for the transaction header to finish loading before creating the order.
          </p>
        )}

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default function SalesCreatePage() {
  const cmpId = useSelector((state) => state.company.selectedCompanyId);
  const dispatch = useDispatch();
  const [buildHeaderPayload, setBuildHeaderPayload] = useState(null);

  useEffect(() => {
    if (!cmpId) return;

    dispatch(setCompany({ cmpId }));
  }, [cmpId, dispatch]);

  const createSaleOrderMutation = useMutation({
    mutationFn: async () => {
      const headerPayload = buildHeaderPayload ? buildHeaderPayload() : {};
      const payload = {
        ...headerPayload,
      };

      const res = await api.post("/api/sUsers/createSaleOrder", payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Sale order created", data);
      toast.success(data?.message || "Sales order created");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create sales order";
      toast.error(message);
    },
  });

  const createLoading =
    createSaleOrderMutation.isPending || createSaleOrderMutation.isLoading;
  const headerReady = Boolean(buildHeaderPayload);

  return (
    <div className="flex h-full flex-col ">
      <TransactionHeader
        cmpId={cmpId}
        title="Order"
        numberField="salesOrderNumber"
        onHeaderReady={setBuildHeaderPayload}
      />

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <PartySection />
          <DetailsSection />
          <ItemsSection
            onCreate={() => createSaleOrderMutation.mutate()}
            createLoading={createLoading}
            createError={createSaleOrderMutation.error}
            disableCreate={!cmpId || !headerReady}
          />
        </div>
      </main>
    </div>
  );
}
