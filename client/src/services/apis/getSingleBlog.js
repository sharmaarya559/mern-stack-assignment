import { toast } from "react-toastify";
import axiosInstance from "../../axios/axios.instance";

export const getSingleBlog = async (user_id, blog_id) => {
  try {
    const { data } = await axiosInstance.get(
      `posts/${blog_id}?user_id=${user_id}`
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
