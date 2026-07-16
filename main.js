const menuBtn = document.getElementById("menuBtn");
const parentContainer = document.getElementById("parentContainer");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  parentContainer.classList.toggle("menu");
});

// const codeDiv = document.getElementById("codeInput");
const dateDiv = document.getElementById("dateInput");
const senderNameDiv = document.getElementById("senderNameInput");
const senderNumberDiv = document.getElementById("senderNumberInput");
const receiverNameDiv = document.getElementById("receiverNameInput");
const receiverNumberDiv = document.getElementById("receiverNumberInput");
const descriptionDiv = document.getElementById("descriptionInput");
const noteDiv = document.getElementById("noteInput");
const quantityDiv = document.getElementById("quantityInput");
const destinationDiv = document.getElementById("destinationInput");
const riderFeeDiv = document.getElementById("riderFeeInput");
const serviceFeeDiv = document.getElementById("serviceFeeInput");
const agentNameDiv = document.getElementById("agentNameInput");
const agentNumberDiv = document.getElementById("agentNumberInput");

const saveBtn = document.getElementById("saveBtn");

let code = 345;
let activeCode = "";

// ===================== LOCAL STORAGE & DATA MANAGEMENT =====================
const STORAGE_KEYS = {
  WAYBILLS: "deliva_waybills",
  ARCHIVED_WAYBILLS: "deliva_archived_waybills",
  LAST_ARCHIVE_DATE: "deliva_last_archive_date",
  CODE_COUNTER: "deliva_code_counter",
};

// Initialize storage on page load
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.CODE_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.CODE_COUNTER, "345");
    code = 345;
  } else {
    code = parseInt(localStorage.getItem(STORAGE_KEYS.CODE_COUNTER));
  }

  if (!localStorage.getItem(STORAGE_KEYS.WAYBILLS)) {
    localStorage.setItem(STORAGE_KEYS.WAYBILLS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ARCHIVED_WAYBILLS)) {
    localStorage.setItem(STORAGE_KEYS.ARCHIVED_WAYBILLS, JSON.stringify({}));
  }

  checkAndArchiveWaybills();
}

// Get today's date in YYYY-MM-DD format
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Format date for display (e.g., "July 13, 2026")
function formatDateForDisplay(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Save waybill to local storage
function saveWaybillToStorage(waybillData) {
  const waybills = JSON.parse(localStorage.getItem(STORAGE_KEYS.WAYBILLS)) || [];
  const waybillWithTimestamp = {
    ...waybillData,
    id: Date.now(),
    createdDate: getTodayDateString(),
    createdTime: new Date().toISOString(),
  };
  waybills.push(waybillWithTimestamp);
  localStorage.setItem(STORAGE_KEYS.WAYBILLS, JSON.stringify(waybills));
  return waybillWithTimestamp;
}

// Get all active waybills from storage
function getActiveWaybills() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.WAYBILLS)) || [];
}

// Get archived waybills
function getArchivedWaybills() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ARCHIVED_WAYBILLS)) || {};
}

// Archive waybills from a specific date
function archiveWaybillsByDate(dateString) {
  const waybills = getActiveWaybills();
  const archived = getArchivedWaybills();

  const billsToArchive = waybills.filter((bill) => bill.createdDate === dateString);
  const remainingBills = waybills.filter((bill) => bill.createdDate !== dateString);

  if (billsToArchive.length > 0) {
    if (!archived[dateString]) {
      archived[dateString] = [];
    }
    archived[dateString] = [...archived[dateString], ...billsToArchive];
    localStorage.setItem(STORAGE_KEYS.ARCHIVED_WAYBILLS, JSON.stringify(archived));
    localStorage.setItem(STORAGE_KEYS.WAYBILLS, JSON.stringify(remainingBills));
  }
}

// Check if waybills need to be archived (after 24 hours)
function checkAndArchiveWaybills() {
  const waybills = getActiveWaybills();
  const today = getTodayDateString();

  waybills.forEach((waybill) => {
    const createdDate = waybill.createdDate;
    const createdDateTime = new Date(waybill.createdTime);
    const now = new Date();
    const hoursDiff = (now - createdDateTime) / (1000 * 60 * 60);

    if (createdDate !== today && hoursDiff >= 24) {
      archiveWaybillsByDate(createdDate);
    }
  });
}

