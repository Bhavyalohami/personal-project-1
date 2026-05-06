import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import BaseUrl from "../../Api/baseurl";
import {
  FaDownload,
  FaFileArrowUp,
  FaFileMedical,
  FaShieldHeart,
  FaTrash,
} from "react-icons/fa6";

const UserDocuments = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentName, setDocumentName] = useState("");

  const fetchDocuments = async () => {
    const token = Cookies.get("patient_token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    try {
      const response = await axios.get(`${BaseUrl}clinic/documents/`, config);
      setDocuments(response.data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
      Swal.fire({
        title: "Error",
        text: "There was an error fetching your documents.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        title: "Invalid file type",
        text: "Please upload a PDF, DOC, DOCX, JPG, or PNG file.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        title: "File too large",
        text: "Please upload a file smaller than 5MB.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName.trim()) {
      Swal.fire({
        title: "Missing details",
        text: "Please select a file and enter a document name.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const token = Cookies.get("patient_token");
    const formData = new FormData();
    formData.append("document_file", selectedFile);
    formData.append("document_name", documentName.trim());

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    };

    try {
      setLoading(true);
      await axios.post(`${BaseUrl}clinic/upload-document/`, formData, config);
      setUploadProgress(0);
      Swal.fire({
        title: "Uploaded",
        text: "Your document has been uploaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setSelectedFile(null);
      setDocumentName("");
      fetchDocuments();
    } catch (err) {
      setUploadProgress(0);
      console.error("Error uploading document:", err);
      Swal.fire({
        title: "Error",
        text: err.response
          ? err.response.data.detail || "There was an error uploading your document."
          : "Network error",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete document?",
      text: "This removes the file from your patient documents.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      const token = Cookies.get("patient_token");
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      await axios.delete(`${BaseUrl}clinic/documents/${id}/`, config);
      fetchDocuments();
      Swal.fire({
        title: "Deleted",
        text: "Your document has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Error deleting document:", err);
      Swal.fire({
        title: "Error",
        text: "There was an error deleting your document.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative overflow-hidden bg-[#134E4A] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-20" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              Medical documents
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Keep reports ready for every visit.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-cyan-50/80">
              Upload prescriptions, lab reports, images, and consultation notes
              so future appointments start with context.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
            <FaShieldHeart className="text-4xl text-[#67E8F9]" />
            <p className="mt-5 text-4xl font-black">{documents.length}</p>
            <p className="text-sm font-semibold text-cyan-50/75">
              Stored patient files
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Upload
            </p>
            <h2 className="mt-2 text-3xl font-black">Add a new document</h2>
            <p className="mt-3 text-sm leading-7 text-[#134E4A]/70">
              Accepted formats: PDF, DOC, DOCX, JPG, and PNG under 5MB.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Document name</span>
                <input
                  type="text"
                  placeholder="Example: Blood report"
                  value={documentName}
                  onChange={(event) => setDocumentName(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-4 text-sm font-semibold outline-none transition focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                />
              </label>

              <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#67E8F9] bg-[#ECFEFF]/70 p-6 text-center transition hover:border-[#0D9488] hover:bg-white">
                <FaFileArrowUp className="text-4xl text-[#0D9488]" />
                <span className="mt-4 text-sm font-black">
                  {selectedFile ? selectedFile.name : "Choose a medical file"}
                </span>
                <span className="mt-1 text-xs font-semibold text-[#134E4A]/60">
                  Click to browse your computer
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0D9488] px-6 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload Document"}
              </button>

              {uploadProgress > 0 && (
                <div className="overflow-hidden rounded-full bg-[#ECFEFF]">
                  <div
                    className="bg-[#F59E0B] py-1 text-center text-xs font-black text-[#134E4A]"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Library
            </p>
            <h2 className="mt-2 text-3xl font-black">Uploaded documents</h2>

            <div className="mt-6 grid gap-4">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <article
                    key={doc.id}
                    className="grid gap-4 rounded-3xl border border-[#67E8F9]/40 bg-[#ECFEFF]/70 p-4 md:grid-cols-[1fr_auto] md:items-center"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl text-[#0D9488]">
                        <FaFileMedical />
                      </div>
                      <div>
                        <h3 className="break-words text-lg font-black">
                          {doc.document_name}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-[#134E4A]/60">
                          {dayjs(doc.upload_date).format("DD MMM YYYY, hh:mm A")}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={doc.document_file}
                        download
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#0D9488] px-4 text-sm font-black text-white transition hover:bg-[#0F766E]"
                      >
                        <FaDownload />
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 transition hover:bg-red-50"
                        aria-label="Delete document"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[2rem] border border-dashed border-[#67E8F9]/70 bg-[#ECFEFF]/70 p-10 text-center">
                  <FaFileMedical className="mx-auto text-4xl text-[#0D9488]" />
                  <h3 className="mt-4 text-2xl font-black">No files yet</h3>
                  <p className="mt-3 text-sm font-semibold text-[#134E4A]/65">
                    Uploaded documents will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserDocuments;
