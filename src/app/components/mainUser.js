import {React} from "react"
import "./mainUser.css"
function MainUser(props){//props should 
    return(
        <div className="mainAccountBlock">
            <div className = "userProfilePicture"></div>
            <h3>{props.name}</h3>
        </div>
    )
}
export default MainUser;