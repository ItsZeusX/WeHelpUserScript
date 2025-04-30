// ==UserScript==
// @name         Enable Selects and Buttons + Add Download Buttons with Correct Filename on watt-else.pro
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Enables inputs and adds download buttons that fetch and save files with correct filenames on watt-else.pro (PDFs, images, etc.)
// @author       You
// @match        https://watt-else.pro/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ItsZeusX/WeHelpUserScript/refs/heads/main/script.js
// @downloadURL  https://raw.githubusercontent.com/ItsZeusX/WeHelpUserScript/refs/heads/main/script.js
// ==/UserScript==

(function () {
  "use strict";

  // Load Poppins font from Google Fonts
  function loadPoppinsFont() {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap";
    document.head.appendChild(fontLink);
  }

  // Load font as soon as script runs
  loadPoppinsFont();

  // Create and inject toast container
  function createToastContainer() {
    const container = document.getElementById("toast-container");
    if (!container) {
      const toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.style.position = "fixed";
      toastContainer.style.bottom = "20px";
      toastContainer.style.left = "20px";
      toastContainer.style.zIndex = "9999";
      toastContainer.style.display = "flex";
      toastContainer.style.flexDirection = "column";
      toastContainer.style.gap = "10px";
      toastContainer.style.maxWidth = "400px";
      document.body.appendChild(toastContainer);
    }
  }

  // Initialize toast container
  createToastContainer();

  /**
   * Show a styled toast notification
   * @param {string} message - The message to display in the toast
   * @param {string} type - The type of toast: 'success', 'error', 'warning', or 'info'
   * @param {number} duration - Duration in milliseconds before the toast disappears
   * @param {string} title - Optional title for the toast
   */
  function showToast(message, type = "info", duration = 3000, title = "") {
    const container = document.getElementById("toast-container");

    // Create toast element
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.style.padding = "16px 20px";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "-2px 0px 74px -18px rgba(0,0,0,0.75)";
    toast.style.webkitBoxShadow = "-2px 0px 74px -18px rgba(0,0,0,0.75)";
    toast.style.mozBoxShadow = "-2px 0px 74px -18px rgba(0,0,0,0.75)";
    toast.style.fontFamily = "'Poppins', Arial, sans-serif";
    toast.style.fontSize = "16px";
    toast.style.lineHeight = "1.4";
    toast.style.minWidth = "300px";
    toast.style.maxWidth = "400px";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease-in";
    toast.style.display = "flex";
    toast.style.alignItems = "flex-start";
    toast.style.gap = "12px";
    toast.style.position = "relative";

    // Add pulsing red circle
    const pulsingCircle = document.createElement("div");
    pulsingCircle.style.position = "absolute";
    pulsingCircle.style.top = "-6px";
    pulsingCircle.style.left = "-8px";
    pulsingCircle.style.width = "16px";
    pulsingCircle.style.height = "16px";
    pulsingCircle.style.borderRadius = "50%";
    pulsingCircle.style.backgroundColor = "#FF4136";
    pulsingCircle.style.animation = "pulse-animation 1.5s infinite";

    // Add the CSS animation if it doesn't exist already
    if (!document.getElementById("pulse-animation-style")) {
      const style = document.createElement("style");
      style.id = "pulse-animation-style";
      style.textContent = `
        @keyframes pulse-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 65, 54, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 65, 54, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 65, 54, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Set color based on type
    let iconHTML, bgColor;
    switch (type.toLowerCase()) {
      case "success":
        bgColor = "#fff";
        iconHTML =
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#4CAF50" fill-opacity="0.2"/><path d="M9 12.5L11 14.5L15.5 10" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        if (!title) title = "Success";
        break;
      case "error":
        bgColor = "#fff";
        iconHTML =
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#F44336" fill-opacity="0.2"/><path d="M15 9L9 15M9 9L15 15" stroke="#F44336" stroke-width="2" stroke-linecap="round"/></svg>';
        if (!title) title = "Attention";
        break;
      case "warning":
        bgColor = "#fff";
        iconHTML =
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#FF9800" fill-opacity="0.2"/><path d="M12 8V13M12 16V16.01" stroke="#FF9800" stroke-width="2" stroke-linecap="round"/></svg>';
        if (!title) title = "Attention";
        break;
      case "info":
      default:
        bgColor = "#fff";
        iconHTML =
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#2196F3" fill-opacity="0.2"/><path d="M12 8V16M12 8H12.01" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/></svg>';
        if (!title) title = "Information";
        break;
    }

    toast.style.backgroundColor = bgColor;

    // Create icon container
    const iconContainer = document.createElement("div");
    iconContainer.style.flexShrink = "0";
    iconContainer.innerHTML = iconHTML;

    // Create content container
    const contentContainer = document.createElement("div");
    contentContainer.style.flex = "1";

    // Create title element if provided
    const titleElement = document.createElement("div");
    titleElement.textContent = title;
    titleElement.style.fontWeight = "600";
    titleElement.style.marginBottom = "4px";
    titleElement.style.fontSize = "18px";
    titleElement.style.fontFamily = "'Poppins', Arial, sans-serif";
    contentContainer.appendChild(titleElement);

    // Create message element
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.style.color = "#333";
    messageElement.style.fontFamily = "'Poppins', Arial, sans-serif";
    contentContainer.appendChild(messageElement);

    // Add close button
    const closeBtn = document.createElement("div");
    closeBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.opacity = "0.6";
    closeBtn.style.padding = "4px";
    closeBtn.onclick = function () {
      container.removeChild(toast);
    };

    // Add all elements to toast
    toast.appendChild(iconContainer);
    toast.appendChild(contentContainer);
    toast.appendChild(closeBtn);
    toast.appendChild(pulsingCircle); // Add pulsing circle to toast

    // Add toast to container and make it visible
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "1";
    }, 10);

    // Remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
          if (toast.parentNode === container) {
            container.removeChild(toast);
          }
        }, 300);
      }, duration);
    }

    return toast;
  }

  /**
   * Checks if a div with the specified selector contains any of the specified strings
   * @param {string[]} searchStrings - Array of strings to search for in the div
   * @param {string} targetSelector - CSS selector for the target element to search in
   * @return {boolean} - True if any of the strings are found, false otherwise
   */
  function checkDivForStrings(
    searchStrings,
    targetSelector = ".portlet-body.affectation"
  ) {
    const targetDiv = document.querySelector(targetSelector);

    if (!targetDiv) {
      console.log(`Target div not found: ${targetSelector}`);
      return false;
    }

    const divText = targetDiv.innerText || targetDiv.textContent || "";

    for (const str of searchStrings) {
      if (divText.includes(str)) {
        console.log(`Found match: "${str}" in target div`);
        return true;
      }
    }

    console.log(`No matches found in target div: ${targetSelector}`);
    return false;
  }

  /**
   * Checks if the case belongs to a broker and shows a toast notification if it does
   * @param {string[]} brokerNames - Array of broker names to check for
   * @param {string} targetSelector - CSS selector for the target element to search in
   * @return {boolean} - True if broker name is found, false otherwise
   */
  function checkBroker(brokerNames) {
    const result = checkDivForStrings(brokerNames, ".portlet-body.affectation");

    if (result) {
      // Find which broker name matched
      const targetDiv = document.querySelector(".portlet-body.affectation");
      const divText = targetDiv.innerText || targetDiv.textContent || "";

      for (const brokerName of brokerNames) {
        if (divText.includes(brokerName)) {
          showToast(
            `Cette affaire appartient au courtier ${brokerName}, il faut la remonter à l'animateur avant de valider`,
            "error",
            500000
          );
          break;
        }
      }
    }

    return result;
  }

  /**
   * Checks if the decommission is for a broker that should not be processed until a certain date
   * and shows a toast notification if it does
   * @param {string[]} brokerNames - Array of broker names to check for
   * @return {boolean} - True if broker name is found, false otherwise
   */
  function checkBrokersForDecom(brokerNames) {
    // Only run on the specific decommission URL
    if (window.location.href !== "https://watt-else.pro/decommissions/decommissions_en_attente") {
      return false;
    }

    const swalContent = document.getElementById("swal2-content");
    if (!swalContent) {
      return false;
    }

    // Find the table in the swal content
    const table = swalContent.querySelector("table tbody");
    console.log(table);
    
    if (!table) {
      return false;
    }
    

    // Get the first row
    const firstRow = table.querySelector("tr");
    if (!firstRow) {
      return false;
    }

    // Get the second cell in the first row
    const secondCell = firstRow.querySelectorAll("td")[1];
    if (!secondCell) {
      return false;
    }

    const cellText = secondCell.innerText || secondCell.textContent || "";
    let foundMatch = false;

    // Check if the cell text contains any of the broker names
    for (const str of brokerNames) {
      if (cellText.includes(str)) {
        showToast(
          `Il faut pas traiter les decommission courtier pour ${str} jusqu'a 02/04/2025`,
          "error",
          500000
        );
        foundMatch = true;
        break;
      }
    }

    return foundMatch;
  }

  function EnableRelanceAndQualificationInputs() {
    let changed = false;

    const statutSelect = document.getElementById("statut_mandat_pfo");
    if (statutSelect && statutSelect.disabled) {
      statutSelect.disabled = false;
      changed = true;
    }

    const motifSelects = document.querySelectorAll(
      'select[name="mandat_motifs_ko[]"]'
    );
    motifSelects.forEach((select) => {
      if (select.disabled) {
        select.disabled = false;
        changed = true;
      }
    });

    const changeButton = document.getElementById("change_mandat_status");
    if (changeButton) {
      if (changeButton.disabled) {
        changeButton.disabled = false;
        changed = true;
      }
      if (changeButton.classList.contains("disabled")) {
        changeButton.classList.remove("disabled");
        changed = true;
      }
    }

    const relanceButton = document.getElementById("pfo_relance_btn");
    if (relanceButton) {
      if (relanceButton.disabled) {
        relanceButton.disabled = false;
        changed = true;
      }
      if (relanceButton.classList.contains("disabled")) {
        relanceButton.classList.remove("disabled");
        changed = true;
      }
    }

    if (changed && observer) {
      observer.disconnect();
      console.log("All elements enabled. MutationObserver stopped.");
    }
  }

  EnableRelanceAndQualificationInputs();
  checkBroker(["7 COM 7"], ".portlet-body.affectation", true);

  // Observer for enabling inputs and buttons
  const observer = new MutationObserver(() => {
    EnableRelanceAndQualificationInputs();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Observer for the decommission brokers check
  if (window.location.href === "https://watt-else.pro/decommissions/decommissions_en_attente") {
    const decomObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // Check if swal2-content div has appeared
          const swalContent = document.getElementById("swal2-content");
          if (swalContent) {
            // Call the check function with an array of broker names to look for
            checkBrokersForDecom(["UTILITY FRANCE LIMITED"]);
          }
        }
      }
    });
    // Observe the entire document for the swal popup to appear
    decomObserver.observe(document.body, { childList: true, subtree: true });

    console.log("Decommission broker observer started on decommissions page");
  }
})();
