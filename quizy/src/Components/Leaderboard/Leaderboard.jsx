import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError(null);
        console.log('Fetching leaderboard for quizId:', quizId);
         
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found. Please login.');
        }

        const res = await axios.get(`/api/quizzes/${quizId}/leaderboard`, {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        });
        
        console.log('Leaderboard data:', res.data);
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
        console.error('Error details:', err.response?.data || err.message);
        console.error('Status:', err.response?.status);
        
        if (err.response?.status === 401) {
          setError('Please login to view the leaderboard.');
        } else if (err.response?.status === 403) {
          setError('You are not authorized to view this leaderboard. Only teachers can view leaderboards.');
        } else if (err.response?.status === 404) {
          setError('Quiz not found.');
        } else {
          setError(`Failed to load leaderboard: ${err.response?.data?.message || err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchLeaderboard();
    } else {
      setError('No quiz ID provided');
      setLoading(false);
    }
  }, [quizId]);

  if (loading) return <p>Loading leaderboard...</p>;
  
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;