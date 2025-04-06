"use client"
import React, { useEffect, useState } from 'react';
import "./bar.css";

export default function Bar(props) {
  const [height, setHeight] = useState(props.data.value);

  

  return (
    <div className="main-bar">
      <div 
        className="bar-value" 
        style={{ height: `${height}px` }} 
        
      />
      <p>{"$" + props.data.owed.toFixed(2)}</p>
      <img className="bar-image" src={props.data.user.icon} alt="user-icon" />
      <p>{props.data.user.firstName}</p>
    </div>
  );
}
