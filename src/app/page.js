import Image from "next/image";
import styles from "./page.module.css";
import AddGroup from "./components/addGroup";
import MainUser from "./components/mainUser"
import "./page.css"
export default function Home() {//name of the group, searching for member
  return (
    <div className={styles.main}>
      <div className="navigation">
      <MainUser name = "Morpheus"/>
        <AddGroup name = "Bob"  />
        <AddGroup name = "Bob" />
        <AddGroup name = "Bob" />
        
      
        </div> 
      <div>Right Column</div>
      
    </div>
  );
}
