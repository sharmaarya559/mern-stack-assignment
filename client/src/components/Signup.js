import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  SignupInitialState,
  SignupSchema,
} from "../services/schema/signup.schema";
import { signup } from "../services/apis/signup";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
    defaultValues: SignupInitialState,
  });

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blogs");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const onSubmitHandler = async (data) => {
    setLoading(true);
    const res = await signup(data);
    setLoading(false);
    if (res?.success) {
      navigate("/blogs");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 px-6 py-12">
      <div className="w-full max-w-md space-y-8 bg-gray-400 p-8 shadow-lg rounded-2xl">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="text-left">
            <label htmlFor="first_name">First name</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              {...register("first_name")}
              placeholder="Enter first name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <small className="text-xs text-red-400">
            {errors?.first_name?.message || ""}
          </small>

          <div className="text-left">
            <label htmlFor="last_name">Last name</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              {...register("last_name")}
              placeholder="Enter last name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <small className="text-xs text-red-400">
            {errors?.last_name?.message || ""}
          </small>

          <div className="text-left">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              {...register("email")}
              placeholder="Enter email"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <small className="text-xs text-red-400">
            {errors?.email?.message || ""}
          </small>

          <div className="text-left">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              {...register("username")}
              placeholder="Enter username"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <small className="text-xs text-red-400">
            {errors?.username?.message || ""}
          </small>

          <div className="text-left">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              {...register("password")}
              placeholder="Enter password"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <small className="text-xs text-red-400">
            {errors?.password?.message || ""}
          </small>

          <div className="text-left">
            <label className="text-left" htmlFor="confirm_password">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              {...register("confirm_password")}
              placeholder="Confirm your password"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <small className="text-xs text-red-400">
            {errors?.confirm_password?.message || ""}
          </small>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Sign up
          </button>
          <p className="text-center">or</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
