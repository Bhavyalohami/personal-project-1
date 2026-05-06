import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";
import { MdArrowBack, MdArrowOutward } from "react-icons/md";
import BaseUrl from "../../Api/baseurl";

const BlogPage = () => {
  const { id } = useParams();
  const [data, setData] = useState({});

  const getData = async (blogId) => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/blogs-list/${blogId}/`);
      setData(response.data || {});
    } catch (error) {
      console.error(error);
      setData({});
    }
  };

  useEffect(() => {
    getData(id);
  }, [id]);

  const description = typeof data.text === "string" ? data.text : "";

  return (
    <main className="bg-[#ECFEFF] text-[#134E4A]">
      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <article className="mx-auto max-w-5xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[#67E8F9]/70 bg-white px-4 py-2 text-sm font-black text-[#134E4A] shadow-sm transition hover:border-[#0D9488] hover:text-[#0D9488]"
          >
            <MdArrowBack />
            Back to blog
          </Link>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#67E8F9]/50 bg-white shadow-xl shadow-teal-900/10">
            <img
              className="h-[280px] w-full object-cover sm:h-[480px]"
              src={data.image || "/brand/blog-skin-care-teal.png"}
              alt={data.name || "Healthcare article"}
            />
            <div className="p-6 sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0D9488]">
                {data.author || "Care Team"} | {data.date || "Latest"}
              </p>
              <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
                {data.name || "Healthcare article"}
              </h1>
              <div className="prose prose-slate mt-8 max-w-none text-base leading-8 text-[#134E4A]/80">
                {parse(description)}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-[#67E8F9]/40 bg-white p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-black">Ready to talk to a specialist?</h2>
              <p className="mt-2 text-sm leading-6 text-[#134E4A]/70">
                Use CareBridge to pick a doctor, share details, and continue
                straight into booking.
              </p>
            </div>
            <Link
              to="/ourdoctors"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0D9488] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0F766E]"
            >
              Find doctors
              <MdArrowOutward />
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
};

export default BlogPage;
