import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchSubjects = async () => {
    const { data } = await api.get('/subjects');
    setSubjects(data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/subjects', { name, description });
    setName('');
    setDescription('');
    fetchSubjects();
  };

  const handleDelete = async (id) => {
    await api.delete(`/subjects/${id}`);
    fetchSubjects();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow mb-6 max-w-md">
        <h3 className="text-xl mb-2">Add New Subject</h3>
        <input type="text" placeholder="Subject Name" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 mb-2 rounded" required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 mb-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Subject</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map(subject => (
          <div key={subject._id} className="bg-white p-4 rounded shadow relative group">
            <h3 className="text-xl font-bold">{subject.name}</h3>
            <p className="text-gray-600 mb-4">{subject.description}</p>
            <div className="flex justify-between">
               <Link to={`/subjects/${subject._id}/topics`} className="text-blue-600 hover:underline">View Topics</Link>
               <button onClick={() => handleDelete(subject._id)} className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
