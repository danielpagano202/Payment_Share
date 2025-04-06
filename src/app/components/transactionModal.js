"use client";
import { useState } from "react";
import "./transactionModal.css";

function TransactionModal(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(true); // default to "Pay"
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    amount: "",
    note: "",
    date: "",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Toggle between Pay and Request modes
  const handleModeSwitch = (mode) => {
    setIsPaying(mode === "pay");
    setSelectedRequests([]); // Clear selected requests when changing mode
    setNewRequest({ amount: "", note: "", date: "" }); // Reset the new request form
  };

  // Handle selecting or deselecting requests in Pay mode
  const handleRequestSelect = (request) => {
    setSelectedRequests((prevSelected) =>
      prevSelected.includes(request)
        ? prevSelected.filter((req) => req !== request)
        : [...prevSelected, request]
    );
  };

  // Handle Pay button click
  const handlePay = () => {
    props.data.onPay(selectedRequests);
    setSelectedRequests([]); // Reset selected requests after payment
    closeModal(); // Close modal after payment
  };

  // Handle input changes for new request
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prevRequest) => ({
      ...prevRequest,
      [name]: value,
    }));
  };

  // Handle Request button click
  const handleRequest = () => {
    // Create the new request object
    const newReq = {
      request: {
        amount: parseFloat(newRequest.amount),
        note: newRequest.note,
        date: new Date(newRequest.date),
      },
    };
    if(newRequest.amount != "" && newRequest.date != ""){
      // Call the onRequest function passed via props
      props.data.onRequest(newReq);

      // Reset the form after adding the request
      setNewRequest({ amount: "", note: "", date: "" });
      closeModal(); // Close the modal
    }
    
  };

  return (
    <div className="modal_parent">
      {/* Button to open the modal */}
      <button className="modal-button" onClick={openModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
        >
          <path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="overlay">
          <div className="modal">
            <button className="closeButton" onClick={closeModal}>
              &times;
            </button>
            <h2>Pay/Request</h2>

            {/* Pay/Request Mode Toggle */}
            <div className="mode-toggle">
              <button
                className={`mode-btn ${isPaying ? "active" : ""}`}
                onClick={() => handleModeSwitch("pay")}
              >
                Pay
              </button>
              <button
                className={`mode-btn ${!isPaying ? "active" : ""}`}
                onClick={() => handleModeSwitch("request")}
              >
                Request
              </button>
            </div>

            {/* Pay Mode: List of Requests */}
            {isPaying && (
              <div className="requests-list">
                {props.data.requests.map((request) => (
                  <button
                    key={request.request.note}
                    className={`request-btn ${
                      selectedRequests.includes(request) ? "selected" : ""
                    }`}
                    onClick={() => handleRequestSelect(request)}
                  >
                    {`${request.request.note} - $${request.request.amount}`}
                  </button>
                ))}
              </div>
            )}

            {/* Request Mode: Form to Add a Request */}
            {!isPaying && (
              <div className="request-form">
                <label>
                  Amount:  
                  <input
                    type="number"
                    name="amount"
                    className="text-field-request"
                    value={newRequest.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    required
                  />
                </label>
                <br/>
                <label>
                  Note:
                  <input
                    type="text"
                    name="note"
                    value={newRequest.note}
                    onChange={handleInputChange}
                    placeholder="Enter note"
                    className="text-field-request"
                    required
                  />
                </label>
                <br/>
                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={newRequest.date}
                    onChange={handleInputChange}
                    className="calendar-request"
                    required
                  />
                </label>
                <button className="request-btn" onClick={handleRequest}>
                  Add Request
                </button>
              </div>
            )}

            {/* Pay Button */}
            {isPaying && selectedRequests.length > 0 && (
              <button className="pay-btn" onClick={handlePay}>
                Pay Selected
              </button>
            )}
          </div>

          {/* Overlay (to click and close modal) */}
          <div onClick={closeModal} className="clear-overlay"></div>
        </div>
      )}
    </div>
  );
}

export default TransactionModal;
