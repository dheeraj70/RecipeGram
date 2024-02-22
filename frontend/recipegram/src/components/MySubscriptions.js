import React, { useEffect, useState } from 'react'
import ListView from './ListView';

export default function MySubscriptions() {

  const [subscriptions,setSubs]=useState([]);
  useEffect(()=>{
    const fetchUserSubscriptions = async()=>{
      const res = await fetch('http://localhost:8080/subscriptions',{
      credentials: 'include',
    })
    var data = await res.json();
    //console.log(data);
    setSubs(data);
    }
    fetchUserSubscriptions();
  },[])
  return (
    <ListView users={subscriptions} title={"Your subscriptions"}/>
  )
}
