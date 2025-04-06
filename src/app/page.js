"use client"
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import "./styles.css";
import Bar from "./components/bar";
import TimeLineCircle from "./components/timelineCircle";
import Group from "./components/group";
import MainUser from "./components/mainUser";
import "./page.css";
import Modal from "./components/modal";
import SettingsModal from "./components/settingsModal";
import TransactionModal from "./components/transactionModal";
import SignInModal from "./components/signin";
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Define Classes
class User {
  constructor(firstName, lastName, icon, id = "") {
    this.firstName = firstName;
    this.lastName = lastName;
    this.icon = icon;
    this.id = id;
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
  constructor(request, usersToPay, id = "") {
    this.request = request;
    this.usersToPay = usersToPay;
    this.id = id;
  }
}

class GroupData {
  constructor(itemsToBePaid, name, id = "") {
    this.itemsToBePaid = itemsToBePaid;
    this.name = name;
    this.id = id;
  }
}

export default function Home() {
  const [groupTabName, setGroupTabName] = useState("");
  const [groupMembers, setGroupMembers] = useState();
  const [groupsInfo, setGroupsInfo] = useState([]); //[[groupName, [member1, member2,...]]  ,...]

  const postSubmitAction = (groupTabName, members) => {
    const newGroup = new GroupData([],groupTabName)
    setGroupTabName(groupTabName);
    setGroupMembers(members);
    setGroupsInfo((prevGroups) => [...prevGroups, {
      groupData: newGroup,
      members: members
    }]);
  };

  const [users, setUsers] = useState([]); // Start with an empty array for users
  const [rightSideData, setRightSideData] = useState(new GroupData([], "No Group Selected", ""));
  const [currentUser, setCurrentUser] = useState(null); // Start with null, will set after users are loaded



  let groupName = ""; // Hardcoded group name

  // Fetch the data from PocketBase and update the users state
  async function updateRightSideData(groupToFind) {
    const resultList = await pb.collection('Groups').getList(1, 50, {
      filter: `name = "${groupToFind}"`,
      expand: "users, transactions"
    });

    if(resultList.length == 0){
      return;
    }

    // Map the users into state
    const updatedUsers = Array.from(resultList.items[0].expand.users).map(value => {
      return new User(value.firstName, value.lastName, value.icon, value.id);
    });

    groupName = groupToFind;
    
    setUsers(updatedUsers);
    // Create a map from users by their ids
    const usersMap = new Map(updatedUsers.map(user => [user.id, user]));
    let transactions = [];
    if(resultList.items[0].expand.transactions != undefined){
      transactions = Array.from(resultList.items[0].expand.transactions).map(value => {
        return new RequestWithUsersToDo(
          new PaymentRequest(
            usersMap.get(value.user),
            value.amount,
            value.note,
            new Date(value.date)
          ),
          Array.from(value.usersToPay).map(user => usersMap.get(user)),
          value.id
        );
      });
    }
    // Sort transactions by date
    transactions = transactions.sort((a, b) => new Date(b.request.date) - new Date(a.request.date));

    // Set the right-side data with new transactions
    setRightSideData(new GroupData(transactions, groupToFind, resultList.items[0].id));
    

  }

  function getAmountOwed(groupData, allUsers) {
    const keyValuePairArray = allUsers.map(key => [key, 0]);
    let userTotals = new Map(keyValuePairArray);
    groupData.itemsToBePaid.forEach(paymentRequest => {
      paymentRequest.usersToPay.forEach(user => {
        userTotals.set(user, userTotals.get(user) + paymentRequest.request.amount / (allUsers.length));
      });
    });

    return userTotals;


  }

  async function signIn(username, password){
    const authData = await pb.collection('users').authWithPassword(
      username,
      password,
    );

    if(authData.record == null){
      return;
    }

    let userFirstName = authData.record.firstName;
    let userLastName = authData.record.lastName;
    let userIcon = authData.record.icon;
    let userID = authData.record.id;

    let groupUser = new User(userFirstName, userLastName, userIcon, userID)
    setCurrentUser(groupUser);
    await getGroups(groupUser);
  }

  async function getGroups(userOfGroups){

    if(userOfGroups == null){
      return;
    }
    const resultList = await pb.collection('Groups').getList(1, 50, {
      filter: `users ~ "${userOfGroups.id}"`,
      expand: "users, transactions"
    });


    setGroupsInfo(resultList.items.map(
      (record) => {
        return {
          groupData: new GroupData(
            [], record.name
          ),
          members: ""
        }
      }
    ));

  }

  const graphData = getAmountOwed(rightSideData, users);
  const minHeight = 8 * Math.max(...Array.from(graphData.values())) + 105;


  return (
    <div className={styles.main}>
      <div style={{ flexGrow: 1 }} className="navigation scroll-section">
        
        <MainUser name={currentUser != null ? currentUser.firstName : "Sign In"} avatar={currentUser != null ? currentUser.icon : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}/>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <SignInModal onSubmit={
            (signInData) => {
                signIn(signInData.email, signInData.password);
            }
          }/>
          <Modal afterSubmit={postSubmitAction} />
        </div>
        

        {groupsInfo.length != 0 ? groupsInfo.map((groupObj, index) => (

          <Group
            key={index} 
            name={groupObj.groupData.name}
            members={groupObj.members}
            click={() => {updateRightSideData(groupObj.groupData.name)}}
          />

        )) : <p className="sectionTitle">Sign In to View Groups</p>}

      </div>

      <div className={styles.verticalLine}></div>
      <div style={{ flexGrow: 4 }} className="scroll-section">
        <div className={styles.titleRow}>
          <TransactionModal
            data={{
              requests: rightSideData.itemsToBePaid.filter(value => value.usersToPay.filter(user => user.id == currentUser.id).length == 1),
              onPay: async (passedRequests) => {
                const batch = pb.createBatch();
                passedRequests.forEach(request => {
                  batch.collection("Transactions").update(request.id, {
                    "usersToPay-": currentUser.id
                  });
                });
                await batch.send();
                updateRightSideData(rightSideData.name);
              },
              onRequest: async data => {
                const transactionRecord = await pb.collection("Transactions").create({
                  note: data.request.note,
                  amount: data.request.amount,
                  date: data.request.date,
                  user: currentUser.id,
                  usersToPay: users.filter(user => user.id !== currentUser.id).map(user => user.id)
                });

                await pb.collection("Groups").update(rightSideData.id, {
                  "transactions+": transactionRecord.id
                });
                updateRightSideData(rightSideData.name);
              }
            }}
          />

          <p className="group-title">{rightSideData.name}</p>
          <SettingsModal data={{ users: [] }} />


        </div>
        <div className="graph" style={{ height: Math.max(minHeight, 500) }}>
          {Array.from(graphData.entries()).map(([user, owedAmount]) => (
            <Bar key={user.id} data={{ value: 5 + owedAmount * 5, owed: owedAmount, user }} />
          ))}



        </div>
        {
          users != null ?  <div className="timeline">
          {rightSideData.itemsToBePaid.map(request => (
            <TimeLineCircle key={request.request.note + request.request.date.toString()} data={{ request, users }} />
          ))}
          {rightSideData.itemsToBePaid.length !== 0 ? <div className="timeline-circle" style={{padding: "25px"}}></div> : <div><p className="sectionTitle">No payments made yet!</p></div>}

        </div> : <div></div>
        }
       
      </div>

    </div>
  );
}