// ===================== CURRENT DATE DISPLAY =====================
function updateCurrentDateDisplay() {
  const waybillHeader = document.querySelector(".items-info-container .header-text");
  if (waybillHeader) {
    let dateDisplay = waybillHeader.querySelector(".current-date");
    if (!dateDisplay) {
      dateDisplay = document.createElement("span");
      dateDisplay.className = "current-date";
      dateDisplay.style.marginLeft = "10px";
      dateDisplay.style.fontSize = "14px";
      dateDisplay.style.color = "hsl(0, 0%, 40%)";
      waybillHeader.appendChild(dateDisplay);
    }
    dateDisplay.textContent = `Today: ${formatDateForDisplay(getTodayDateString())}`;
  }
}

// Update date display every minute to ensure it changes at midnight
setInterval(() => {
  updateCurrentDateDisplay();
}, 60000);

// ===================== CODE GENERATOR =====================
function coder() {
  const codeDisplay = document.querySelector(".code-container h3");
  codeDisplay.innerHTML = "";

  let genCode = String(code).padStart(5, "0");
  genCode++;
  codeDisplay.innerHTML = String(genCode).padStart(5, "0");
}

// ===================== RECEIPT FORM HANDLING =====================
function saveReceipt() {
  const input = {
    // code: codeDiv.value.trim(),
    date: dateDiv.value.trim(),
    senderName: senderNameDiv.value.trim(),
    senderNumber: senderNumberDiv.value.trim(),
    receiverName: receiverNameDiv.value.trim(),
    receiverNumber: receiverNumberDiv.value.trim(),
    description: descriptionDiv.value.trim(),
    note: noteDiv.value.trim(),
    quantity: quantityDiv.value.trim(),
    destination: destinationDiv.value.trim(),
    riderFee: riderFeeDiv.value.trim(),
    serviceFee: serviceFeeDiv.value.trim(),
    agentName: agentNameDiv.value.trim(),
    agentNumber: agentNumberDiv.value.trim(),
  };

  if (!input.description) {
    descriptionDiv.style.borderColor = "red";
    descriptionDiv.focus();

    return;
  } else {
    descriptionDiv.style.borderBottom = "1px solid hsl(0, 0%, 50%)";
  }

  if (!input.destination) {
    destinationDiv.style.borderColor = "red";
    destinationDiv.focus();

    return;
  } else {
    destinationDiv.style.borderBottom = "1px solid hsl(0, 0%, 50%)";
  }

  console.log(input);
  
  // Save to storage
  const savedWaybill = saveWaybillToStorage(input);
  
  appendWaybill(input);
  clearHalfInputs();

  code++;
  localStorage.setItem(STORAGE_KEYS.CODE_COUNTER, code.toString());
}

function clearHalfInputs() {
  receiverNameDiv.value = "";
  receiverNumberDiv.value = "";
  noteDiv.value = "";
  quantityDiv.value = "";
  riderFeeDiv.value = "";
  serviceFeeDiv.value = "";
}

saveBtn.addEventListener("click", saveReceipt);

const fNoteTotal = document.getElementById("fNoteTotal");
fNoteTotal.innerHTML = "Total: 0";
let billCount = 0;

const billContainer = document.querySelector(".bill-container");

