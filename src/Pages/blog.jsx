import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import BaseUrl from "../Api/baseurl";

const plainTextFromHtml = (value = "") => {
  const parsed = parse(value);
  const walk = (node) => {
    if (Array.isArray(node)) return node.map(walk).join(" ");
    if (typeof node === "string") return node;
    return node?.props?.children ? walk(node.props.children) : "";
  };
  return walk(parsed).replace(/\s+/g, " ").trim();
};

const Blog = () => {
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

  const featured = data[0];
  const secondary = data.slice(1, 3);

  return (
    <main className="bg-[#ECFEFF] text-[#134E4A]">
      <section className="px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Health Journal
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Practical medical reads before your next visit.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#134E4A]/75">
              Browse prevention tips, family care guidance, and specialist
              advice built around clear appointment decisions.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#67E8F9]/50 bg-white shadow-xl shadow-teal-900/10">
            <img
              src="/brand/blog-skin-care-teal.png"
              alt="Healthcare article"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Featured
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-5xl">
                Latest from CareBridge
              </h2>
            </div>
          </div>

          {featured && (
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <Link
                to={`/blogpage/${featured.id}/`}
                className="group overflow-hidden rounded-2xl border border-[#67E8F9]/40 bg-[#ECFEFF] shadow-sm transition hover:-translate-y-1 hover:border-[#0D9488] hover:shadow-xl hover:shadow-teal-900/10"
              >
                <img
                  className="h-[340px] w-full object-cover transition group-hover:scale-105"
                  src={featured.image}
                  alt={featured.name}
                />
                <div className="p-6">
                  <p className="text-sm font-black text-[#0D9488]">
                    {featured.author} | {featured.date}
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-black leading-tight">
                      {featured.name}
                    </h3>
                    <MdArrowOutward className="text-2xl text-[#0D9488]" />
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#134E4A]/70">
                    {plainTextFromHtml(featured.text).split(" ").slice(0, 28).join(" ")}
                    ...
                  </p>
                </div>
              </Link>

              <div className="grid gap-5">
                {secondary.map((item) => (
                  <Link
                    key={item.id}
                    to={`/blogpage/${item.id}/`}
                    className="group grid overflow-hidden rounded-2xl border border-[#67E8F9]/40 bg-[#ECFEFF] shadow-sm transition hover:-translate-y-1 hover:border-[#0D9488] hover:shadow-xl hover:shadow-teal-900/10 sm:grid-cols-[0.9fr_1.1fr]"
                  >
                    <img
                      className="h-full min-h-[210px] w-full object-cover transition group-hover:scale-105"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="p-5">
                      <p className="text-sm font-black text-[#0D9488]">
                        {item.author} | {item.date}
                      </p>
                      <h3 className="mt-3 text-xl font-black leading-tight">
                        {item.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#134E4A]/70">
                        {plainTextFromHtml(item.text).split(" ").slice(0, 18).join(" ")}
                        ...
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black sm:text-5xl">All blog posts</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <Link
                key={item.id}
                to={`/blogpage/${item.id}/`}
                className="group overflow-hidden rounded-2xl border border-[#67E8F9]/40 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#0D9488] hover:shadow-xl hover:shadow-teal-900/10"
              >
                <img
                  className="h-56 w-full object-cover transition group-hover:scale-105"
                  src={item.image}
                  alt={item.name}
                />
                <div className="p-6">
                  <p className="text-sm font-black text-[#0D9488]">
                    {item.author} | {item.date}
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-black leading-tight">
                      {item.name}
                    </h3>
                    <MdArrowOutward className="text-xl text-[#0D9488]" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#134E4A]/70">
                    {plainTextFromHtml(item.text).split(" ").slice(0, 20).join(" ")}
                    ...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
