import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { CalendarRange, FileText, ReceiptText, SlidersHorizontal } from "lucide-react";

import api from "@/api/client/apiClient";
import TransactionFilterSheet from "@/components/filters/TransactionFilterSheet";
import { DEFAULT_DAYBOOK_VOUCHER_TYPES } from "@/components/filters/daybookFilterOptions";
import {
  buildDateRangePresetOptions,
  formatDateDisplay,
} from "@/utils/dateRangePresets";

function formatAmount(value) {
  return Number(value || 0).toFixed(2);
}

function buildVoucherTypeParam(voucherTypes, voucherTypeOptions) {
  if (!voucherTypes.length || voucherTypes.length === voucherTypeOptions.length) {
    return "all";
  }

  return voucherTypes.join(",");
}

function getVoucherTypeLabel(type) {
  return (
    DEFAULT_DAYBOOK_VOUCHER_TYPES.find((option) => option.value === type)?.label ||
    type ||
    "Voucher"
  );
}

const VOUCHER_TYPE_STYLES = {
  saleOrder: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
  receipt: "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
};

function VoucherTypeBadge({ type }) {
  const cls =
    VOUCHER_TYPE_STYLES[type] ||
    "bg-slate-100 text-slate-500 ring-1 ring-slate-200";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cls}`}>
      {getVoucherTypeLabel(type)}
    </span>
  );
}

export default function DaybookPage() {
  const cmpId = useSelector((state) => state.company.selectedCompanyId);
  const initialPreset = useMemo(() => {
    const presets = buildDateRangePresetOptions(new Date());
    return presets.find((preset) => preset.id === "this-month") || presets[0];
  }, []);
  const [filters, setFilters] = useState({
    from: initialPreset.from,
    to: initialPreset.to,
    voucherTypes: DEFAULT_DAYBOOK_VOUCHER_TYPES.map((option) => option.value),
  });
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const voucherTypeParam = buildVoucherTypeParam(
    filters.voucherTypes,
    DEFAULT_DAYBOOK_VOUCHER_TYPES,
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["daybook", cmpId, filters.from, filters.to, voucherTypeParam],
    queryFn: async () => {
      const response = await api.get("/vouchers", {
        params: {
          cmpId,
          from: filters.from,
          to: filters.to,
          voucherType: voucherTypeParam,
        },
        skipGlobalLoader: true,
      });
      return response.data?.data || { vouchers: [], count: 0 };
    },
    enabled: Boolean(cmpId),
  });

  const vouchers = data?.vouchers || [];

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl bg-slate-50">
      <div className="space-y-3 px-3 pb-6 pt-2 sm:px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Daybook
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <CalendarRange className="h-4 w-4 text-sky-500" />
                {formatDateDisplay(filters.from)}
                <span className="text-slate-300">-</span>
                {formatDateDisplay(filters.to)}
              </p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {voucherTypeParam === "all"
                  ? "All voucher types"
                  : filters.voucherTypes.map(getVoucherTypeLabel).join(", ")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
            >
              <SlidersHorizontal className="h-4 w-4 text-sky-600" />
              Filters
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-600">
              <ReceiptText className="h-3.5 w-3.5 text-sky-400" />
              Transactions
            </p>
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100">
              {data?.count ?? 0} entries
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2.5 px-1 py-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-white to-slate-100"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-3 text-[12px] text-rose-600">
            {error?.response?.data?.message || error?.message || "Failed to load daybook."}
          </div>
        ) : vouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <div className="mb-2 rounded-full bg-slate-100 p-3">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-[12px] font-medium text-slate-400">No transactions found</p>
            <p className="mt-0.5 text-[10px] text-slate-300">
              Try adjusting the date range or voucher type
            </p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {vouchers.map((voucher) => (
              <li
                key={voucher._id}
                className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-150 active:scale-[0.99] sm:hover:border-slate-200 sm:hover:shadow-md"
              >
                <div className="flex items-start justify-between px-3.5 py-2.5">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-[9px] font-bold tracking-wide text-sky-500">
                      # {voucher.voucher_number}
                    </p>
                    <p className="max-w-[180px] truncate text-[12px] font-bold text-slate-800">
                      {voucher.party_name || "--"}
                    </p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-slate-400">
                        {formatDateDisplay(voucher.date)}
                      </span>
                      <VoucherTypeBadge type={voucher.voucher_type} />
                    </div>
                  </div>

                  <div className="mt-0.5 shrink-0 text-right">
                    <p className="text-[12px] font-bold text-slate-800">
                      <span className="mr-0.5 text-[10px] font-medium text-slate-400">
                        Rs.
                      </span>
                      {formatAmount(voucher.amount)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <TransactionFilterSheet
        key={`${filterSheetOpen}-${filters.from}-${filters.to}-${filters.voucherTypes.join(",")}`}
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        value={filters}
        onApply={setFilters}
        voucherTypeOptions={DEFAULT_DAYBOOK_VOUCHER_TYPES}
      />
    </div>
  );
}
