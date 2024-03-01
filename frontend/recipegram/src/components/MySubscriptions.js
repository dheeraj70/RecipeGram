import React, { useEffect, useState } from 'react'
import ListView from './ListView';

export default function MySubscriptions() {

  const [subscriptions,setSubs]=useState([]);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUserSubscriptions = async () => {
    var newUsers=[];
    try {
      const response = await fetch(`http://localhost:8080/subscriptions/${page}`, {
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
      setSubs(prevUsers => [...prevUsers, ...newUsers]);
    }
  };
  useEffect(()=>{
    fetchUserSubscriptions();
  },[page])
  return (
    <ListView users={subscriptions} title={"Your subscriptions"} next={()=>{setPage(prevPage => prevPage + 1)}} hasmore={hasMore}/>
  )
}
