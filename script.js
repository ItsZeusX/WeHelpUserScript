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
    toast.style.fontFamily = "Arial, sans-serif";
    toast.style.fontSize = "14px";
    toast.style.lineHeight = "1.4";
    toast.style.minWidth = "300px";
    toast.style.maxWidth = "400px";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease-in";
    toast.style.display = "flex";
    toast.style.alignItems = "flex-start";
    toast.style.gap = "12px";
    toast.style.position = "relative";

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
        if (!title) title = "Transa";
        break;
      case "warning":
        bgColor = "#fff";
        iconHTML =
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#FF9800" fill-opacity="0.2"/><path d="M12 8V13M12 16V16.01" stroke="#FF9800" stroke-width="2" stroke-linecap="round"/></svg>';
        if (!title) title = "Warning";
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
    titleElement.style.fontSize = "16px";
    contentContainer.appendChild(titleElement);

    // Create message element
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.style.color = "#333";
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
   * Checks if a div with class "portlet-body affectation background-success" contains any of the specified strings
   * @param {string[]} searchStrings - Array of strings to search for in the div
   * @param {boolean} showToastOnMatch - Whether to show a toast notification when a match is found
   * @return {boolean} - True if any of the strings are found, false otherwise
   */
  function checkDivForStrings(searchStrings, showToastOnMatch = true) {
    const targetDiv = document.querySelector(".portlet-body.affectation");

    if (!targetDiv) {
      console.log("Target div not found");
      return false;
    }

    const divText = targetDiv.innerText || targetDiv.textContent || "";

    for (const str of searchStrings) {
      if (divText.includes(str)) {
        if (showToastOnMatch) {
          showToast(`Found match: "${str}" in target div`, "danger", 500000);
        }
        console.log(`Found match: "${str}" in target div`);
        return true;
      }
    }

    console.log("No matches found in target div");
    return false;
  }

  /**
   * Checks for the presence of specific strings in the target div when the page loads
   */
  function checkForStringsOnLoad() {
    // Set a small delay to ensure the DOM is fully loaded
    setTimeout(() => {
      // Check for "EUROSTRAT" in the target div
      const result = checkDivForStrings(
        ["EUROSTRAT", "MA NOUVELLE ENERGIE"],
        true
      );

      if (result) {
        console.log("EUROSTRAT found in the target div on page load");
      } else {
        console.log("EUROSTRAT not found in the target div on page load");
        // No periodic checks - just show a one-time notification
        showToast(`"EUROSTRAT" not found in target div`, "warning", 500000);
      }
    }, 1000);
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

  function AddDownloadLinksToMtInfo() {
    const mtInfoLists = document.querySelectorAll("ul.mt-info");
    mtInfoLists.forEach((ul) => {
      if (ul.dataset.linksAdded === "true") return;

      const firstLi = ul.querySelector("li");
      if (firstLi) {
        const link = firstLi.querySelector("a");
        console.log(link);
        if (link) {
          // Try to get data-src first
          let fileUrl = link.getAttribute("data-src");

          // If data-src is not valid, fallback to href
          if (!fileUrl || !isValidUrl(fileUrl)) {
            fileUrl = link.href;
          }

          if (fileUrl && isValidUrl(fileUrl)) {
            const newLi = document.createElement("li");
            const newA = document.createElement("a");
            newA.className = "btn default btn-outline nolock";
            newA.href = "#"; // prevent default behavior
            newA.innerHTML = '<i class="icon-magnifier"></i>';

            // Attach click handler
            newA.addEventListener("click", async (e) => {
              e.preventDefault();
              try {
                const response = await fetch(fileUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const tempLink = document.createElement("a");
                tempLink.href = url;

                // Try to extract filename from headers first
                const contentDisposition = response.headers.get(
                  "Content-Disposition"
                );
                let filename =
                  getFilenameFromContentDisposition(contentDisposition);
                if (!filename) {
                  filename = getFilenameFromURL(fileUrl);
                }

                tempLink.download = filename;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(url);
              } catch (error) {
                console.error("Download failed:", error);
              }
            });

            newLi.appendChild(newA);
            ul.appendChild(newLi);
            ul.dataset.linksAdded = "true";
          }
        }
      }
    });
  }

  // Helper function to validate URL
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getFilenameFromContentDisposition(contentDisposition) {
    if (!contentDisposition) return null;
    const filenameMatch = contentDisposition.match(
      /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    );
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1].replace(/['"]/g, ""); // Remove any quotes
    }
    return null;
  }

  function getFilenameFromURL(url) {
    const parts = url.split("/");
    let filename = parts.pop() || "downloaded_file";
    if (filename.includes("?")) {
      filename = filename.split("?")[0];
    }
    return filename;
  }

  EnableRelanceAndQualificationInputs();
  AddDownloadLinksToMtInfo();
  checkForStringsOnLoad(); // Check for EUROSTRAT when the page loads

  const observer = new MutationObserver(() => {
    EnableRelanceAndQualificationInputs();
    AddDownloadLinksToMtInfo();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
