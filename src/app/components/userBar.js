import "./userBar.css";



export default function UserBar(props) {
    return <div className="main-user-bar">
        <img src={props.data.user.icon} class="user-avatar-bar"/>
        <p>{props.data.user.firstName}</p>
    </div>
    
    
}