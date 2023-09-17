import React from 'react';

const PostBox = () => {
  return (
    <div className="post-box">
      <textarea placeholder="Write a post" className="post-input"></textarea>
      <button className="post-button">Post</button>
    </div>
  );
};

export default PostBox;
