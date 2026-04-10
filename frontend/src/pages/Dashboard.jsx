import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await api.get('/progress');
        setProgress(data);
      } catch (err) {
        console.error('Failed to fetch progress', err);
      }
    };
    fetchProgress();
  }, []);

  if (!progress) return <div className="p-4">Loading dashboard...</div>;

  const pieData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [progress.completedTopics, progress.totalTopics - progress.completedTopics],
      backgroundColor: ['#4ade80', '#f87171'],
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl text-gray-600">Total Topics</h3>
          <p className="text-3xl font-bold">{progress.totalTopics}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl text-gray-600">Completion</h3>
          <p className="text-3xl font-bold">{progress.completionPercentage.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl text-gray-600">Avg Quiz Score</h3>
          <p className="text-3xl font-bold">{progress.averageQuizScore.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-4">Topic Completion</h3>
          <div className="h-64 flex justify-center">
             <Pie data={pieData} />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-4">Recent Quizzes</h3>
          <ul>
            {progress.recentQuizResults.map((result, idx) => (
              <li key={idx} className="border-b py-2">
                <span className="font-semibold">{result.topic?.name || 'Topic Deleted'}</span>
                <span className="float-right">{result.score}/{result.totalQuestions}</span>
              </li>
            ))}
            {progress.recentQuizResults.length === 0 && <li>No recent quizzes.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
