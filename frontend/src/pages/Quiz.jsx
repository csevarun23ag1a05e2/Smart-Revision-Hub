import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data } = await api.get(`/quizzes/topic/${topicId}`);
      setQuizzes(data);
    };
    fetchQuizzes();
  }, [topicId]);

  const handleOptionChange = (quizId, optionIndex) => {
    setAnswers({ ...answers, [quizId]: optionIndex });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/quizzes/submit', { topicId, answers });
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Failed to submit quiz');
    }
  };

  if (quizzes.length === 0) {
    return (
      <div className="p-6">
        <button onClick={() => window.history.back()} className="text-blue-600 hover:underline mb-4">&larr; Back</button>
        <p>No quizzes available for this topic.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded shadow text-center">
        <h2 className="text-3xl font-bold mb-4">Quiz Results</h2>
        <p className="text-xl mb-4">You scored {result.score} out of {result.total}</p>
        <button onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white px-4 py-2 rounded">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => window.history.back()} className="text-blue-600 hover:underline mb-4">&larr; Back</button>
      <h1 className="text-3xl font-bold mb-6">Quiz Practice</h1>

      <form onSubmit={handleSubmit}>
        {quizzes.map((quiz, qIndex) => (
          <div key={quiz._id} className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-xl mb-2">{qIndex + 1}. {quiz.question}</h3>
            {quiz.options.map((opt, optIdx) => (
              <div key={optIdx} className="mb-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`quiz-${quiz._id}`}
                    value={optIdx}
                    onChange={() => handleOptionChange(quiz._id, optIdx)}
                    required
                  />
                  <span>{opt}</span>
                </label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded text-xl font-bold hover:bg-green-700">Submit Quiz</button>
      </form>
    </div>
  );
};

export default Quiz;
