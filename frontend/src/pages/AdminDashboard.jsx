import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  useEffect(() => {
    // Admin needs to be able to get all topics, but our endpoint is /subjects, so let's simplify for now
    // In a real app we'd have a specific admin route to fetch all topics across users.
    // Assuming the admin can see topics they created or we just fetch from subjects.
    // For this mock, we will just provide a manual input or a simplified view if they manage their own subjects.
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    if (!selectedTopic) return alert('Please enter a Topic ID');
    try {
      await api.post('/quizzes', {
        topicId: selectedTopic,
        question,
        options,
        correctAnswerIndex: Number(correctAnswerIndex)
      });
      alert('Quiz added successfully');
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswerIndex(0);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add quiz');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Add Quiz Question</h2>
        <form onSubmit={handleAddQuiz}>
          <div className="mb-4">
            <label className="block mb-1">Topic ID (from MongoDB)</label>
            <input type="text" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Question</label>
            <input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Options</label>
            {options.map((opt, idx) => (
              <input key={idx} type="text" value={opt} onChange={e => handleOptionChange(idx, e.target.value)} placeholder={`Option ${idx + 1}`} className="w-full border p-2 mb-2 rounded" required />
            ))}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Correct Answer (0-3)</label>
            <select value={correctAnswerIndex} onChange={e => setCorrectAnswerIndex(e.target.value)} className="w-full border p-2 rounded">
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Question</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
