import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getSingleBlog } from "../services/apis/getSingleBlog";
import { likeBlog } from "../services/apis/likeBlog";
import { createCommentOnBlog } from "../services/apis/createComment";
import { deleteBlog } from "../services/apis/deleteBlog";
import { deleteComment } from "../services/apis/delete-comment";

const SingleBlog = () => {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getSingleBlog(
      localStorage.getItem("user_id") || "",
      blog_id
    );
    if (res?.success) {
      setBlog(res?.data);
    }
  };
  const handleLike = async () => {
    if (token) {
      const res = await likeBlog(blog_id);
      if (res?.success) {
        await getData();
      }
    } else {
      navigate("/login");
    }
  };

  const handleComment = async () => {
    if (token) {
      const res = await createCommentOnBlog(blog_id, comment);
      if (res?.success) {
        setComment("");
        await getData();
      }
    } else {
      navigate("/login");
    }
  };

  const handleDelete = async () => {
    const res = await deleteBlog(blog_id);
    if (res?.success) {
      navigate("/blogs");
    }
  };

  const handleDeleteComment = async (comment_id) => {
    const res = await deleteComment(comment_id);
    if (res?.success) {
      await getData();
    }
  };

  if (!blog) return <div className="container mx-auto p-6">Blog not found</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <button
        className="mt-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mx-2 float-left"
        onClick={() => navigate(-1)}
      >
        Home
      </button>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-3xl font-bold">{blog?.title}</h2>
        <h6 className="text-sm text-gray-600">
          By {blog?.author?.full_name} -{" "}
          {new Date(blog?.createdAt).toLocaleString()}
        </h6>
        <h6 className="text-sm text-gray-600">Category : {blog?.category}</h6>

        <p className="text-gray-700 mt-4">{blog?.description}</p>
        <button
          onClick={handleLike}
          className="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mx-2"
        >
          ❤️ {blog?.likes_count}
        </button>
        <button className="mt-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mx-2">
          {blog?.comments_count} comments
        </button>
        {blog?.my_blog && (
          <button
            className="mt-4 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 mx-2"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}

        {token && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleComment}
              className="bg-green-500 text-white py-1 px-3 rounded mt-2 hover:bg-green-600"
            >
              Comment
            </button>
          </div>
        )}
        <div className="mt-2">
          {blog?.comments.map((comment, index) => (
            <div className="flex justify-center gap-2">
              <p key={index} className="text-sm text-gray-800 border-t pt-5">
                {comment?.full_name} - {comment?.comment}{" "}
              </p>
              {comment?.my_comment && (
                <button
                  className="mt-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mx-2"
                  onClick={() => handleDeleteComment(comment?._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
