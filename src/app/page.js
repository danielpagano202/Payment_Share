"use client"

import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";
import "./styles.css";
import Bar from "./components/bar";
import TimeLineCircle from "./components/timelineCircle";
import { use } from "react";
import Group from "./components/group";
import MainUser from "./components/mainUser";
import "./page.css";
import Modal from "./components/modal";

import { use } from "react";
import Group from "./components/group";
import MainUser from "./components/mainUser"
import "./page.css"
import Modal from "./components/modal";
import React, { useState } from 'react';
import SettingsModal from "./components/settingsModal";
import TransactionModal from "./components/transactionModal";
class User{
  constructor(firstName, lastName, icon){
    this.firstName = firstName;
    this.lastName = lastName;
    this.icon = icon;
  }
}

class PaymentRequest {
  constructor(user, amount, note, date) {
    this.user = user;
    this.amount = amount;
    this.note = note;
    this.date = date;
  }
}

class RequestWithUsersToDo {
  constructor(request, usersToPay) {
    this.request = request;
    this.usersToPay = usersToPay;
  }
}

class GroupData {
  constructor(itemsToBePaid, name) {
    this.itemsToBePaid = itemsToBePaid;
    this.name = name;
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

let exampleOwedRequest = new RequestWithUsersToDo(exampleRequest, [
  users[1],
  users[3],
]);

let secondRequest = new RequestWithUsersToDo(
  new PaymentRequest(users[3], 20, "Got food", new Date(2025, 3, 4)),
  [users[0], users[2], users[1]]
);

let rightSideData = new GroupData(
  [exampleOwedRequest, secondRequest],
  "Friends"
);

function getAmountOwed(groupData, allUsers) {
  const keyValuePairArray = allUsers.map((key) => [key, 0]);
  let userTotals = new Map(keyValuePairArray);

  groupData.itemsToBePaid.forEach((paymentRequest) => {
    paymentRequest.usersToPay.forEach((user) => {
      userTotals.set(
        user,
        userTotals.get(user) +
          paymentRequest.request.amount / (allUsers.length - 1)
      );
    });
  });

  console.log(userTotals);
  console.log(userTotals.entries());

  return userTotals;
}
console.log()
let graphData = getAmountOwed(rightSideData, users);


export default function Home() {
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState();
  const [groupsInfo, setGroupsInfo] = useState([]); //[[groupName, [member1, member2,...]]  ,...]

  const postSubmitAction = (groupName, members) => {
    // console.log("hello from parent");
    setGroupName(groupName);
    setGroupMembers(members);
    setGroupsInfo((prevGroups) => [...prevGroups, [groupName, members]]);

    // console.log(groupsInfo);

    groupsInfo.map((group) => {
      <Group name={group[0]} />;
    });
  };


export default function Home() {//name of the group, searching for member
  return (
    <div className={styles.main}>

      <div style={{ flexGrow: 1 }} className="navigation">
        <MainUser name="Morpheus" />
        <Modal afterSubmit={postSubmitAction} />

        {groupsInfo.map((group, index) => (
          <Group
            key={index} // Always use keys for list items
            name={group[0]}
            members={group[1]} // Pass members array to Group component
          />
        ))}
        
      </div>
      <div className={styles.verticalLine}></div>
      <div style={{ flexGrow: 4 }}>

        <div className={styles.titleRow}>
          <TransactionModal data={{
            requests: rightSideData.itemsToBePaid,
            onPay: (passedRequests) => {console.log(passedRequests)}
          }}/>
          <p className="group-title">{rightSideData.name}</p>
          <SettingsModal data={{
            users: users
          }}/>
        </div>

        <div className="graph" style={{height: 60 * Array.from(graphData.entries()).reduce((min, current) => current[1] < min[1] ? current : min)[1]}}>
          {
            Array.from(graphData.entries()).map(
              (element) => (
                <Bar key={element[0].firstName + element[0].lastName + element[0].icon} data={{
                  value: element[1] * 10,
                  owed: element[1],
                  user: element[0]
                }}/>
              )
            )
          }

        </div>
        <div className="timeline">
          {rightSideData.itemsToBePaid.map((request) => (
            <TimeLineCircle
              key={
                request.request.note +
                request.request.user.firstName +
                request.request.date.toString
              }
              data={{
                request: request,
                users: users,
              }}
            />
          ))}
          <div className="timeline-circle" style={{ padding: "25px" }}></div>
        </div>
      </div>
    </div>
  );
}
