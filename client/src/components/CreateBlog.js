import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CreateBlogInitialState,
  CreateBlogSchema,
} from "../services/schema/create-blog.schema";
import { createBlog } from "../services/apis/create-blog";
import { editBlog } from "../services/apis/edit-blog";
import { useNavigate, useParams } from "react-router";
import { getSingleBlog } from "../services/apis/getSingleBlog";

export default function CreateBlog() {
  const { blog_id } = useParams();
  const categories = [
    "Technology",
    "Health",
    "Finance",
    "Travel",
    "Education",
    "Sports",
  ];

  useEffect(() => {
    getBlogData();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateBlogSchema),
    defaultValues: CreateBlogInitialState,
  });

  const navigate = useNavigate();

  const onSubmitHandler = async (data) => {
    let res;
    if (blog_id) {
      res = await editBlog(blog_id, data);
    } else {
      res = await createBlog(data);
    }
    if (res?.success) {
      navigate(-1);
    }
  };
  const getBlogData = async () => {
    if (blog_id) {
      const res = await getSingleBlog(localStorage.getItem("token"), blog_id);
      if (res?.success) {
        reset({
          title: res?.data?.title,
          description: res?.data?.description,
          category: res?.data?.category,
        });
      }
    }
  };

  return (
    <div className="bg-gray-700">
      <div className="max-w-2xl mx-auto p-6 mt-2">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-4">Create a Blog</h1>
          <div className="flex justify-between">
            <button
              onClick={() => navigate("/blogs")}
              className="inline-block mb-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
            >
              Home
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              {...register("title")}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}

            <textarea
              placeholder="Content"
              {...register("description")}
              className="w-full p-2 border border-gray-300 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}

            <select
              {...register("category")}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setValue("category", e.target.value)}
            >
              <option value="">
                {watch("category") || "Select a category"}
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Publish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
