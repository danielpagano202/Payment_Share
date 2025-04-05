"use client";
import { useState, useRef } from "react";
import styles from "./Modal.module.css";

function Modal({afterSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const groupNameRef = useRef();
  const membersRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const groupName = groupNameRef.current.value;
    const members = membersRef.current.value;//in form : bb,as,cs

    
    const membersArray = members.split(",");

    afterSubmit(groupName,membersArray);
 
  };

  

  return (
    <div className="modal_parent">
      <button className={styles.openButton} onClick={openModal}>
        +
      </button>

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <h2>Add Group</h2>

            <form onSubmit={handleSubmit} action="/action_page.php">
              <input type="text" id="gname" name="gname" ref={groupNameRef} required/>
              <br />
              <br />
              <label for="lname">Add Members</label>
              <br />
              <input
                type="search"
                id="members"
                name="members"
                ref={membersRef}
                required
              />
              <br />
              <br />

              <input
                type="submit"
                
                value="Submit"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
