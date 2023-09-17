import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './profile.css';
import Header from './Header';
import PostBox from './PostBox';
import UserCard from './UserCard';
import logo from "../../assets/logo.png"

const Profile = () => {
    const [ details, setDetails ] = useState({})
    const [ users, setUsers ] = useState([])
    
    const navigate = useNavigate();


    const changeDP = () => {
      navigate("/mint");
    }

    const logout = () => {
      localStorage.removeItem('token');
      navigate("/signup");
    };

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate("/login");
      } else {
        axios.get('https://postns.onrender.com/api/user', { headers: {Authorization: `Bearer ${token}` }})
        .then((response) => {
            setDetails(response.data);
        })
        .catch((error) => {
            console.error('Error fetching details:', error);
        });
      }

      axios.get('https://postns.onrender.com/api/user/all-users')
      .then((response) => {
          console.log(response.data)
          setUsers(response.data);
      })
      .catch((error) => {
          console.error('Error fetching details:', error);
      });

    }, []);

    return (
      <div className="profile">
        <div style={{display:"flex", alignItems:"center", marginBottom:"40px"}}>
          <img src={logo} />
          <div style={{fontFamily:"monospace", textAlign:"center"}}>Post n' Smile</div>
          <div></div>
        </div>
        <Header user={details} />
        <PostBox />
        <div className="user-cards">
          {users.map((user, index) => (
            <UserCard key={index} user={user} />
          ))}
        </div>
        <div className='mint-container profile-btn'>
          <div></div>
          <button className='btn' style={{margin:"50px 10px"}} onClick={changeDP}>Change DP</button>
          <button className='btn' style={{margin:"50px 10px"}} onClick={logout}>Logout</button>
        </div>
      </div>
    );
};

export default Profile;
