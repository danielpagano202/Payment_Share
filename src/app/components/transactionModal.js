"use client";
import { useState } from "react";
import "./transactionModal.css";

function TransactionModal(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(true); // default to "Pay"
  const [selectedRequests, setSelectedRequests] = useState([]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Toggle between Pay and Request
  const handleModeSwitch = (mode) => {
    setIsPaying(mode === "pay");
    setSelectedRequests([]); // Clear selected requests when changing mode
  };

  // Handle selecting or deselecting requests
  const handleRequestSelect = (request) => {
    console.log(request);
    setSelectedRequests((prevSelected) =>
      prevSelected.includes(request)
        ? prevSelected.filter((req) => req !== request)
        : [...prevSelected, request]
    );
  };

  // Handle Pay button click
  const handlePay = () => {
    // Call the function passed from props to handle the payment
    console.log(selectedRequests)
    props.data.onPay(selectedRequests);
    setSelectedRequests([]);
    closeModal(); // Reset after payment
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

            {/* Request Mode (for now, just a placeholder) */}
            {!isPaying && (
              <div className="requests-list">
                {/* Placeholder content for Request mode */}
                <p>Request functionality can be added here!</p>
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
