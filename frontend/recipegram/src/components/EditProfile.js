import React, { useEffect, useState } from 'react';

export default function EditProfile() {
  const [userData, setUserData] = useState({
    user_name: '',
    iglink: '',
    ytlink: '',
    lilink: '',
    twlink: ''
  });

  useEffect(() => {
    const fetchUserDesc = async () => {
      try {
        const res = await fetch('http://localhost:8080/userdesc', {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user description');
        }

        const data = await res.json();
        setUserData(prevUserData => ({
          ...prevUserData,
          user_name: data.username,
          iglink: data.iglink,
          ytlink: data.ytlink,
          lilink: data.lilink,
          twlink: data.twlink
        }));
      } catch (error) {
        console.error('Error fetching user description:', error);
      }
    };

    fetchUserDesc();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/userdesc', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Profile updated successfully');
      }else if(response.status === 403){
        alert('Username already exists!');
      } 
      else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mobcont">
      <div className="propic-update mt-4">
        <img src="/pro.jpg" alt="your profile pic" className="editPropic" />
        <div className="d-flex flex-column justify-content-center">
          <h2>Choose new profile picture</h2>
          <input disabled type="file" name="profilepic" id="profilepic" />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-4">
        <div className="form-group row editText">
          <label htmlFor="user_name" className="col-sm-2 col-form-label col-form-label-sm editLabel">
            User Name
          </label>
          <div className="col-sm-10 editWidth">
            <input
              type="text"
              className="form-control form-control-sm editTextField"
              id="user_name"
              placeholder="User Name"
              value={userData.user_name}
              onChange={(e) => setUserData(prevUserData => ({ ...prevUserData, user_name: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-group row editText">
          <label htmlFor="ig" className="col-sm-2 col-form-label col-form-label-sm editLabel">
            Instagram Profile
          </label>
          <div className="col-sm-10 editWidth">
            <input
              name="iglink"
              type="text"
              className="form-control form-control-sm editTextField"
              id="ig"
              placeholder="Instagram profile"
              value={userData.iglink}
              onChange={(e) => setUserData(prevUserData => ({ ...prevUserData, iglink: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-group row editText">
          <label htmlFor="yt" className="col-sm-2 col-form-label col-form-label-sm editLabel">
            Youtube Profile
          </label>
          <div className="col-sm-10 editWidth">
            <input
              name="ytlink"
              type="text"
              className="form-control form-control-sm editTextField"
              id="yt"
              placeholder="Youtube profile"
              value={userData.ytlink}
              onChange={(e) => setUserData(prevUserData => ({ ...prevUserData, ytlink: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-group row editText">
          <label htmlFor="li" className="col-sm-2 col-form-label col-form-label-sm editLabel">
            LinkedIn Profile
          </label>
          <div className="col-sm-10 editWidth">
            <input
              name="lilink"
              type="text"
              className="form-control form-control-sm editTextField"
              id="li"
              placeholder="LinkedIn Profile"
              value={userData.lilink}
              onChange={(e) => setUserData(prevUserData => ({ ...prevUserData, lilink: e.target.value }))}
            />
          </div>
        </div>
        <div className="form-group row editText">
          <label htmlFor="tweet" className="col-sm-2 col-form-label col-form-label-sm editLabel">
            Twitter Profile
          </label>
          <div className="col-sm-10 editWidth">
            <input
              name="twlink"
              type="text"
              className="form-control form-control-sm editTextField"
              id="tweet"
              placeholder="Twitter Profile"
              value={userData.twlink}
              onChange={(e) => setUserData(prevUserData => ({ ...prevUserData, twlink: e.target.value }))}
            />
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-secondary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
