import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <img src={user.image} alt={`${user.username}'s Avatar`} className="avatar" />
      <p className="user-name">{user.username}</p>
    </div>
  );
};

export default UserCard;
