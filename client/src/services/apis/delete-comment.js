import { toast } from "react-toastify";
import axiosInstance from "../../axios/axios.instance";

export const deleteComment = async (comment_id) => {
  try {
    const { data } = await axiosInstance.delete(
      `/posts/delete_comment/${comment_id}`
    );
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