// ===================== WAYBILL DISPLAY =====================
function appendWaybill(data) {
  let genCode = String(code).padStart(5, "0");
  activeCode = genCode;
  console.log("activeCode: ", activeCode);

  let locationSection = document.querySelector(
    `[data-location="${data.destination}"]`,
  );

  if (!locationSection) {
    locationSection = document.createElement("div");
    locationSection.className = "location-set";
    locationSection.dataset.location = data.destination;

    locationSection.innerHTML = `
                <div class="location">
                  <div class="destination-container">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <h2>${data.destination}</h2>
                  </div>
                  <div class="location-item-counter">1 item</div>
                  <div class="process-indicator">
                  <div class="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m7.5 4.27 9 5.15" />
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </div>
                  <div class="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="28" height="28" viewBox="0 0 256 256" xml:space="preserve">
                  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                    <path d="M 79.803 66.106 c -3.105 0 -5.632 -2.526 -5.632 -5.632 s 2.526 -5.632 5.632 -5.632 s 5.632 2.526 5.632 5.632 S 82.908 66.106 79.803 66.106 z M 79.803 56.843 c -2.003 0 -3.632 1.629 -3.632 3.632 s 1.629 3.632 3.632 3.632 s 3.632 -1.629 3.632 -3.632 S 81.806 56.843 79.803 56.843 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 69.825 62.624 c -0.121 0 -0.243 -0.013 -0.364 -0.038 c -0.629 -0.136 -1.115 -0.605 -1.269 -1.228 c -0.746 -3.013 -0.224 -6.135 1.472 -8.791 c 2.519 -3.947 7.46 -5.925 12.018 -4.818 c 3.329 0.813 6.073 3.035 7.53 6.096 c 0.276 0.58 0.197 1.255 -0.206 1.76 c -0.409 0.513 -1.061 0.743 -1.7 0.598 c -6.008 -1.354 -12.346 0.913 -16.148 5.771 C 70.829 62.392 70.34 62.624 69.825 62.624 z M 79.104 49.441 c -3.074 0 -6.072 1.566 -7.755 4.202 c -1.275 1.999 -1.746 4.314 -1.353 6.586 c 4.171 -4.94 10.759 -7.289 17.104 -6.111 c -1.254 -2.212 -3.369 -3.81 -5.894 -4.426 C 80.513 49.522 79.806 49.441 79.104 49.441 z M 87.405 54.703 L 87.405 54.703 L 87.405 54.703 L 87.405 54.703 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 48.123 42.327 H 24.565 c -2.713 0 -4.92 -2.207 -4.92 -4.92 V 24.249 c 0 -2.713 2.207 -4.92 4.92 -4.92 h 18.638 c 2.713 0 4.92 2.207 4.92 4.92 V 42.327 z M 24.565 21.329 c -1.61 0 -2.92 1.31 -2.92 2.92 v 13.158 c 0 1.61 1.31 2.92 2.92 2.92 h 21.558 V 24.249 c 0 -1.61 -1.31 -2.92 -2.92 -2.92 H 24.565 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 75.003 36.555 h -0.642 c -3.158 0 -5.728 -2.569 -5.728 -5.728 s 2.569 -5.728 5.728 -5.728 h 0.642 c 1.331 0 2.414 1.083 2.414 2.414 v 6.627 C 77.417 35.472 76.334 36.555 75.003 36.555 z M 74.361 27.1 c -2.056 0 -3.728 1.672 -3.728 3.728 s 1.672 3.728 3.728 3.728 h 0.642 c 0.229 0 0.414 -0.186 0.414 -0.414 v -6.627 c 0 -0.229 -0.186 -0.414 -0.414 -0.414 H 74.361 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 66.099 28.518 c -0.554 0 -5.684 -0.696 -5.684 -3.014 s 5.13 -3.014 5.684 -3.014 c 1.662 0 3.014 1.352 3.014 3.014 C 69.112 27.166 67.761 28.518 66.099 28.518 z M 62.598 25.503 c 0.716 0.465 2.642 1.014 3.501 1.014 c 0.559 0 1.014 -0.455 1.014 -1.014 s -0.455 -1.014 -1.014 -1.014 C 65.239 24.49 63.313 25.039 62.598 25.503 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 39.819 70.672 c -5.623 0 -10.197 -4.574 -10.197 -10.197 c 0 -0.367 0.024 -0.752 0.072 -1.178 l 1.987 0.229 c -0.036 0.312 -0.06 0.627 -0.06 0.949 c 0 4.52 3.677 8.197 8.197 8.197 s 8.197 -3.678 8.197 -8.197 c 0 -0.322 -0.023 -0.638 -0.059 -0.949 l 1.986 -0.229 c 0.049 0.423 0.072 0.809 0.072 1.178 C 50.016 66.098 45.441 70.672 39.819 70.672 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 39.819 66.106 c -3.105 0 -5.632 -2.526 -5.632 -5.632 c 0 -0.424 0.052 -0.859 0.154 -1.293 l 1.946 0.459 c -0.067 0.283 -0.101 0.564 -0.101 0.834 c 0 2.003 1.629 3.632 3.632 3.632 s 3.632 -1.629 3.632 -3.632 c 0 -0.27 -0.034 -0.551 -0.101 -0.834 l 1.946 -0.459 c 0.103 0.434 0.154 0.869 0.154 1.293 C 45.451 63.58 42.924 66.106 39.819 66.106 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 79.803 70.672 c -5.372 0 -9.837 -4.203 -10.166 -9.568 l 1.996 -0.123 c 0.265 4.313 3.853 7.691 8.17 7.691 c 4.52 0 8.197 -3.678 8.197 -8.197 c 0 -1.692 -0.517 -3.321 -1.495 -4.71 l 1.635 -1.152 c 1.217 1.729 1.86 3.755 1.86 5.862 C 90 66.098 85.426 70.672 79.803 70.672 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 68.9 60.411 H 27.18 c -1.3 0 -2.52 -0.638 -3.262 -1.705 c -0.742 -1.068 -0.914 -2.434 -0.46 -3.651 l 3.623 -9.737 c 1.103 -2.966 3.971 -4.959 7.136 -4.959 h 12.578 c 2.657 0 4.818 2.161 4.818 4.818 v 4.352 c 0 1.194 0.972 2.166 2.165 2.166 h 9.435 c 0.741 0 1.437 -0.328 1.907 -0.901 c 0.479 -0.583 0.664 -1.341 0.508 -2.078 l -3.7 -17.48 c -0.365 -1.72 0.097 -3.462 1.267 -4.78 l 1.496 1.328 c -0.744 0.837 -1.038 1.944 -0.806 3.037 l 3.7 17.481 c 0.282 1.336 -0.054 2.707 -0.92 3.762 c -0.851 1.037 -2.109 1.632 -3.452 1.632 h -9.435 c -2.297 0 -4.165 -1.869 -4.165 -4.166 v -4.352 c 0 -1.554 -1.265 -2.818 -2.818 -2.818 H 34.216 c -2.333 0 -4.448 1.469 -5.262 3.657 l -3.623 9.736 c -0.229 0.614 -0.145 1.274 0.229 1.813 c 0.374 0.538 0.964 0.847 1.62 0.847 H 68.9 V 60.411 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <rect x="67.77" y="26.29" rx="0" ry="0" width="2" height="3.85" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(0.8687 -0.4953 0.4953 0.8687 -4.9454 37.769) "/>
                    <rect x="75.58" y="34.29" rx="0" ry="0" width="2" height="15.23" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(0.8687 -0.4953 0.4953 0.8687 -10.7043 43.4321) "/>
                    <path d="M 19.18 52.595 H 7.991 c -0.552 0 -1 -0.447 -1 -1 s 0.448 -1 1 -1 H 19.18 c 0.552 0 1 0.447 1 1 S 19.732 52.595 19.18 52.595 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 17.626 44.778 H 1 c -0.552 0 -1 -0.448 -1 -1 s 0.448 -1 1 -1 h 16.626 c 0.552 0 1 0.448 1 1 S 18.178 44.778 17.626 44.778 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 14.519 36.962 H 1 c -0.552 0 -1 -0.448 -1 -1 s 0.448 -1 1 -1 h 13.519 c 0.552 0 1 0.448 1 1 S 15.071 36.962 14.519 36.962 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                    <path d="M 14.519 29.145 H 7.991 c -0.552 0 -1 -0.448 -1 -1 s 0.448 -1 1 -1 h 6.528 c 0.552 0 1 0.448 1 1 S 15.071 29.145 14.519 29.145 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  </g>
                  </svg>
                  </div>
                  </div>
                </div>
                <div class="sender-wrapper"></div>
    `;

    billContainer.appendChild(locationSection);
  }

  const senderWrapper = locationSection.querySelector(".sender-wrapper");

  let senderSection = locationSection.querySelector(
    `[data-sender="${data.senderName}"]`,
  );

  if (!senderSection) {
    senderSection = document.createElement("div");
    senderSection.dataset.sender = data.senderName;

    senderSection.innerHTML = `
    <div class="item-senders">
    <svg
      class="nav-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
    <div class="sender-name">
      <h3>${data.senderName}</h3>
    </div>
  </div>

  <div class="bill-list"></div>
  `;

    senderWrapper.appendChild(senderSection);
  }

  const bill = document.createElement("div");
  bill.className = "bill";

  bill.innerHTML = `
  <div class="editor-card">
                    <div class="editor-item" id="editBtn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </div>
                    <div class="editor-item" id="deleteBtn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </div>
                  </div>

  <div class="bill-item-img"></div>
  <div class="bill-details">
    <div class="row">
      <div class="item-info">
        To:
        <div class="output-value">
          ${data.receiverName}
        </div>
      </div>
      <div class="item-info">
        Number:
        <div class="input-value">
        ${data.receiverNumber}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="item-info">
        Description:
        <div class="input-value">
        ${data.description}
        </div>
      </div>
      <div class="item-info">
        Qty:
        <div class="input-value">
        ${data.quantity}
        </div>
      </div>
    </div>
    <div class="item-info code">
      #
      <div class="input-value">
      ${activeCode}
      </div>
    </div>
  </div>
  `;

  coder();

  billCount++;
  fNoteTotal.innerHTML = "Total: " + billCount;

  senderSection.querySelector(".bill-list").appendChild(bill);
  expandBtn.style.display = "flex";

  resizeXrnContainer(document.getElementById("homeXrn"));
}

