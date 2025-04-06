import "./timelineCircle.css";
import UserBar from "./userBar";

function formatDate(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${month} ${day} ${year}`;
  }

export default function TimeLineCircle(props) {
    if(props.data.request.request.user == null){
        return;
    }
    return <div className="main-circle-group">
        <div className="timeline-title-row">
            <div className="timeline-circle">
                <img className="timeline-avatar" src={props.data.request.request.user != null ? props.data.request.request.user.icon : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" } />
            </div>
            <div className="timeline-title">
                <p className="date-title">{formatDate(props.data.request.request.date)}</p>
                <p className="details-title">{props.data.request.request.user.firstName + " spent $" + props.data.request.request.amount.toString() + ': "' + props.data.request.request.note + '"'}</p>
            </div>
            
        </div>
        <div className="timeline-details">
            <p className="pay-title">Who Still Needs to Pay</p>
            <ul>
                {props.data.request.usersToPay.map(
                    (user) => (
                        <UserBar key={user.firstName + user.lastName} data={{
                            user: user
                        }}/>
                    )
                )}
            </ul>
            
           
        </div>
    </div>
    
    
}