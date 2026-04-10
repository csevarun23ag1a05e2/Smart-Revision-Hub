import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    const { data } = await api.get('/schedules');
    setSchedules(data);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleComplete = async (id) => {
    await api.put(`/schedules/${id}/complete`);
    fetchSchedules();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Revision Schedules</h1>

      <ul className="bg-white rounded shadow divide-y">
        {schedules.map(schedule => {
          const isOverdue = new Date(schedule.scheduledDate) < new Date() && !schedule.completed;
          return (
            <li key={schedule._id} className={`p-4 flex justify-between items-center ${schedule.completed ? 'bg-gray-100' : isOverdue ? 'bg-red-50' : ''}`}>
              <div>
                <span className={`font-semibold ${schedule.completed ? 'line-through text-gray-500' : ''}`}>
                  {schedule.topic?.name || 'Topic Deleted'}
                </span>
                <span className="ml-4 text-sm text-gray-600">
                  Scheduled for: {new Date(schedule.scheduledDate).toLocaleDateString()}
                </span>
                {isOverdue && <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Overdue</span>}
              </div>
              <div>
                {!schedule.completed && (
                  <button onClick={() => handleComplete(schedule._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Mark Complete</button>
                )}
                {schedule.completed && <span className="text-green-600 font-bold">Done</span>}
              </div>
            </li>
          );
        })}
        {schedules.length === 0 && <li className="p-4 text-gray-500">No schedules yet. Add a topic to start!</li>}
      </ul>
    </div>
  );
};

export default Schedules;