const expandBtn = document.getElementById("expandBtn");

expandBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  e.preventDefault();
  if (expandBtn.innerHTML === "Collapse") {
    expandBtn.innerHTML = "Expand";
  } else expandBtn.innerHTML = "Collapse";
});

function collapseBill() {
  const billCard = document.querySelectorAll(".items-container");

  billCard.forEach((card) => {
    card.innerHTML = "red";
  });
}
collapseBill();

// ===================== SLIDER FUNCTIONALITY =====================
let displaySliderState = null;

function initDisplaySlider() {
  const displaySec = document.querySelector(".display-sec");
  if (!displaySec) return;

  if (displaySliderState) {
    displaySliderState.startAuto();
    return;
  }

  const originalCards = Array.from(
    displaySec.querySelectorAll(".display-card"),
  );
  if (!originalCards.length) return;

  const pause = 2000;
  const canLoop = originalCards.length > 1;
  const realCount = originalCards.length;
  let cards = originalCards;

  if (canLoop) {
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      displaySec.appendChild(clone);
    });
    cards = Array.from(displaySec.querySelectorAll(".display-card"));
  }

  let current = 0;
  let autoTimer = null;
  let userScrollTimer = null;
  let scrollTimeout = null;

  function scrollToIndex(i, instant = false) {
    if (!cards[i]) return;
    const card = cards[i];
    const target =
      card.offsetLeft - (displaySec.clientWidth - card.clientWidth) / 2;
    displaySec.scrollTo({
      left: target,
      behavior: instant ? "auto" : "smooth",
    });
    current = i;
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      const next = current + 1;
      scrollToIndex(next);
      if (canLoop && next === cards.length - 1) {
        setTimeout(() => scrollToIndex(realCount - 1, true), 350);
      }
    }, pause + 300);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  setTimeout(() => scrollToIndex(0, true), 120);
  startAuto();

  displaySec.addEventListener(
    "wheel",
    () => {
      stopAuto();
      clearTimeout(userScrollTimer);
      userScrollTimer = setTimeout(() => startAuto(), 1500);
    },
    { passive: true },
  );

  displaySec.addEventListener(
    "touchstart",
    () => {
      stopAuto();
      clearTimeout(userScrollTimer);
    },
    { passive: true },
  );

  displaySec.addEventListener(
    "touchend",
    () => {
      userScrollTimer = setTimeout(() => startAuto(), 1500);
    },
    { passive: true },
  );

  displaySec.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const centers = cards.map((c) => c.offsetLeft + c.clientWidth / 2);
      const containerCenter =
        displaySec.scrollLeft + displaySec.clientWidth / 2;
      let nearestIndex = 0;
      let minDist = Infinity;
      centers.forEach((c, idx) => {
        const d = Math.abs(c - containerCenter);
        if (d < minDist) {
          minDist = d;
          nearestIndex = idx;
        }
      });

      if (canLoop && nearestIndex === cards.length - 1) {
        scrollToIndex(realCount - 1, true);
      } else {
        scrollToIndex(nearestIndex);
      }
    }, 120);
  });

  displaySliderState = { startAuto, stopAuto };
}

