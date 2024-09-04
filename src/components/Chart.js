import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const Chart = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/api/data')  // Fetch from your server
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <Line data={data} options={{ /* Chart options */ }} />
    </div>
  );
};

export default Chart;