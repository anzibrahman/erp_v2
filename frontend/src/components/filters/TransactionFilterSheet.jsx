import { useMemo, useState } from "react";
import { CalendarDays, Check, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  buildDateRangePresetOptions,
  findMatchingDatePreset,
  formatDateDisplay,
} from "@/utils/dateRangePresets";
import { DEFAULT_DAYBOOK_VOUCHER_TYPES } from "@/components/filters/daybookFilterOptions";

function summarizeVoucherTypes(selectedTypes, voucherTypeOptions) {
  if (!selectedTypes.length) return "All voucher types";
  if (selectedTypes.length === voucherTypeOptions.length) return "All voucher types";
  return selectedTypes
    .map(
      (selectedType) =>
        voucherTypeOptions.find((option) => option.value === selectedType)?.label ||
        selectedType,
    )
    .join(", ");
}

export default function TransactionFilterSheet({
  open,
  onOpenChange,
  value,
  onApply,
  voucherTypeOptions = DEFAULT_DAYBOOK_VOUCHER_TYPES,
}) {
  const presets = useMemo(() => buildDateRangePresetOptions(new Date()), []);
  const [draft, setDraft] = useState(value);

  const selectedPreset = findMatchingDatePreset(draft.from, draft.to, presets);
  const hasAllVoucherTypes =
    draft.voucherTypes.length === 0 ||
    draft.voucherTypes.length === voucherTypeOptions.length;

  const handlePresetSelect = (preset) => {
    setDraft((current) => ({
      ...current,
      from: preset.from,
      to: preset.to,
    }));
  };

  const handleVoucherToggle = (voucherType) => {
    setDraft((current) => {
      const exists = current.voucherTypes.includes(voucherType);
      const nextVoucherTypes = exists
        ? current.voucherTypes.filter((item) => item !== voucherType)
        : [...current.voucherTypes, voucherType];

      return {
        ...current,
        voucherTypes: nextVoucherTypes,
      };
    });
  };

  const handleSelectAllVoucherTypes = () => {
    setDraft((current) => ({
      ...current,
      voucherTypes: voucherTypeOptions.map((option) => option.value),
    }));
  };

  const handleReset = () => {
    const defaultPreset = presets.find((preset) => preset.id === "this-month") || presets[0];

    setDraft({
      from: defaultPreset.from,
      to: defaultPreset.to,
      voucherTypes: voucherTypeOptions.map((option) => option.value),
    });
  };

  const summaryText = `${formatDateDisplay(draft.from)} - ${formatDateDisplay(draft.to)} · ${summarizeVoucherTypes(
    draft.voucherTypes,
    voucherTypeOptions,
  )}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-3xl p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 py-4">
          <SheetHeader className="pr-10">
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              Filter Daybook
            </SheetTitle>
            <SheetDescription>{summaryText}</SheetDescription>
          </SheetHeader>
        </div>

        <div className="space-y-5 px-4 py-4">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Custom Range</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  From
                </span>
                <input
                  type="date"
                  value={draft.from}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      from: event.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  To
                </span>
                <input
                  type="date"
                  value={draft.to}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      to: event.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Presets</h3>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {presets.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 text-left last:border-b-0 ${
                      isSelected ? "bg-slate-50" : "bg-white"
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-sky-500 bg-sky-500 text-white"
                            : "border-slate-300 bg-white text-transparent"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {preset.label}
                      </span>
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {formatDateDisplay(preset.from)} - {formatDateDisplay(preset.to)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Voucher Types</h3>
              <button
                type="button"
                onClick={handleSelectAllVoucherTypes}
                className="text-xs font-semibold text-sky-600"
              >
                Select all
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {voucherTypeOptions.map((option) => {
                const isSelected = draft.voucherTypes.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleVoucherToggle(option.value)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-sky-500 bg-sky-500 text-white"
                          : "border-slate-300 bg-white text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-500">
              {hasAllVoucherTypes
                ? "Showing all supported voucher types."
                : summarizeVoucherTypes(draft.voucherTypes, voucherTypeOptions)}
            </p>
          </section>
        </div>

        <div className="sticky bottom-0 border-t border-slate-100 bg-white px-4 py-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="flex-1 bg-sky-600 text-white hover:bg-sky-700"
              onClick={() => {
                onApply(draft);
                onOpenChange(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
