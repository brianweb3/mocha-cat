// Toast notification system
let toastContainer = null;

export const initToast = () => {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
};

export const showToast = (message, type = "info", duration = 3000) => {
  initToast();

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: #ffffff;
    border: 4px solid #000000;
    padding: 12px 20px;
    margin-bottom: 10px;
    color: #000000;
    font-family: DynaPuff, serif;
    font-size: 14px;
    box-shadow: none;
    pointer-events: auto;
    animation: slideDown 0.3s ease;
  `;

  if (type === "error") {
    toast.style.borderColor = "#ff0000";
    toast.style.color = "#ff0000";
  } else if (type === "success") {
    toast.style.borderColor = "#ff6600";
    toast.style.color = "#ff6600";
  }

  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideUp 0.3s ease";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
};

// Add CSS animations
if (!document.getElementById("toast-styles")) {
  const style = document.createElement("style");
  style.id = "toast-styles";
  style.textContent = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes slideUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }
  `;
  document.head.appendChild(style);
}
