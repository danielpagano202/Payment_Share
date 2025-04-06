import {React} from "react"
import "./mainUser.css"
function MainUser(props){
    console.log(props);
    return(
        <div className="mainAccountBlock">
            <img src={props.avatar} className="userProfilePicture"/>
            <h3>{props.name}</h3>
        </div>
    )
}
export default MainUser;