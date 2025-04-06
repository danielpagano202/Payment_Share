"use client"
import React, { useEffect, useState } from 'react';
import "./group.css"
function Group(props){

    const [opacity, setOpacity] = useState(0);
       useEffect(() => {
        setOpacity(1)
      }, [props.data]);

    return(
        <div className="userBlock" style={{opacity: opacity}} onClick={props.click}>
            <div className = "groupImage" style ={{backgroundImage:  `url("https://api.dicebear.com/9.x/glass/svg?seed=${props.name}")`}}></div>
            <h3>{props.name}</h3>
        </div>
    )
}
export default Group;
