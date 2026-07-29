function trackShipment() {
const inputVal = document.getElementById('trackingInput').value.trim();
const resultSection = document.getElementById('resultSection');
const resStatus = document.getElementById('resStatus');
const resTrackingNum = document.getElementById('resTrackingNum');
const resDelivery = document.getElementById('resDelivery');
const timelineList = document.getElementById('timelineList');

if (!inputVal) {
alert('Please enter a valid tracking number.');
return;
}

// Check if there is custom data saved from the Admin Portal in browser storage
let shipments = JSON.parse(localStorage.getItem('phl_shipments')) || {};

// Default sample data if none exists or for testing
if (!shipments["PHL-948201"]) {
shipments["PHL-948201"] = {
status: "In Transit",
delivery: "July 31, 2026",
history: [
{ date: "July 28, 2026 - 14:30", note: "Package received at origin facility - Lagos, Nigeria" },
{ date: "July 29, 2026 - 09:15", note: "Departed international sorting hub" }
]
};
}

const shipment = shipments[inputVal];

if (shipment) {
resultSection.classList.remove('hidden');
resTrackingNum.textContent = inputVal;
resStatus.textContent = shipment.status;
resDelivery.textContent = shipment.delivery;

// Color code status badge
if (shipment.status.toLowerCase().includes('transit')) {
resStatus.style.backgroundColor = '#f39c12';
} else if (shipment.status.toLowerCase().includes('delivered')) {
resStatus.style.backgroundColor = '#27ae60';
} else {
resStatus.style.backgroundColor = '#3498db';
}

// Build timeline history
timelineList.innerHTML = '';
shipment.history.forEach(item => {
const li = document.createElement('li');
li.innerHTML = `<strong>${item.date}</strong><p>${item.note}</p>`;
timelineList.appendChild(li);
});

// Smooth scroll to results
resultSection.scrollIntoView({ behavior: 'smooth' });
} else {
alert('Tracking number not found. Please check the number and try again (Try: PHL-948201).');
resultSection.classList.add('hidden');
}
}
