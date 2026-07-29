const defaultShipments = {
"PHL-948201": {
status: "In Transit",
deliveryDate: "August 3, 2026",
logs: [
{ time: "July 29, 2026 - 10:30 AM", text: "Package arrived at regional sorting hub" },
{ time: "July 28, 2026 - 04:15 PM", text: "Departed from origin facility" }
]
},
"PHL-102938": {
status: "On Hold",
deliveryDate: "Pending Clearance",
logs: [
{ time: "July 29, 2026 - 01:00 PM", text: "Package placed on hold for security inspection" },
{ time: "July 27, 2026 - 02:00 PM", text: "Package picked up from sender" }
]
}
};

function getShipments() {
const stored = localStorage.getItem("phlShipments");
if (stored) {
return JSON.parse(stored);
} else {
localStorage.setItem("phlShipments", JSON.stringify(defaultShipments));
return defaultShipments;
}
}

function saveShipments(data) {
localStorage.setItem("phlShipments", JSON.stringify(data));
if (document.getElementById("adminTrkSelect")) {
populateAdminDropdown();
}
}

function trackShipment() {
const inputVal = document.getElementById("trackingInput").value.trim().toUpperCase();
const resultSection = document.getElementById("resultSection");
const shipments = getShipments();

const resTrackingNum = document.getElementById("resTrackingNum");
const resStatus = document.getElementById("resStatus");
const resDelivery = document.getElementById("resDelivery");
const timelineList = document.getElementById("timelineList");

if (shipments[inputVal]) {
const data = shipments[inputVal];

resTrackingNum.textContent = inputVal;
resStatus.textContent = data.status;
resDelivery.textContent = data.deliveryDate;

resStatus.className = "badge";
if (data.status === "On Hold") resStatus.classList.add("badge-on-hold");
else if (data.status === "In Transit") resStatus.classList.add("badge-in-transit");
else if (data.status === "Delivered") resStatus.classList.add("badge-delivered");

timelineList.innerHTML = "";
data.logs.forEach(log => {
const li = document.createElement("li");
li.innerHTML = `<strong>${log.text}</strong><span class="time">${log.time}</span>`;
timelineList.appendChild(li);
});

resultSection.classList.remove("hidden");
resultSection.scrollIntoView({ behavior: 'smooth' });
} else {
alert("Tracking number not found. Try searching: PHL-948201 or PHL-102938");
resultSection.classList.add("hidden");
}
}

// Admin Panel Initialization
window.onload = function() {
if (document.getElementById("adminTrkSelect")) {
populateAdminDropdown();
}
};

function populateAdminDropdown() {
const shipments = getShipments();
const select = document.getElementById("adminTrkSelect");
if (!select) return;

select.innerHTML = '<option value="">-- Choose Tracking Number --</option>';

for (let trk in shipments) {
const option = document.createElement("option");
option.value = trk;
option.textContent = `${trk} — [${shipments[trk].status}]`;
select.appendChild(option);
}
}

function createShipment() {
const trkNum = document.getElementById("newTrkNum").value.trim().toUpperCase();
const delivery = document.getElementById("newDelivery").value.trim();

if (!trkNum || !delivery) {
alert("Please provide both a tracking number and delivery date.");
return;
}

let shipments = getShipments();
if (shipments[trkNum]) {
alert("This tracking number already exists!");
return;
}

shipments[trkNum] = {
status: "In Transit",
deliveryDate: delivery,
logs: [
{ time: new Date().toLocaleString(), text: "Shipment registered in PHL Courier network." }
]
};

saveShipments(shipments);
alert(`Successfully created tracking number: ${trkNum}`);
document.getElementById("newTrkNum").value = "";
document.getElementById("newDelivery").value = "";
}

function loadAdminShipmentDetails() {
const trkNum = document.getElementById("adminTrkSelect").value;
if (!trkNum) return;

const shipments = getShipments();
const shipment = shipments[trkNum];
document.getElementById("adminStatusSelect").value = shipment.status;
}

function updateShipmentData() {
const trkNum = document.getElementById("adminTrkSelect").value;
const newStatus = document.getElementById("adminStatusSelect").value;
const logText = document.getElementById("adminLogText").value.trim();

if (!trkNum) {
alert("Please select a tracking number from the dropdown.");
return;
}

let shipments = getShipments();
shipments[trkNum].status = newStatus;

if (logText) {
const timestamp = new Date().toLocaleString();
shipments[trkNum].logs.unshift({ time: timestamp, text: logText });
}

saveShipments(shipments);
alert(`Shipment ${trkNum} successfully updated to: ${newStatus}`);
document.getElementById("adminLogText").value = "";
}