window.addEventListener("load", () => {
  initDisplaySlider();
});

// ===================== FILTER & XRN PANEL SWITCHING =====================
const filterXrnsContainer = document.querySelector(".filter-xrns-container");
const filterXrns = Array.from(document.querySelectorAll(".filter-xrn"));
const filterButtons = Array.from(
  document.querySelectorAll(".filter-item[data-target]"),
);

let currentActiveXrnId = null;

function resizeXrnContainer(activeXrn) {
  if (!filterXrnsContainer || !activeXrn) return;
  requestAnimationFrame(() => {
    filterXrnsContainer.style.height = activeXrn.scrollHeight + "px";
  });
}

function setActiveXrn(targetId, force = false) {
  // Prevent switching to already active panel (unless forced, e.g. on initial load)
  if (currentActiveXrnId === targetId && !force) {
    return;
  }

  currentActiveXrnId = targetId;

  const targetXrn = document.getElementById(targetId);
  if (!targetXrn) return;

  filterXrns.forEach((xrn) => xrn.classList.remove("active"));
  targetXrn.classList.add("active");

  filterButtons.forEach((btn) => btn.classList.remove("active"));
  const activeBtn = filterButtons.find(
    (btn) => btn.dataset.target === targetId,
  );
  if (activeBtn) activeBtn.classList.add("active");

  resizeXrnContainer(targetXrn);

  if (targetId === "homeXrn") {
    initDisplaySlider();
  }

  // Load receipts data if switching to receipts tab
  if (targetId === "itemsXrn") {
    loadReceiptsPage();
  }
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    setActiveXrn(targetId);
  });
});

