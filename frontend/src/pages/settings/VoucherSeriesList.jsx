import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineInsertLink } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import api from "@/api/client/apiClient";
import { ROUTES } from "@/routes/paths";
import { useMobileHeader } from "@/components/Layout/HomeLayout";
import { useDeleteConfirm } from "@/components/common/DeleteConfirmProvider";
import { formatVoucherType } from "@/utils/formatVoucherType";

function VoucherSeriesList() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { setHeaderOptions, resetHeaderOptions } = useMobileHeader();

const confirmDelete = useDeleteConfirm();



  const voucherType = location?.state?.from;
  const cmp_id = useSelector((state) => state.company.selectedCompanyId) || "";

  // Header setup
  useEffect(() => {
    if (!voucherType) return;

    setHeaderOptions({
      showMenuDots: true,
      menuItems: [
        {
          label: "Add Series",
          onSelect: () =>
            navigate(ROUTES.settingsVoucherSeriesCreate, {
              state: { from: voucherType },
            }),
        },
      ],
    });

    return () => resetHeaderOptions();
  }, [navigate, resetHeaderOptions, setHeaderOptions, voucherType]);

  // Fetch series on mount
  useEffect(() => {
    if (!cmp_id || !voucherType) return;

    const fetchSeries = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/sUsers/getSeriesByVoucher/${cmp_id}`, {
          params: { voucherType },
          withCredentials: true,
        });
        setSeries(res.data?.series || []);
      } catch (error) {
        console.error("Error fetching series:", error);
        toast.error("Failed to load voucher series");
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [cmp_id, voucherType]);

  // Handle delete
  const handleDelete = async (seriesItem) => {
    const { _id: seriesId, isDefault } = seriesItem;

    if (isDefault) {
      toast.warning("Cannot delete default series");
      return;
    }

    const confirmed = await confirmDelete({
      title: "Delete this series?",
      description: `This will permanently delete "${seriesItem.seriesName}".`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/sUsers/deleteVoucherSeriesById/${cmp_id}`, {
        data: { voucherType, seriesId },
        withCredentials: true,
      });
      setSeries((prev) => prev.filter((s) => s._id !== seriesId));
      toast.success("Series deleted");
    } catch (error) {
      console.error("Failed to delete series:", error);
      toast.error("Failed to delete series");
    }
  };

  const handleEditClick = (seriesItem) => {
    navigate(ROUTES.settingsVoucherSeriesCreate, {
      state: { series: seriesItem, from: voucherType, mode: "edit" },
    });
  };

  const formatNumber = (num, width) => num.toString().padStart(width, "0");

  return (
    <section className="flex-1 bg-slate-50 text-slate-700">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTES.settingsVoucherSeriesCreate, {
                state: { from: voucherType },
              })
            }
            className="hidden items-center rounded-md bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-pink-700 sm:inline-flex"
          >
            + Add series
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-5">
        {loading && (
          <div className="flex h-40 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-[2px] border-slate-300 border-t-pink-600" />
              <p className="text-xs text-slate-500">
                Loading voucher series…
              </p>
            </div>
          </div>
        )}

        {!loading && series.length === 0 && (
          <div className="flex h-56 items-center justify-center">
            <div className="rounded-lg border border-dashed border-slate-300 bg-white px-8 py-6 text-center">
              <p className="text-sm font-semibold text-slate-800">
                No series configured yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Create a series to start numbering vouchers consistently.
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate(ROUTES.settingsVoucherSeriesCreate, {
                    state: { from: voucherType },
                  })
                }
                className="mt-3 inline-flex items-center rounded-md bg-pink-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-pink-700"
              >
                + Add first series
              </button>
            </div>
          </div>
        )}

        {!loading && series.length > 0 && (
          <div className="space-y-3">
            {series.map((item) => {
              const formattedNumber = `${item?.prefix ?? ""}${formatNumber(
                item?.currentNumber,
                item?.widthOfNumericalPart
              )}${item?.suffix ?? ""}`;

              return (
                <div
                  key={item._id}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                        <MdOutlineInsertLink className="-rotate-90" size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            {item?.seriesName}
                          </p>
                          {item?.isDefault && (
                            <span className="rounded-full bg-emerald-50 px-2 py-[2px] text-[10px] font-semibold text-emerald-700">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] font-medium tracking-[0.16em] text-slate-500">
                          {formattedNumber}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <FaEdit className="text-slate-500" size={11} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={item?.isDefault}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-100"
                      >
                        <RiDeleteBin6Fill size={11} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </section>
  );
}

export default VoucherSeriesList;