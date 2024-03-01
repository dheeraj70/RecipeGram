import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ListView from './ListView';


export default function TopChefs() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
      var newUsers=[];
      try {
        const response = await fetch(`http://localhost:8080/topchefs/${page}`, {
          credentials: "include",
        });
        newUsers = await response.json();
        //console.log(newPosts);
        if (newUsers.length === 0) {
          setHasMore(false); // No more posts to load
        } else{
          
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }finally{
        setUsers(prevUsers => [...prevUsers, ...newUsers]);
      }
    };

  useEffect(() => {

    fetchData();
  }, [page]);
  return (
 
    <ListView users={users} title={"Top Chefs on RecipeGram"} next={()=>{setPage(prevPage => prevPage + 1)}} hasmore={hasMore}/>
  )
}
