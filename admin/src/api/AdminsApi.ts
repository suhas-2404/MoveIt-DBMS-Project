import axiosInstance from "@/lib/axios";
import { LoginFormData } from "@/pages/login/types";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAdminAuth = () => {
  const adminAuth = async () => {
    try {
      const response = await axiosInstance.get("/admin/me");

      return response.data;
    } catch (error: any) {
      throw new Error("You need to be logged in to access this page");
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: "adminAuth",
    queryFn: adminAuth,
  });

  return {
    isSignedIn: !!data,
    user: data,
    isLoading,
    isError,
  };
};

export const useLoginUserRequestMutation = () => {
  const loginUserRequestMutation = async (loginData: LoginFormData) => {
    try {
      const response = await axiosInstance.post("/admin/sign-in", loginData);

      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const navigate = useNavigate();
  const {
    mutateAsync: loginAdmin,
    isLoading,
    data,
    reset,
  } = useMutation({
    mutationKey: "loginUserRequest",
    mutationFn: loginUserRequestMutation,
    onSuccess: () => {
      navigate("/dashboard", { replace: true });
      toast.success("Login successful! Welcome back 👋");
    },
    onError: (error: any) => {
      toast.error(error?.toString());
      reset();
    },
  });

  return {
    loginAdmin,
    isLoading,
    data,
  };
};

export const useGetStatsRequest = () => {
  const getStatsRequest = async () => {
    try {
      const response = await axiosInstance.get("/admin/get-stats");

      return response.data;
    } catch (error: any) {
      throw new Error("You need to be logged in to access this page");
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: "getStatsRequest",
    queryFn: getStatsRequest,
  });

  return {
    response: data,
    isLoading,
    isError,
  };
};
