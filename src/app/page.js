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
  const [users, setUsers] = useState([]); // Start with an empty array for users
  const [rightSideData, setRightSideData] = useState(new GroupData([], "Friends", ""));
  const [currentUser, setCurrentUser] = useState(null); // Start with null, will set after users are loaded

  const groupName = "Friends"; // Hardcoded group name

  // Fetch the data from PocketBase and update the users state
  async function updateRightSideData(groupToFind) {
    const resultList = await pb.collection('Groups').getList(1, 50, {
      filter: `name = "${groupToFind}"`,
      expand: "users, transactions"
    });

    // Map the users into state
    const updatedUsers = Array.from(resultList.items[0].expand.users).map(value => {
      return new User(value.firstName, value.lastName, value.icon, value.id);
    });

    // Set users and set the currentUser
    setUsers(updatedUsers);
    setCurrentUser(updatedUsers[0]); // Set the first user as currentUser

    // Create a map from users by their ids
    const usersMap = new Map(updatedUsers.map(user => [user.id, user]));

    // Map transactions
    let transactions = Array.from(resultList.items[0].expand.transactions).map(value => {
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

    // Sort transactions by date
    transactions = transactions.sort((a, b) => new Date(b.request.date) - new Date(a.request.date));

    // Set the right-side data with new transactions
    setRightSideData(new GroupData(transactions, "Friends", resultList.items[0].id));
  }

  useEffect(() => {
    updateRightSideData(groupName);
  }, []); // Empty dependency ensures this runs only once

  function getAmountOwed(groupData, allUsers) {
    const keyValuePairArray = allUsers.map(key => [key, 0]);
    let userTotals = new Map(keyValuePairArray);

    groupData.itemsToBePaid.forEach(paymentRequest => {
      paymentRequest.usersToPay.forEach(user => {
        userTotals.set(user, userTotals.get(user) + paymentRequest.request.amount / (allUsers.length - 1));
      });
    });

    return userTotals;
  }

  const graphData = getAmountOwed(rightSideData, users);
  const minHeight = 10 * Math.max(...Array.from(graphData.values())) + 105;

  return (
    <div className={styles.main}>
      <div style={{ flexGrow: 1 }} className="navigation scroll-section">
        <MainUser name="Morpheus" />
        <Modal afterSubmit={postSubmitAction} />

        {groupsInfo.map((groupObj, index) => (
          
          <Group
            key={index} 
            name={groupObj.groupData.name}
            members={groupObj.members}
            click ={changeGroup}
          />

        ))}
        
      </div>
      <div className={styles.verticalLine}></div>
      <div style={{ flexGrow: 4 }} className="scroll-section">
        <div className={styles.titleRow}>
          <TransactionModal
            data={{
              requests: rightSideData.itemsToBePaid.filter(value => value.usersToPay.includes(currentUser)),
              onPay: passedRequests => {
                const batch = pb.createBatch();
                passedRequests.forEach(request => {
                  batch.collection("Transactions").update(request.id, {
                    "usersToPay-": currentUser.id
                  });
                });
                batch.send();
              },
              onRequest: async data => {
                const transactionRecord = await pb.collection("Transactions").create({
                  note: data.request.note,
                  amount: data.request.amount,
                  date: data.request.date,
                  user: currentUser.id,
                  usersToPay: users.filter(user => user.id !== currentUser.id).map(user => user.id)
                });

                pb.collection("Groups").update(rightSideData.id, {
                  "transactions+": transactionRecord.id
                });
              }
            }}
          />
          <p className="group-title">{rightSideData.name}</p>
          <SettingsModal data={{ users: [] }} />
        </div>
        <div className="graph" style={{ height: Math.max(minHeight, 400) }}>
          {Array.from(graphData.entries()).map(([user, owedAmount]) => (
            <Bar key={user.id} data={{ value: 5 + owedAmount * 5, owed: owedAmount, user }} />
          ))}
        </div>
        <div className="timeline">
          {rightSideData.itemsToBePaid.map(request => (
            <TimeLineCircle key={request.request.note + request.request.user.firstName + request.request.date.toString()} data={{ request, users }} />
          ))}
          {rightSideData.itemsToBePaid.length === 0 && <div><p className="sectionTitle">No payments made yet!</p></div>}

        </div>
      </div>
    </div>
  );
}
