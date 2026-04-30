export default function SettingsModal({
  settingsOpen,
  onClose,
  handleSubmit,
  showUserMessages,
  setShowUserMessages,
  showSidebar,
  setShowSidebar,
  showSendButton,
  setShowSendButton,
  lightMode,
  setLightMode,
}) {
  if (!settingsOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h1>Settings</h1>
        <div className="form-div">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <label>
              Light Mode:
              <input
                type="checkbox"
                name="usermessages"
                checked={lightMode}
                onChange={(e) => setLightMode(e.target.checked)}
              />
            </label>
            <label>
              User Messages:
              <input
                type="checkbox"
                name="usermessages"
                checked={showUserMessages}
                onChange={(e) => setShowUserMessages(e.target.checked)}
              />
            </label>
            <label>
              Sidebar:
              <input
                type="checkbox"
                name="sidebar"
                checked={showSidebar}
                onChange={(e) => setShowSidebar(e.target.checked)}
              />
            </label>
            <label>
              Send Button:
              <input
                type="checkbox"
                name="sendbutton"
                checked={showSendButton}
                onChange={(e) => setShowSendButton(e.target.checked)}
              />
            </label>
            <div className="modal-button-div">
              <button
                type="submit"
                className="modal-button wide-button save-button"
              >
                Save
              </button>
              <button
                className="modal-button wide-button close-button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
