// Simple single-page Vehicle Rental demo.
// Uses localStorage to store bookings (simulates DB).
const vehicles = {
  Car: [
    {name: "Toyota Camry", rent: 50},
    {name: "Honda City", rent: 40},
    {name: "BMW 3 Series", rent: 90}
  ],
  Bike: [
    {name: "Honda Activa", rent: 10},
    {name: "Royal Enfield", rent: 20},
    {name: "Yamaha R15", rent: 18}
  ]
};

const typeSelect = document.getElementById('typeSelect');
const vehicleSelect = document.getElementById('vehicleSelect');
const rentInput = document.getElementById('rentInput');
const daysInput = document.getElementById('daysInput');
const calcBtn = document.getElementById('calcBtn');
const bookBtn = document.getElementById('bookBtn');
const clearBtn = document.getElementById('clearBtn');
const calcResult = document.getElementById('calcResult');
const bookingsTableBody = document.querySelector('#bookingsTable tbody');
const username = document.getElementById('username');

const modal = document.getElementById('modal');
const modalMsg = document.getElementById('modalMsg');
const closeModal = document.getElementById('closeModal');

function loadVehicleOptions() {
  const type = typeSelect.value;
  vehicleSelect.innerHTML = '';
  vehicles[type].forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.name + '|' + v.rent;
    opt.textContent = v.name;
    vehicleSelect.appendChild(opt);
  });
  updateRentFromVehicle();
}

function updateRentFromVehicle() {
  const parts = vehicleSelect.value.split('|');
  rentInput.value = parts[1] || '';
}

typeSelect.addEventListener('change', loadVehicleOptions);
vehicleSelect.addEventListener('change', updateRentFromVehicle);

calcBtn.addEventListener('click', () => {
  const rent = parseFloat(rentInput.value) || 0;
  const days = parseInt(daysInput.value) || 0;
  if(!rent || !days) {
    calcResult.textContent = 'Please select a vehicle and enter number of days.';
    return;
  }
  const total = rent * days;
  calcResult.textContent = `Total rent for ${days} day(s): $${total.toFixed(2)}`;
});

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem('bookings')||'[]');
  } catch(e) { return []; }
}
function saveBookings(arr) {
  localStorage.setItem('bookings', JSON.stringify(arr));
}

bookBtn.addEventListener('click', () => {
  const user = username.value.trim();
  if(!user) { alert('Please enter your name'); return; }
  const vehicleParts = vehicleSelect.value.split('|');
  const type = typeSelect.value;
  const vehicleName = vehicleParts[0] || '';
  const rent = parseFloat(vehicleParts[1]) || 0;
  const days = parseInt(daysInput.value) || 0;
  if(!vehicleName || !days) { alert('Select vehicle and enter days'); return; }
  const total = rent * days;
  const bookings = getBookings();
  const id = (bookings.length?bookings[bookings.length-1].id+1:1);
  const booking = {id, user, type, vehicleName, rent, days, total, bookedAt: new Date().toISOString()};
  bookings.push(booking);
  saveBookings(bookings);
  renderBookings();
  modalMsg.textContent = `Hi ${user}! Your booking for ${vehicleName} (${days} day(s)) was successful. Total: $${total.toFixed(2)}.`;
  modal.classList.remove('hidden');
});

clearBtn.addEventListener('click', () => {
  if(confirm('Clear all bookings?')) {
    saveBookings([]);
    renderBookings();
  }
});

closeModal.addEventListener('click', () => modal.classList.add('hidden'));

function renderBookings() {
  const bookings = getBookings();
  bookingsTableBody.innerHTML = '';
  bookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${b.id}</td><td>${b.user}</td><td>${b.type}</td><td>${b.vehicleName}</td><td>${b.days}</td><td>$${b.total.toFixed(2)}</td>`;
    bookingsTableBody.appendChild(tr);
  });
}

// Initialize
loadVehicleOptions();
renderBookings();
