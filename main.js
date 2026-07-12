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

function coder() {
  const codeDisplay = document.querySelector(".code-container h3");
  codeDisplay.innerHTML = "";

  let genCode = String(code).padStart(5, "0");
  genCode++;
  codeDisplay.innerHTML = String(genCode).padStart(5, "0");
}

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
    descriptionInput.style.borderColor = "red";
    descriptionInput.focus();

    return;
  } else {
    descriptionInput.style.borderBottom = "1px solid hsl(0, 0%, 50%)";
  }

  if (!input.destination) {
    destinationInput.style.borderColor = "red";
    destinationInput.focus();

    return;
  } else {
    destinationInput.style.borderBottom = "1px solid hsl(0, 0%, 50%)";
  }

  console.log(input);
  appendWaybill(input);
  clearHalfInputs();

  code++;
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
let billCount = "";

const billContainer = document.querySelector(".bill-container");

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
                    >
                      <path
                        fill="currentColor"
                        d="M10.115 21.811c.606.5 1.238.957 1.885 1.403a27 27 0 0 0 1.885-1.403a28 28 0 0 0 2.853-2.699C18.782 16.877 21 13.637 21 10a9 9 0 1 0-18 0c0 3.637 2.218 6.876 4.262 9.112a28 28 0 0 0 2.853 2.7M12 13.25a3.25 3.25 0 1 1 0-6.5a3.25 3.25 0 0 1 0 6.5"
                      />
                    </svg>
                    <h2>${data.destination}</h2>
                  </div>
                  <div class="location-item-counter">1 item</div>
                  <div class="process-indicator">
                  <div class="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="16" height="16" viewBox="0 0 256 256" xml:space="preserve">
                  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                  <path d="M 40.051 84.916 c -0.232 0 -0.464 -0.04 -0.688 -0.122 L 1.312 70.858 C 0.524 70.57 0 69.819 0 68.98 V 20.748 c 0 -0.653 0.319 -1.265 0.854 -1.64 c 0.536 -0.374 1.22 -0.464 1.833 -0.238 l 38.051 13.935 c 0.788 0.289 1.312 1.039 1.312 1.878 v 48.233 c 0 0.653 -0.319 1.266 -0.854 1.64 C 40.856 84.793 40.456 84.916 40.051 84.916 z M 4 67.583 l 34.051 12.471 V 36.081 L 4 23.61 V 67.583 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  <path d="M 40.051 84.916 c -0.404 0 -0.805 -0.123 -1.146 -0.36 c -0.536 -0.374 -0.854 -0.986 -0.854 -1.64 V 34.683 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 v 45.371 l 7.339 -2.688 c 1.034 -0.381 2.186 0.152 2.565 1.19 c 0.38 1.037 -0.153 2.186 -1.19 2.565 l -10.027 3.672 C 40.516 84.876 40.283 84.916 40.051 84.916 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  <path d="M 78.103 44.279 c -1.104 0 -2 -0.896 -2 -2 V 23.61 L 40.739 36.561 c -1.037 0.38 -2.186 -0.153 -2.566 -1.19 c -0.38 -1.038 0.153 -2.186 1.19 -2.566 L 77.415 18.87 c 0.611 -0.227 1.297 -0.136 1.833 0.238 c 0.535 0.375 0.854 0.986 0.854 1.64 v 21.531 C 80.103 43.383 79.207 44.279 78.103 44.279 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  <path d="M 40.051 36.683 c -0.233 0 -0.466 -0.041 -0.688 -0.122 L 1.312 22.626 C 0.524 22.337 0 21.587 0 20.748 s 0.524 -1.589 1.312 -1.878 L 39.364 4.936 c 0.443 -0.163 0.932 -0.163 1.375 0 L 78.79 18.87 c 0.788 0.289 1.313 1.039 1.313 1.878 s -0.524 1.589 -1.313 1.878 L 40.739 36.561 C 40.517 36.643 40.284 36.683 40.051 36.683 z M 7.816 20.748 l 32.235 11.805 l 32.235 -11.805 L 40.051 8.943 L 7.816 20.748 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  <path d="M 20.064 42.452 c -1.104 0 -2 -0.896 -2 -2 V 27.364 c 0 -0.843 0.529 -1.596 1.322 -1.881 l 38.356 -13.824 c 1.036 -0.377 2.185 0.164 2.56 1.203 c 0.374 1.039 -0.165 2.185 -1.204 2.56 L 22.064 28.769 v 11.683 C 22.064 41.556 21.169 42.452 20.064 42.452 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  <path d="M 66.608 73.149 c -0.53 0 -1.039 -0.211 -1.414 -0.586 l -6.236 -6.236 c -0.781 -0.781 -0.781 -2.047 0 -2.828 s 2.047 -0.781 2.828 0 l 4.822 4.822 l 11.058 -11.059 c 0.781 -0.781 2.047 -0.781 2.828 0 s 0.781 2.047 0 2.828 L 68.022 72.563 C 67.647 72.938 67.139 73.149 66.608 73.149 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  <path d="M 69.727 85.187 c -11.18 0 -20.274 -9.095 -20.274 -20.273 c 0 -11.18 9.095 -20.274 20.274 -20.274 C 80.905 44.639 90 53.733 90 64.913 C 90 76.092 80.905 85.187 69.727 85.187 z M 69.727 48.639 c -8.974 0 -16.274 7.301 -16.274 16.274 s 7.301 16.273 16.274 16.273 S 86 73.887 86 64.913 S 78.7 48.639 69.727 48.639 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                  </g>
                  </svg>
                  </div>
                  <div class="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="25" height="25" viewBox="0 0 256 256" xml:space="preserve">
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                    </div>
                    <div class="editor-item" id="deleteBtn">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
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

