import "./bar.css";
export default function Bar(props) {
    return <div className="main-bar">
        <div className="bar-value" style={{height: props.data.value.toString() + "px",}}>
        
    </div>
    <p>{"$" + props.data.owed.toString()}</p>
    <img src={props.data.user.icon}></img>
    <p>{props.data.user.firstName}</p>
    </div>
    
    
}