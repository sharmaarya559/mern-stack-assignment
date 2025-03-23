import { toast } from "react-toastify";
import axiosInstance from "../../axios/axios.instance";

export const login = async (payload) => {
  try {
    const { data } = await axiosInstance.post("login", payload);
    if (data?.success) {
      toast.success(data?.message);
      localStorage.setItem("token", data?.token);
      localStorage.setItem("user_id", data?.user_id);
      return data;
    } else {
      toast.error(data?.message);
      return null;
    }
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
    return null;
  }
};
