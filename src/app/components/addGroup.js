import {React} from "react"
import "./addGroup.css"
function AddGroup(props){//props should 
    return(
        <div className="userBlock">
            <div className = "groupImage"></div>
            <h3>{props.name}</h3>
        </div>
    )
}
export default AddGroup;