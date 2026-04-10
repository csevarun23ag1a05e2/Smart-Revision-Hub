import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const Topics = () => {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);
  const [name, setName] = useState('');
  const [priority, setPriority] = useState(1);

  const fetchTopics = async () => {
    const { data } = await api.get(`/topics/subject/${subjectId}`);
    setTopics(data);
  };

  useEffect(() => {
    fetchTopics();
  }, [subjectId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post(`/topics/subject/${subjectId}`, { name, priority });
    setName('');
    setPriority(1);
    fetchTopics();
  };

  const handleDelete = async (id) => {
    await api.delete(`/topics/${id}`);
    fetchTopics();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/subjects" className="text-blue-600 hover:underline">&larr; Back to Subjects</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Topics</h1>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow mb-6 max-w-md">
        <h3 className="text-xl mb-2">Add New Topic</h3>
        <input type="text" placeholder="Topic Name" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 mb-2 rounded" required />
        <input type="number" placeholder="Priority (1=High)" value={priority} onChange={e => setPriority(Number(e.target.value))} className="w-full border p-2 mb-2 rounded" min="1" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Topic</button>
      </form>

      <ul className="bg-white rounded shadow divide-y">
        {topics.map(topic => (
          <li key={topic._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
            <div>
              <span className="font-semibold">{topic.name}</span>
              <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">Priority: {topic.priority}</span>
            </div>
            <div className="space-x-4">
              <Link to={`/topics/${topic._id}/materials`} className="text-blue-600 hover:underline">Materials</Link>
              <Link to={`/topics/${topic._id}/quiz`} className="text-green-600 hover:underline">Quiz</Link>
              <button onClick={() => handleDelete(topic._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </li>
        ))}
        {topics.length === 0 && <li className="p-4 text-gray-500">No topics added yet.</li>}
      </ul>
    </div>
  );
};

export default Topics;
