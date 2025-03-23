import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Blogs from "./components/Blogs";
import SingleBlog from "./components/SingleBlog";
import CreateBlog from "./components/CreateBlog";
import MyBlogs from "./components/MyBlogs";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:blog_id" element={<SingleBlog />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/edit-blog/:blog_id" element={<CreateBlog />} />
            <Route path="/my-blogs" element={<MyBlogs />} />
          </Route>

          <Route path="*" element={<Navigate to="/blogs" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
