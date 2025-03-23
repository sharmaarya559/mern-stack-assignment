import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  LoginSchema,
  LoginInitialState,
} from "../services/schema/login.schema";
import { login } from "../services/apis/login";
import { useNavigate } from "react-router";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: LoginInitialState,
  });

  const onSubmitHandler = async (data) => {
    setLoading(true);
    const res = await login(data);
    if (res?.success) {
      navigate("/blogs");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 px-6 py-12">
      <div className="w-full max-w-md space-y-8 bg-gray-400 p-8 shadow-lg rounded-2xl">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="text-left">
            <label htmlFor="email_or_username">Email or username</label>
            <input
              type="text"
              id="email_or_username"
              name="email or username"
              {...register("email_or_username")}
              placeholder="Enter email or username"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <small className="text-xs text-red-400">
            {errors?.email_or_username?.message || ""}
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
            <small className="text-xs text-red-400">
              {errors?.password?.message || ""}
            </small>
            {/* <div className="mt-2 text-right">
              <a
                href="#"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Forgot password?
              </a>
            </div> */}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Sign in
          </button>
          <p className="text-center">or</p>
          <button
            onClick={() => navigate("/signup")}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Create new account
          </button>
        </form>
      </div>
    </div>
  );
}
