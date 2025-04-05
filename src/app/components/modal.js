"use client"
import { useState } from "react";
import styles from "./Modal.module.css";

function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="modal_parent">
      {/* Button to open the modal */}
      <button className={styles.openButton} onClick={openModal}>
        +
      </button>

      {/* Modal */}
      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <h2>Add Group</h2>
            
            <form action="/action_page.php">
              
              <input type="text" id="fname" name="fname"/><br/><br/>
              <label for="lname">Add Members</label><br/>
              <input type="search" id="lname" name="lname"/><br/><br/>
              <input type="submit" value="Submit"/>
          </form>



          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;