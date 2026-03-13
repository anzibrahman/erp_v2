// src/lib/confirmDelete.js
import Swal from "sweetalert2";

export const confirmDelete = async (title = "Delete this item?") => {
  const result = await Swal.fire({
    title,
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  return result.isConfirmed;
};