window.addEventListener("resize", () => {
  resizeXrnContainer(document.querySelector(".filter-xrn.active"));
});

// Initialize with home panel (forced so the container gets sized and the
// Items filter button is marked active even though homeXrn is already
// marked active in the HTML)
setActiveXrn("homeXrn", true);

// ===================== RECEIPTS PAGE =====================
function loadReceiptsPage() {
  const receiptsContainer = document.getElementById("itemsXrn");
  const archived = getArchivedWaybills();
  const dates = Object.keys(archived).sort().reverse();

  receiptsContainer.innerHTML = "";

  if (dates.length === 0) {
    receiptsContainer.innerHTML =
      '<div style="padding: 20px; text-align: center; color: hsl(0, 0%, 50%);">No archived receipts yet</div>';
    return;
  }

  dates.forEach((date) => {
    const bills = archived[date];
    const dateDisplay = formatDateForDisplay(date);

    const dateContainer = document.createElement("div");
    dateContainer.className = "receipts-date-container";
    dateContainer.innerHTML = `
      <div class="receipts-date-header">
        <span class="receipts-date-label">${dateDisplay}</span>
        <span class="receipts-item-count">${bills.length} items</span>
        <button class="receipts-expand-btn" data-expanded="false">▼</button>
      </div>
      <div class="receipts-bills-container" style="display: none;">
        <div class="receipts-bills-list"></div>
      </div>
    `;

    const billsList = dateContainer.querySelector(".receipts-bills-list");
    const expandBtn = dateContainer.querySelector(".receipts-expand-btn");
    const billsContainer = dateContainer.querySelector(".receipts-bills-container");

    bills.forEach((bill) => {
      const billElement = document.createElement("div");
      billElement.className = "receipts-bill-item";
      billElement.innerHTML = `
        <div class="receipts-bill-header">
          <div class="receipts-bill-info">
            <h4>${bill.receiverName}</h4>
            <p>${bill.destination}</p>
          </div>
          <div class="receipts-bill-details">
            <span>${bill.description}</span>
            <span class="receipts-bill-date">${new Date(bill.createdTime).toLocaleTimeString()}</span>
          </div>
        </div>
        <div class="receipts-bill-body">
          <div class="receipts-bill-row">
            <span class="receipts-label">Sender:</span>
            <span>${bill.senderName}</span>
          </div>
          <div class="receipts-bill-row">
            <span class="receipts-label">Agent:</span>
            <span>${bill.agentName}</span>
          </div>
          <div class="receipts-bill-row">
            <span class="receipts-label">Quantity:</span>
            <span>${bill.quantity}</span>
          </div>
          <div class="receipts-bill-row">
            <span class="receipts-label">Fees:</span>
            <span>R: ${bill.riderFee} | P: ${bill.serviceFee}</span>
          </div>
        </div>
      `;
      billsList.appendChild(billElement);
    });

    expandBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = expandBtn.dataset.expanded === "true";
      expandBtn.dataset.expanded = !isExpanded;
      billsContainer.style.display = isExpanded ? "none" : "block";
      expandBtn.textContent = isExpanded ? "▼" : "▲";
    });

    receiptsContainer.appendChild(dateContainer);
  });

  resizeXrnContainer(receiptsContainer.parentElement);
}

