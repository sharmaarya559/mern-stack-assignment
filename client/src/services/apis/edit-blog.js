import { toast } from "react-toastify";
import axiosInstance from "../../axios/axios.instance";

export const editBlog = async (blog_id, payload) => {
  try {
    const { data } = await axiosInstance.put(`posts/${blog_id}`, payload);
    if (data?.success) {
      toast.success(data?.message);
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
