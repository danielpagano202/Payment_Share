import Image from "next/image";
import styles from "./page.module.css";
import Group from "./components/group";
import MainUser from "./components/mainUser"
import "./page.css"
import Modal from "./components/modal";
export default function Home() {//name of the group, searching for member
  return (
    <div className={styles.main}>
      <div className="navigation">
      
      <MainUser name = "Morpheus"/>
        <Modal/>
        <Group name = "Bob"  />
        <Group name = "Bob" />
        <Group name = "Bob" />
        
      
        </div> 
      <div>Right Column</div>
      
    </div>
  );
}
