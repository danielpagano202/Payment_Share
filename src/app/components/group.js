import {React} from "react"
import "./group.css"
function Group(props){//props should 
    //pass it some function to change
    return(
        <div className="userBlock" onClick={props.click}>
            <div className = "groupImage" style ={{backgroundImage:  `url("https://api.dicebear.com/9.x/glass/svg?seed=${props.name}")`}}></div>
            <h3>{props.name}</h3>
        </div>
    )
}
export default Group;
