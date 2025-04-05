import {React} from "react"
import "./addGroup.css"
function AddGroup(props){//props should 
    return(
        <div className = "group">{props.name}</div>
    )
}
export default AddGroup;