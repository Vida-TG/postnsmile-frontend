import React from 'react';

const Header = ({ user }) => {
  return (
    <div className="header">
      <img src={user.image} alt="User DP" className="avatar" />
      <div className="user-details">
        <h2>{user.username}</h2>
        <h4>{user.email}</h4>
      </div>
    </div>
  );
};

export default Header;
