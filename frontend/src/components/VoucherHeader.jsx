// VoucherHeader.jsx
import { useState, forwardRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useVoucherSeries } from "@/hooks/queries/voucherSeriesQueries";
import VoucherSeriesModal from "@/components/VoucherSeriesModal";
import { setSelectedSeries } from "@/store/slices/voucherSeriesSlice";

const DateIconInput = forwardRef(({ onClick }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    className="inline-flex items-center justify-center rounded-full p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
  >
    <CalendarDays className="h-4 w-4" />
  </button>
));

DateIconInput.displayName = "DateIconInput";

export default function VoucherHeader({
  cmpId,
  voucherType,
  title,
  numberField,
  onHeaderReady, // ⬅ parent will receive function to build payload
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);

  const { data, isLoading } = useVoucherSeries({ cmpId, voucherType });

  const seriesList = data?.series || [];

  const key = `${cmpId}-${voucherType}`;
  const selectedFromRedux = useSelector(
    (state) => state.voucherSeries?.selectedByCompanyAndType?.[key]
  );

  const apiDefault =
    seriesList.find((s) => s.currentlySelected) || seriesList[0] || null;

  const selectedSeries = selectedFromRedux || apiDefault;

  useEffect(() => {
    if (apiDefault && !selectedFromRedux && cmpId && voucherType) {
      dispatch(
        setSelectedSeries({
          cmpId,
          voucherType,
          series: apiDefault,
        })
      );
    }
  }, [apiDefault, selectedFromRedux, cmpId, voucherType, dispatch]);

  const formatVoucherNumber = (series) => {
    if (!series) return "----";
    const num = String(series.currentNumber || 0).padStart(
      series.widthOfNumericalPart || 1,
      "0"
    );
    return `${series.prefix || ""}${num}${
      series.suffix ? ` ${series.suffix}` : ""
    }`;
  };

  const voucherNumber = formatVoucherNumber(selectedSeries);

  // expose builder to parent (for create button under items)
  useEffect(() => {
    if (!onHeaderReady || !selectedSeries) return;
    onHeaderReady(() => ({
      selectedDate: new Date(selectedDate).toISOString(),
      voucherType,
      series_id: selectedSeries._id,
      usedSeriesNumber: selectedSeries.currentNumber,
      [numberField]: voucherNumber,
    }));
  }, [onHeaderReady, selectedDate, selectedSeries, voucherType, numberField, voucherNumber]);

  const handleSelectSeries = (series) => {
    dispatch(
      setSelectedSeries({
        cmpId,
        voucherType,
        series,
      })
    );
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <button
              type="button"
              onClick={() => setIsSeriesModalOpen(true)}
              className="text-left"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 underline-offset-2 hover:underline">
                {selectedSeries?.seriesName ||
                  (isLoading ? "Loading series..." : "Select Series")}
              </p>
              <p className="text-xs font-semibold text-slate-900">
                {title} No: #{voucherNumber}
              </p>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 shadow-sm md:inline-flex">
            <span>{new Date(selectedDate).toDateString()}</span>
          </div>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            customInput={<DateIconInput />}
            dateFormat="yyyy-MM-dd"
            popperClassName="!z-[9999]"
            showPopperArrow={false}
            withPortal
          />
        </div>
      </header>

      <VoucherSeriesModal
        isOpen={isSeriesModalOpen}
        onClose={() => setIsSeriesModalOpen(false)}
        seriesList={seriesList}
        selectedSeriesId={selectedSeries?._id}
        onSelectSeries={handleSelectSeries}
      />
    </>
  );
}
