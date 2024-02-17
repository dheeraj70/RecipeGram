import React, { useState , useRef, useEffect} from 'react';
import { useLocation , useNavigate, Outlet} from 'react-router-dom';
/*import MyPosts from './MyPosts';
import Post from './Post';
import Profile from './Profile';
import Feed from './Feed';
import MySubscriptions from './MySubscriptions';

*/
export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const profileDrop = useRef(null);
  const profileTab = useRef();
  const profileEdit = useRef();
  const profileSetting = useRef();
  const profileLogOut = useRef();
 

  const [profileClicked, setProfileClicked] = useState(false);

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

  window.addEventListener('click',(e)=>{
      
        if((profileTab.current && !profileTab.current.contains(e.target))&&(profileDrop.current && !profileDrop.current.contains(e.target))){
          setProfileClicked(false);
        }
  })

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



  return ( user&&(
    <>
    {/*
      <h1>Welcome {location.state.user}</h1>
      <button onClick={handleGetRequest}>Make GET Request</button>

      {responseData && (
        <div>
          <h2>Response from GET Request:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
      */}
      <div className="nav">
        <img className='nav_logo' src="/RecipeGram-logos_transparent.png" alt="logo" />
        <div className="nav_elements">
          {/*<button onClick={()=>{navigate("feed")}} className='navbtn'>Feed</button>*/}
          <button onClick={()=>{navigate("subs")}} className='btn btn-secondary'>My Subscriptions</button>
          <button onClick={()=>{navigate("myposts")}} className='btn btn-secondary'>My Posts</button>
          <button onClick={()=>{navigate("newpost")}} className='btn btn-secondary'>Post</button>
          <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    <img className='profile_pic' src="/pro.jpg" alt="profile" />Dropdown button
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item cp" >Edit Profile</a></li>
    <li><a class="dropdown-item cp" >Settings</a></li>
    <li><a class="dropdown-item cp" onClick={handleLogOut}>Log Out</a></li>
  </ul>
</div>
          
          
        </div>
      </div>
{/*This outlet helps to render sub route/ nested route */}
      <Outlet />

      <h1>Welcome {user.username}</h1>
      <button onClick={handleGetRequest}>Make GET Request</button>

      {responseData && (
        <div>
          <h2>Response from GET Request:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
      
    </>)
  );
}

