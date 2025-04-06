"use client"
import Image from "next/image";
import styles from "./page.module.css";
import React, { use } from 'react';
import "./styles.css";
import Bar from "./components/bar";
import TimeLineCircle from "./components/timelineCircle";
import Group from "./components/group";
import MainUser from "./components/mainUser"
import "./page.css"
import Modal from "./components/modal";
import SettingsModal from "./components/settingsModal";
import TransactionModal from "./components/transactionModal";

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

class User{
  constructor(firstName, lastName, icon, id = ""){
    this.firstName = firstName;
    this.lastName = lastName;
    this.icon = icon;
    this.id = id;
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
  constructor(request, usersToPay, id = ""){
    this.request = request;
    this.usersToPay = usersToPay;
    this.id = id;
  }
}

class GroupData{
  constructor(itemsToBePaid, name, id = ""){
    this.itemsToBePaid = itemsToBePaid;
    this.name = name;
    this.id = id;
  }
}

let users = [
  new User("Aiden", "A", "https://api.dicebear.com/9.x/thumbs/svg?seed=Aiden"),
  new User("Chris", "C", "https://api.dicebear.com/9.x/thumbs/svg?seed=Christopher"),
  new User("Liam", "L", "https://api.dicebear.com/9.x/thumbs/svg?seed=Liam"),
  new User("Robert", "R", "https://api.dicebear.com/9.x/thumbs/svg?seed=Robert")
]

let exampleRequest = new PaymentRequest(
  users[1],
  40,
  "Bought Uber",
  new Date(2025, 2, 3)
);



let rightSideData = new GroupData(
  [], "Friends", ""
);


const resultList = await pb.collection('Groups').getList(1, 50, {
  filter: 'name = "Friends"',
  expand: "users, transactions"
});

users = Array.from(resultList.items[0].expand.users).map(
  (value) => {
    return new User(value.firstName, value.lastName, value.icon, value.id)
  }
);

let usersMap = new Map(
  users.map((user) => [user.id, user])
);

let currentUser = users[0];

let transactions = Array.from(resultList.items[0].expand.transactions).map(
  (value) => {
    return new RequestWithUsersToDo(
      new PaymentRequest(
        usersMap.get(value.user), value.amount, value.note, new Date(value.date)
      ), Array.from(value.usersToPay).map(
        (value) => {return usersMap.get(value)}
      ),
      value.id
    )
  }
);

rightSideData = new GroupData(
  transactions, "Friends", resultList.items[0].id
)


function getAmountOwed(groupData, allUsers){
  const keyValuePairArray = allUsers.map((key) => [key, 0]);
  let userTotals = new Map(
    keyValuePairArray
  );

  groupData.itemsToBePaid.forEach(paymentRequest => {
    paymentRequest.usersToPay.forEach(
      user => {
        userTotals.set(user, userTotals.get(user) + (paymentRequest.request.amount / (allUsers.length - 1)));
      }
    )
  });
  return userTotals;
}
let graphData = getAmountOwed(rightSideData, users);
let minHeight = 60 * Array.from(graphData.entries()).reduce((min, current) => current[1] < min[1] ? current : min)[1];
export default function Home() {//name of the group, searching for member
  return (
    <div className={styles.main}>
      

      <div style={{flexGrow: 1}} className="navigation scroll-section">
        <MainUser name = "Morpheus"/>
        <Modal/>
        <Group name = "Bob"  />
        <Group name = "Bob" />
        <Group name = "Bob" />
        <Group name = "Bob" />
        <Group name = "Bob" />
        <Group name = "Bob" />
        <Group name = "Bob" />
        <Group name = "Bob" />
        <Group name = "Bob" />
      </div> 
      <div className={styles.verticalLine}></div>
      <div style={{flexGrow: 4}} className="scroll-section">
        <div className={styles.titleRow}>
          <TransactionModal data={{
            requests: Array.from(rightSideData.itemsToBePaid).filter((value) => Array.from(value.usersToPay).includes(currentUser)),
            onPay: (passedRequests) => {
              console.log(currentUser);
              const batch = pb.createBatch();
              passedRequests.forEach(
                (request) => {
                 
                  console.log(request);
                  batch.collection("Transactions").update(
                    request.id, {
                      "usersToPay-": currentUser.id
                    }
                  )
                }
              );
              batch.send();
            },
            onRequest: async (data)  => {
              let transactionRecord = await pb.collection("Transactions").create(
                {
                  "note": data.request.note,
                  "amount": data.request.amount,
                  "date": data.request.date,
                  "user": currentUser.id,
                  "usersToPay": users.filter(
                    (user) => user.id != currentUser.id
                  ).map(
                    (user) => user.id
                  )
                }
              );

              pb.collection("Groups").update(
                rightSideData.id, {
                  "transactions+" : transactionRecord.id
                }
              );

            }
          }}/>
          <p className="group-title">{rightSideData.name}</p>
          <SettingsModal data={{
            users: users
          }}/>
        </div>
        <div className="graph" style={{height: minHeight < 400 ? 400 : minHeight}}>
          {
            Array.from(graphData.entries()).map(
              (element) => (
                <Bar key={element[0].firstName + element[0].lastName + element[0].icon} data={{
                  value: 5 + (element[1] * 10),
                  owed: element[1],
                  user: element[0]
                }}/>
              )
            )
          }
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
        {
          rightSideData.itemsToBePaid.length != 0 ? 
            <div className="timeline-circle" style={{padding: "25px"}}></div> : 
            <div>
              <p className="sectionTitle">
                No payments made yet!
              </p>
            </div>
        }
          
        </div>
      </div>
      
    </div>
  );
}