// ===================== MENU ITEMS ACTIVE STATE =====================
const menuItems = document.querySelectorAll(".menu-item");
// Dashboard is marked active by default in the HTML on page load
let currentActiveMenu = document.querySelector(".menu-item.active") || null;

menuItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    
    // Only toggle if it's a div (not an anchor tag)
    if (item.tagName === "DIV") {
      // Remove active from previously active item (including Dashboard)
      if (currentActiveMenu && currentActiveMenu !== item) {
        currentActiveMenu.classList.remove("active");
      }

      // Toggle active on clicked item
      item.classList.toggle("active");
      
      // Update current active menu
      if (item.classList.contains("active")) {
        currentActiveMenu = item;
      } else {
        currentActiveMenu = null;
      }
    } else {
      // Anchor tag (e.g. Dashboard, Insights) was clicked - mark it active
      if (currentActiveMenu && currentActiveMenu !== item) {
        currentActiveMenu.classList.remove("active");
      }
      item.classList.add("active");
      currentActiveMenu = item;
    }
  });
});

// ===================== INITIALIZATION =====================
window.addEventListener("load", () => {
  initializeStorage();
  updateCurrentDateDisplay();
  
  // Restore active waybills from storage
  const activeWaybills = getActiveWaybills();
  activeWaybills.forEach((bill) => {
    appendWaybill(bill);
  });
});

// Auto-check for archiving every 5 minutes
setInterval(() => {
  checkAndArchiveWaybills();
}, 5 * 60 * 1000);

/*const dashboardBtn = document.getElementById("dashboardBtn");
const dashboardPage = document.getElementById("dashboardPage");
const insightsBtn = document.getElementById("insightsBtn");
const insightsPage = document.getElementById("insightsPage");
*/
/*insightsBtn.addEventListener("click", () => {
  insightsPage.classList.add("show");
  dashboardPage.classList.remove("main");
})

dashboardBtn.addEventListener("click", () => {
  dashboardPage.classList.add("main");
  insightsPage.classList.remove("show");
})*/

/* const info = {
  location: {
    agentName,
    agentNumber,
  },
}; */

/*const locationBtn = document.getElementById("locationBtn");
const locationPage = document.getElementById("locationPage");

locationBtn.addEventListener("click", () => {
  locationPage.classList.toggle("show");
  console.log(document.querySelector(".menu-ctrl-sec").closest);
});*/

const buttons = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");
const dashboard = document.getElementById("dashboardPage");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove .show from all pages
    pages.forEach(page => {
      page.classList.remove("show")
    });
    
    // Get the target page from the button's id
    const pageId = btn.id.replace("Btn", "Page");
    
    // Show the matching page
    document.getElementById(pageId).classList.add("show");
    //(pageId).classList.add("show");
    console.log(pageId);
  });
});