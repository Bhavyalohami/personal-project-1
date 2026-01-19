import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import BaseUrl from '../../Api/baseurl';

const UserDocuments = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentName, setDocumentName] = useState('');  
  const [error, setError] = useState('');


  const fetchDocuments = async () => {
    const token = Cookies.get("patient_token");
    const config = {
      headers: {
        "Authorization": `Token ${token}`,
      },
    };
    try {
      const response = await axios.get(`${BaseUrl}clinic/documents/`, config);
      // console.log(response.data);
      setDocuments(response.data); 
    } catch (err) {
      console.error("Error fetching documents:", err);
      Swal.fire({
        title: "Error!",
        text: "There was an error fetching your documents.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File Type!",
          text: "Please upload a PDF, DOC, DOCX, JPG, or PNG file.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          title: "File Too Large!",
          text: "Please upload a file smaller than 5MB.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName) {
      Swal.fire({
        title: "Error!",
        text: "Please select a file and enter a document name.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const token = Cookies.get("patient_token");
    const formData = new FormData();
    formData.append('document_file', selectedFile);
    formData.append('document_name', documentName);
    

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Token ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      },
    };

    try {
      setLoading(true);
      const response = await axios.post(`${BaseUrl}clinic/upload-document/`, formData, config);
      setLoading(false);
      setUploadProgress(0);
      Swal.fire({
        title: "Success!",
        text: "Your document has been uploaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setSelectedFile(null);
      setDocumentName('');
      fetchDocuments();
    } catch (err) {
      setLoading(false);
      setUploadProgress(0);
      console.error("Error uploading document:", err);
      Swal.fire({
        title: "Error!",
        text: err.response ? err.response.data.detail || "There was an error uploading your document." : "Network error",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("patient_token");
      const config = {
        headers: {
          "Authorization": `Token ${token}`,
        },
      };
      await axios.delete(`${BaseUrl}clinic/documents/${id}/`, config);
      fetchDocuments();
      Swal.fire({
        title: "Success!",
        text: "Your document has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Error deleting document:", err);
      Swal.fire({
        title: "Error!",
        text: "There was an error deleting your document.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
 

  return (
    <div className="py-8 px-8 bg-[#F2F2F2] w-full">
      <div className="w-full container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 pb-8">
        <div className="flex items-center justify-center">
          <h1 className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Your Documents
          </h1>
        </div>
        
        <div className="flex flex-col justify-center items-center my-6">
          <p className="self-start text-2xl text-[#274760] font-semibold">Uploaded Documents</p>
          <div className="w-full mt-4">
            {documents.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200">Document Name</th>
                    <th className="py-2 px-4 bg-gray-200">Uploaded At</th>
                    <th className="py-2 px-4 bg-gray-200">Download</th>
                    <th className="py-2 px-4 bg-gray-200">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc.id} className="border-b">
                      <td className="py-2 px-4">{doc.document_name}</td>
                      <td className="py-2 px-4">{dayjs(doc.upload_date).format("DD MMM YYYY, hh:mm A")}</td>
                      <td className="py-2 px-4">
                        <a href={doc.document_file} download className="text-blue-500 hover:underline">Download</a>
                      </td>
                      <td className="py-2 px-4">
                        <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className='text-gray-500'>No documents uploaded yet.</p>
            )}
          </div>

          <div className='flex flex-col items-center mt-8 w-full'>
            <p className='self-start text-2xl text-[#274760] font-semibold'>Upload New Document</p>
            <input
              type="text"
              placeholder="Document Name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="border border-gray-300 rounded-md p-2  mt-4 w-full sm:w-auto"
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md p-2 mt-2 w-full sm:w-auto"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full mt-2">
                <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full" style={{ width: `${uploadProgress}%` }}>
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDocuments;
