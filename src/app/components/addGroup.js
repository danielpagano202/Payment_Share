import {React} from "react"
import "./addGroup.css"
function AddGroup(props){//props should 
    return(
        <div className="userBlock">
            <div className = "group"></div>
            <h3>{props.name}</h3>
        </div>
    )
}
export default AddGroup;