import { object, string } from "yup";

export const LoginSchema = object().shape({
  email_or_username: string().required("Email is required."),
  password: string().required("Password is required."),
});

export const LoginInitialState = {
  email_or_username: "",
  password: "",
};
