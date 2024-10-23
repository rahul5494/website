// Burger menu toggle
const burgerMenu = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');

burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burgerMenu.classList.toggle('toggle');
});

// Fetch due fees and UPI message from the backend (simulated here with variables)
const dueFees = document.getElementById('dueFees').innerText;  // This would be replaced dynamically by the backend
const upiMessage = "School Fees Payment";  // Example message

// Generate the QR Code using the UPI link
const upiLink = `upi://pay?pa=9772539583@ibl&pn=Rahul Kumar Prajapat&am=${dueFees}&cu=INR&tn=${upiMessage}`;

QRCode.toCanvas(document.getElementById("qrcode"), upiLink, function (error) {
    if (error) console.error(error);
    console.log("QR Code generated successfully!");
});
