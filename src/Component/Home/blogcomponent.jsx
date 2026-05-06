import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import BaseUrl from "../../Api/baseurl";

const plainTextFromHtml = (value = "") => {
  const parsed = parse(value);
  const walk = (node) => {
    if (Array.isArray(node)) return node.map(walk).join(" ");
    if (typeof node === "string") return node;
    return node?.props?.children ? walk(node.props.children) : "";
  };
  return walk(parsed).replace(/\s+/g, " ").trim();
};

const BlogComponent = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/blogs-list/`);
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setData([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const posts = data.slice(0, 3);

  return (
    <section className="bg-[#ECFEFF] px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Health Journal
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#134E4A] sm:text-5xl">
              Useful reads before your visit
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-black text-[#0D9488] hover:text-[#0F766E]"
          >
            View all articles
            <MdArrowOutward className="text-xl" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id || post.name}
              to={`/blogpage/${post.id}`}
              className="group overflow-hidden rounded-2xl border border-[#67E8F9]/40 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#0D9488] hover:shadow-xl hover:shadow-teal-900/10"
            >
              <div className="h-52 bg-[#ECFEFF]">
                <img
                  alt={post.name || "Blog post"}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  src={post.image || "/brand/blog-skin-care-teal.png"}
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-black text-[#0D9488]">
                  {post.author} | {post.date}
                </p>
                <h3 className="mt-3 text-xl font-black leading-7 text-[#134E4A]">
                  {post.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {plainTextFromHtml(post.text).split(" ").slice(0, 24).join(" ")}
                  ...
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0D9488]">
                  Read article
                  <MdArrowOutward className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogComponent;
