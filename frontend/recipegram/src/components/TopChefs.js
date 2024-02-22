import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ListView from './ListView';

export default function TopChefs() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/topchefs'); // Assuming your React app is served from the same origin as your Node.js server
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
 
    <ListView users={users} title={"Top Chefs on RecipeGram"} />
  )
}
