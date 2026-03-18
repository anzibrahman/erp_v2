// src/components/VoucherSeriesModal.jsx
import { useState } from "react";

export default function VoucherSeriesModal({
  isOpen,
  onClose,
  seriesList = [],
  selectedSeriesId,
  onSelectSeries,
}) {
  const [localSelectedId, setLocalSelectedId] = useState(selectedSeriesId);

  if (!isOpen) return null;

  const currentSeries = seriesList.find((s) => s._id === localSelectedId) || seriesList[0];
  const nextNumber =
    currentSeries?.currentNumber != null
      ? String(currentSeries.currentNumber).padStart(
          currentSeries.widthOfNumericalPart || 1,
          "0"
        )
      : "--";

  const formatNext = (s) => {
    const num = String(s.currentNumber || 1).padStart(
      s.widthOfNumericalPart || 1,
      "0"
    );
    return `${s.prefix || ""}${num}${s.suffix || ""}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <header className="flex items-center justify-between border-b px-4 py-2.5">
          <p className="text-sm font-semibold text-slate-800">Select {currentSeries?.voucherType || "Series"}</p>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg"
          >
            ×
          </button>
        </header>

        <div className="border-b px-4 py-2 text-xs text-slate-600">
          <span className="font-medium">Current Number:</span>{" "}
          <span className="tabular-nums">{nextNumber}</span>
        </div>

        <div className="max-h-72 overflow-y-auto px-4 py-2">
          {seriesList.map((s) => (
            <button
              key={s._id}
              type="button"
              onClick={() => setLocalSelectedId(s._id)}
              className={`mb-2 w-full rounded-md border px-3 py-2 text-left text-xs ${
                s._id === localSelectedId
                  ? "border-violet-400 bg-violet-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  {s.seriesName}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Next: {formatNext(s)}
              </p>
            </button>
          ))}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t px-4 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              const selected = seriesList.find((s) => s._id === localSelectedId);
              if (selected && onSelectSeries) onSelectSeries(selected);
              onClose();
            }}
            className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900"
          >
            Select
          </button>
        </footer>
      </div>
    </div>
  );
}
