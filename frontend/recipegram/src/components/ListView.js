import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListView({users, title}) {
    const navigate = useNavigate();
  return (
    <div className="container w-50 mt-4">
        <h2 className="text-center mb-4">{title}</h2>
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
        {(users.length < 1)?(<div className='text-center mt-3 mb-3'>No results to show</div>):(users.map(({ id, username }) => {
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
        }))}
       
    </div>
  )
}