// Slider: center-snap, autoplay, and seamless infinite loop for `.display-sec`
// Technique: append a full duplicate set of cards after the real ones.
// Autoplay always scrolls forward; once it reaches the last duplicate card
// (which looks identical to the last real card), it silently jumps back
// (no animation) to the real last card so the loop never visibly "rewinds".
let displaySliderState = null;

function initDisplaySlider() {
  const displaySec = document.querySelector(".display-sec");
  if (!displaySec) return;

  // already set up once before - just (re)start autoplay
  if (displaySliderState) {
    displaySliderState.startAuto();
    return;
  }

  const originalCards = Array.from(
    displaySec.querySelectorAll(".display-card"),
  );
  if (!originalCards.length) return;

  const pause = 2000; // 2s pause per request
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
        // we just animated onto the last duplicate card, which looks
        // identical to the last real card - once that settles, teleport
        // invisibly back to the real last card
        setTimeout(() => scrollToIndex(realCount - 1, true), 350);
      }
    }, pause + 300); // small buffer for smooth scroll
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  // initial centering once layout is settled, no animation
  setTimeout(() => scrollToIndex(0, true), 120);
  startAuto();

  // pause on user interaction and resume after idle
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
      // find nearest card to center and snap
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
        // landed on the last duplicate card - teleport to the real last card
        scrollToIndex(realCount - 1, true);
      } else {
        scrollToIndex(nearestIndex);
      }
    }, 120);
  });

  displaySliderState = { startAuto, stopAuto };
}

// also try to init on load in case display is already visible
window.addEventListener("load", () => {
  initDisplaySlider();
});

// Filter -> filter-xrn switcher
// Each .filter-item with a data-target points at the id of the
// .filter-xrn panel it should reveal. Panels sit off-screen
// (translateX 100%) until they get the "active" class.
const filterXrnsContainer = document.querySelector(".filter-xrns-container");
const filterXrns = Array.from(document.querySelectorAll(".filter-xrn"));
const filterButtons = Array.from(
  document.querySelectorAll(".filter-item[data-target]"),
);

function resizeXrnContainer(activeXrn) {
  if (!filterXrnsContainer || !activeXrn) return;
  // wait a frame so the browser has laid out the now-active panel
  requestAnimationFrame(() => {
    filterXrnsContainer.style.height = activeXrn.scrollHeight + "px";
  });
}

function setActiveXrn(targetId) {
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
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => setActiveXrn(btn.dataset.target));
});

window.addEventListener("resize", () => {
  resizeXrnContainer(document.querySelector(".filter-xrn.active"));
});

// show the receipt/waybill panel by default, same as before
setActiveXrn("homeXrn");

/* const info = {
  location: {
    agentName,
    agentNumber,
  },
}; */

const locationBtn = document.getElementById("locationBtn");
const locationPage = document.getElementById("locationPage");

locationBtn.addEventListener("click", () => {
  locationPage.classList.toggle("show");
  console.log(document.querySelector(".menu-ctrl-sec").closest);
});
