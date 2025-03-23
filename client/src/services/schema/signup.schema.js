import { object, string } from "yup";

export const SignupSchema = object().shape({
  email: string().email().required("Email is required."),
  username: string().required("Username is required."),
  first_name: string().required("First name is required."),
  last_name: string().required("Last name is required."),
  password: string().required("Password is required."),
  confirm_password: string().required("Please confirm your password."),
});

export const SignupInitialState = {
  email: "",
  username: "",
  first_name: "",
  last_name: "",
  password: "",
  confirm_password: "",
};
