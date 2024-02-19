import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="container w-50 mt-4">
        <h2 className="text-center mb-4">Top Chefs on RecipeGram</h2>
        <hr className='m0'/>
        {/* ALL THE REPEATING CODE
        <div className="chefDetail cp">
            <div className="detailImg">
                <img className ="detailImgLiteral" src="/pro.jpg" alt="Profile" />
            </div>
            <div className="detailDesc">
                <h4>Ranvijay Singh</h4>
                <h5>Rating: star 5</h5>
            </div>
        </div>
  <hr className='m0'/>key={index}
  */}
        {users.map(({ id, username }) => {
            return(
<div key={id}>
<div className="chefDetail cp" onClick={()=>{navigate(`/home/chefs/${id}`)}}>
            <div className="detailImg">
                <img className ="detailImgLiteral" src="/pro.jpg" alt="Profile" />
            </div>
            <div className="detailDesc">
                <h4>{username}</h4>
                <h5>Rating: star 5</h5>
            </div>
        </div>
  <hr className='m0'/>
</div>   ) 
        })}
       
    </div>
  )
}
