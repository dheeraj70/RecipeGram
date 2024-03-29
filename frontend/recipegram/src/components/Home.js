import React, { useState , useRef, useEffect} from 'react';
import { useLocation , useNavigate, Outlet} from 'react-router-dom';
/*import MyPosts from './MyPosts';
import Post from './Post';
import Profile from './Profile';
import Feed from './Feed';
import MySubscriptions from './MySubscriptions';

*/
export default function Home({setSearchResults}) {
  const location = useLocation();
  const navigate = useNavigate();

  const searchBar = useRef(null);

 

  const [query, setQuery] = useState('');
 

  const [responseData, setResponseData] = useState(null);
  const [user, setUser] = useState(false);
  //const [user,setUser] = useState((location.state)?(location.state.user):false);

  useEffect(() => {
    const ff = async()=>{
      
    try {
      const response = await fetch('http://localhost:8080/',{
        credentials: 'include'
      });
      
      if (response.ok) {
       
        const data = await response.json();
        setUser(data.userr);
        
      }else{
        navigate('/');
      }
      
     
      
    } catch (error) {
      console.error('Error during GET request:', error);
    }
  }
  ff();
  
  }, []);

 const handleEnterSearch= (e)=>{
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

/*
  window.addEventListener('click',(e)=>{
      
        if((profileTab.current && !profileTab.current.contains(e.target))&&(profileDrop.current && !profileDrop.current.contains(e.target))){
          setProfileClicked(false);
        }
  })
*/
  const handleLogOut = async ()=>{

    try{
      const res = await fetch('http://localhost:8080/logout',{
        method: "DELETE",
        credentials: 'include'
      })
      await res.json().then((dat)=>{
        
        console.log(dat);
        alert("You have successfully logged out!")
        navigate('/');
      })
    }catch(err){
      console.log(err);
    }
  }

  const handleGetRequest = async () => {
    try {
      const response = await fetch('http://localhost:8080/',{
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.log(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResponseData(data);
      console.log('GET request successful:', data);
    } catch (error) {
      console.error('Error during GET request:', error);
    }
  };

const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8080/search?query=${query}`,{
        credentials:'include'
      });
      const data = await response.json();
      //console.log(data);
      setSearchResults(data); // Update search results state with the response from the backend
      navigate("search")
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  return ( user&&(
    <>
    
      <div className="nav">
        <img onClick={()=>{navigate("/home")}} className='nav_logo cp' src="/RecipeGram-logos_transparent.png" alt="logo" />
        <div className="nav_elements">
          {/*<button onClick={()=>{navigate("feed")}} className='navbtn'>Feed</button>*/}
          {/*<button className='btn btn-secondary'>My Subscriptions</button>*/}
          <div className="input-group dfm">
  <input onKeyDown={handleEnterSearch}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} className="form-control" placeholder="Search Recipes" aria-label="Search Recipes" aria-describedby="basic-addon2"/>
  <div className="input-group-append">
    <button onClick={handleSearch} className="btn btn-secondary ltbbr" type="button"><i className="fas fa-search"></i></button>
  </div>
</div>
          {(window.innerWidth > 1024)&&(<><button onClick={()=>{navigate("topchefs")}} className='btn btn-secondary navbtn'>Top Chefs</button>
          <button onClick={()=>{navigate("newpost")}} className='btn btn-secondary navbtn'>Post</button></>)}
          <div className="dropdown">
  <button className="btn btn-secondary dropdown-toggle profileBtn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    <img className='profile_pic' src="/pro.jpg" alt="profile" />Profile
  </button>
  <ul className="dropdown-menu">
  <li><a className="dropdown-item cp" onClick={()=>{navigate("myposts")}}>My Profile</a></li>
  <li><a className="dropdown-item cp" onClick={()=>{navigate("subs")}} >My Subscriptions</a></li>
    <li><a className="dropdown-item cp" onClick={()=>{navigate("editprofile")}} >Edit Profile</a></li>
   {/* IN FUTURE VERSIONS::::
   
   <li><a className="dropdown-item cp" >Settings</a></li> */}
    <li><a className="dropdown-item cp" onClick={handleLogOut}>Log Out</a></li>
  </ul>
</div>
          
          
        </div>
      </div>
{/*This outlet helps to render sub route/ nested route */}
      <Outlet />
<div className="mobTabs">
<button onClick={()=>{navigate("topchefs")}} className='btn btn-secondary navbtn'><i className="fa-solid fa-compass"></i> Explore</button>
          <button onClick={()=>{navigate("newpost")}} className='btn btn-secondary navbtn'><i className="fa-solid fa-utensils"></i> Post Recipe</button>
         
</div>



{/*Get Request btn for testing


      <h1>Welcome {user.username}</h1>
      <button onClick={handleGetRequest}>Make GET Request</button>

      {responseData && (
        <div>
          <h2>Response from GET Request:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
      */}
    </>)
  );
}

