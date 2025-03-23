import { array, object, string } from "yup";

export const CreateBlogSchema = object().shape({
  title: string().required("Title is required."),
  description: string().required("Description is required."),
  category: string().required("Category is required."),
});

export const CreateBlogInitialState = {
  title: "",
  description: "",
  category: "",
};
