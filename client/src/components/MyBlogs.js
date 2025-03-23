import React, { useEffect, useState } from "react";
import { getAllBlogs } from "../services/apis/getAllBlogs";
import { likeBlog } from "../services/apis/likeBlog";
import { createCommentOnBlog } from "../services/apis/createComment";
import { useNavigate } from "react-router";
import { deleteBlog } from "../services/apis/deleteBlog";

const MyBlogs = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const [paginationData, setPaginationData] = useState({});

  useEffect(() => {
    getData();
  }, [page, limit, search]);

  const getData = async () => {
    const res = await getAllBlogs(
      localStorage.getItem("user_id"),
      page,
      limit,
      search,
      true
    );
    if (res?.success) {
      setData(res?.data);
      setPaginationData(res);
    }
  };

  const handleLike = async (blog_id) => {
    if (localStorage.getItem("token")) {
      const res = await likeBlog(blog_id);
      if (res?.success) {
        await getData();
      }
    } else {
      navigate("/login");
    }
  };

  const handleComment = async (blog_id) => {
    if (localStorage.getItem("token")) {
      const res = await createCommentOnBlog(blog_id, comment);
      if (res?.success) {
        setComment("");
        setNewComment("");
        await getData();
      }
    } else {
      navigate("/login");
    }
  };

  const handleCreateBlog = () => {
    if (localStorage.getItem("token")) {
      navigate("/create-blog");
    } else {
      navigate("/login");
    }
  };

  const handleDelete = async (blog_id) => {
    const res = await deleteBlog(blog_id);
    if (res?.success) {
      await getData();
    }
  };

  return (
    <div className="container mx-auto p-3 bg-gray-600 min-h-screen text-center">
      <h2 className="text-2xl font-bold mb-6 text-white">My Blogs</h2>
      <div className="flex justify-between">
        <button
          onClick={() => navigate("/blogs")}
          className="inline-block mb-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
        >
          Home
        </button>
        <button
          onClick={handleCreateBlog}
          className="inline-block mb-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
        >
          Create Blog
        </button>
      </div>
      <div className="flex justify-end gap-2 my-4">
        <input
          type="text"
          placeholder="search"
          className="rounded-lg p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {data?.length > 0 &&
          data?.map((blog) => (
            <div key={blog?._id} className="bg-white shadow-md rounded-lg p-4">
              <h5 className="text-lg font-semibold capitalize">
                {blog?.title}
              </h5>
              <h6 className="text-sm text-gray-600 capitalize">
                By {blog?.author?.full_name}
              </h6>
              <h6 className="text-sm text-gray-600">
                Category : {blog?.category}
              </h6>
              <p className="text-gray-700 mt-2">{blog?.description}</p>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(blog?.createdAt)?.toLocaleDateString()}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => navigate(`/blogs/${blog?._id}`)}
                  className="inline-block mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Read More
                </button>
                <button
                  onClick={() => handleDelete(blog?._id)}
                  className="inline-block mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Delete
                </button>
              </div>
              <div>
                <div className="mt-4">
                  <button
                    onClick={() => handleLike(blog?._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    ❤️ {blog?.likes[0]?.count || 0}
                  </button>
                </div>
                {blog?._id !== newComment && (
                  <div className="mt-4">
                    <button
                      onClick={() => setNewComment(blog?._id)}
                      className="bg-green-500 text-white py-1 px-3 rounded mt-2 hover:bg-green-600"
                    >
                      {blog?.comments[0]?.count || 0} Comments
                    </button>
                  </div>
                )}
                {blog?._id === newComment && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                    <button
                      onClick={() => handleComment(blog?._id)}
                      className="bg-green-500 text-white py-1 px-3 rounded mt-2 hover:bg-green-600"
                    >
                      Add Comment
                    </button>
                  </div>
                )}
                {blog?.my_blog && (
                  <div className="mt-4">
                    <button
                      onClick={() => navigate(`/edit-blog/${blog?._id}`)}
                      className="bg-gray-500 text-white py-1 px-3 rounded mt-2 hover:bg-green-600"
                    >
                      Edit Blog
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {paginationData?.total_pages > 0 && (
        <div className="flex w-1/4 justify-between float-right bg-gray-600">
          <button
            className="text-white border border-gray-500 rounded-full px-4 py-2"
            disabled={paginationData?.current_page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          {paginationData?.current_page !== 1 &&
            paginationData?.total_pages > 1 && (
              <button
                className="text-white border border-gray-500 rounded-full px-4 py-2"
                onClick={() => setPage(page - 1)}
              >
                {paginationData?.current_page - 1}
              </button>
            )}
          <button className="border border-gray-500 rounded-full px-4 py-2 bg-blue-500 text-white">
            {paginationData?.current_page}
          </button>
          {(paginationData?.total_pages > paginationData?.current_page + 1 ||
            paginationData?.total_pages ===
              paginationData?.current_page + 1) && (
            <button
              className="text-white border border-gray-500 rounded-full px-4 py-2"
              onClick={() => setPage(page + 1)}
            >
              {paginationData?.current_page + 1}
            </button>
          )}
          {(paginationData?.total_pages > paginationData?.current_page + 2 ||
            paginationData?.total_pages ===
              paginationData?.current_page + 2) && (
            <button
              className="text-white border border-gray-500 rounded-full px-4 py-2"
              onClick={() => setPage(page + 2)}
            >
              {paginationData?.current_page + 2}
            </button>
          )}
          <button
            className="text-white border border-gray-500 rounded-full px-4 py-2"
            disabled={
              paginationData?.current_page === paginationData?.total_pages
            }
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
