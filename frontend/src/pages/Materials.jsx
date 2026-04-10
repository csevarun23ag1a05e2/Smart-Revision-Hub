import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const Materials = () => {
  const { topicId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const fetchMaterials = async () => {
    const { data } = await api.get(`/materials/topic/${topicId}`);
    setMaterials(data);
  };

  useEffect(() => {
    fetchMaterials();
  }, [topicId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('topicId', topicId);
    formData.append('file', file);

    await api.post('/materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setTitle('');
    setFile(null);
    e.target.reset();
    fetchMaterials();
  };

  const handleDelete = async (id) => {
    await api.delete(`/materials/${id}`);
    fetchMaterials();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
         <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">&larr; Back to Topics</button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Study Materials</h1>

      <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow mb-6 max-w-md">
        <h3 className="text-xl mb-2">Upload Material</h3>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 mb-2 rounded" required />
        <input type="file" onChange={e => setFile(e.target.files[0])} className="w-full border p-2 mb-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </form>

      <ul className="bg-white rounded shadow divide-y">
        {materials.map(mat => (
          <li key={mat._id} className="p-4 flex justify-between items-center">
            <span>{mat.title}</span>
            <div className="space-x-4">
              <a href={`http://localhost:5000${mat.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View/Download</a>
              <button onClick={() => handleDelete(mat._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </li>
        ))}
        {materials.length === 0 && <li className="p-4 text-gray-500">No materials uploaded yet.</li>}
      </ul>
    </div>
  );
};

export default Materials;
