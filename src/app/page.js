import Image from "next/image";
import styles from "./page.module.css";
import AddGroup from "./components/addGroup";
export default function Home() {
  return (
    <div className={styles.main}>
      <div className="navigation">
      
        <AddGroup name = "Bob" />
      
        </div> 
      <div>Right Column</div>
      
    </div>
  );
}
