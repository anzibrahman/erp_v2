import { useState } from "react";
import { authService } from "../../api/services/auth.service";
import { toast } from "sonner";

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);

  const registerUser = async (payload) => {
    try {
      setLoading(true);
      const data = await authService.register(payload);
      toast.success(data.message || "Registered successfully");
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Registration failed";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading };
};
