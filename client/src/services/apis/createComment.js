import { toast } from "react-toastify";
import axiosInstance from "../../axios/axios.instance";

export const createCommentOnBlog = async (blog_id, comment) => {
  try {
    const { data } = await axiosInstance.post(`posts/comment/${blog_id}`, {
      comment,
    });
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
