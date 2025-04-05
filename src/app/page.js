import Image from "next/image";
import styles from "./page.module.css";
import "./styles.css"
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

class GroupData{
  constructor(itemsToBePaid, name){
    this.itemsToBePaid = itemsToBePaid;
    this.name = name;
  }
}
let exampleRequest = new PaymentRequest(
  new User("Daniel", "Pagano", ""),
  20,
  "Bought Uber",
  ""
)

let rightSideData = new GroupData(
  [exampleRequest], "Friends"
)

import AddGroup from "./components/addGroup";
export default function Home() {
  return (
    <div className={styles.main}>
      <div style={{flexGrow: 1}} className="navigation">
      
        <AddGroup name = "Bob" />
      
        </div> 
      <div className={styles.verticalLine}></div>
      <div style={{flexGrow: 4}}>
        <div className={styles.titleRow}>
          <p>$</p>
          <p>rightSideData.name</p>
          <button>Settings</button>
        </div>
        <div class="graph">
          

        </div>
      </div>
      
    </div>
  );
}
