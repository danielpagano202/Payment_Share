import Image from "next/image";
import styles from "./page.module.css";
import "./styles.css";
import Bar from "./components/bar";
import TimeLineCircle from "./components/timelineCircle";
class User{
  constructor(firstName, lastName, icon){
    this.firstName = firstName;
    this.lastName = lastName;
    this.icon = icon;
  }
}

class PaymentRequest{
  constructor(user, amount, note, date){
    this.user = user;
    this.amount = amount;
    this.note = note;
    this.date = date;
  }
}

class RequestWithUsersToDo{
  constructor(request, usersToPay){
    this.request = request;
    this.usersToPay = usersToPay;
  }
}

class GroupData{
  constructor(itemsToBePaid, name){
    this.itemsToBePaid = itemsToBePaid;
    this.name = name;
  }
}

let users = [
  new User("Aiden", "A", "https://api.dicebear.com/9.x/adventurer/svg?seed=Aiden"),
  new User("Chris", "C", "https://api.dicebear.com/9.x/adventurer/svg?seed=Christopher"),
  new User("Liam", "L", "https://api.dicebear.com/9.x/adventurer/svg?seed=Liam"),
  new User("Robert", "R", "https://api.dicebear.com/9.x/adventurer/svg?seed=Robert")
]

let exampleRequest = new PaymentRequest(
  users[1],
  20,
  "Bought Uber",
  new Date(2025, 2, 3)
);



let exampleOwedRequest = new RequestWithUsersToDo(
  exampleRequest, [
    users[1], users[3]
  ]
);

let secondRequest = new RequestWithUsersToDo(
  new PaymentRequest(
    users[3], 10, "Got food", new Date(2025, 3, 4)
  ),
  [
    users[0], users[2]
  ]
)



let rightSideData = new GroupData(
  [exampleOwedRequest, secondRequest], "Friends"
);

import AddGroup from "./components/addGroup";
export default function Home() {
  return (
    <div className={styles.main}>
      
      <div style={{flexGrow: 1}} className="navigation">
      
        {/*<AddGroup name = "Bob" />*/}
      
        </div> 
      <div className={styles.verticalLine}></div>
      <div style={{flexGrow: 4}}>
        <div className={styles.titleRow}>
          <p>$</p>
          <p>{rightSideData.name}</p>
          <button>Settings</button>
        </div>
        <div className="graph">
          <Bar data={{
            value: 200,
            owed: 20,
            user: users[0]
          }} />
          <Bar data={{
            value: 100,
            owed: 10,
            user: users[1]
          }} />
          <Bar data={{
            value: 150,
            owed: 15,
            user: users[2]
          }} />
          <Bar data={{
            value: 300,
            owed: 30,
            user: users[3]
          }} />
        </div>
        <div className="timeline">
          {rightSideData.itemsToBePaid.map(
            (request) => (
              <TimeLineCircle key={request.request.note + request.request.user.firstName + request.request.date.toString} data={{
                request: request,
                users: users
              }}/>
            )
          )}
          <div className="timeline-circle" style={{padding: "25px"}}>
          </div>
        </div>
      </div>
      
    </div>
  );
}
