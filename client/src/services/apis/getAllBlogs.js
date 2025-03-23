import { toast } from "react-toastify";
import axiosInstance from "../../axios/axios.instance";

export const getAllBlogs = async (user_id, page, limit, search, my_blogs) => {
  try {
    const { data } = await axiosInstance.get(
      `posts?page=${page}&limit=${limit}&user_id=${user_id}&search=${search}&my_blogs=${my_blogs}`
    );
    if (data?.success) {
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
