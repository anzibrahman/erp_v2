import { useState } from "react";
import { authService } from "../../api/services/auth.service";
import { toast } from "sonner";

export const useLoginUser = () => {
  const [loading, setLoading] = useState(false);

  const loginUser = async (payload) => {
    try {
      setLoading(true);
      const data = await authService.login(payload); // { identifier, password }
      toast.success(data.message || "Login successful");
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Login failed";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading };
};
