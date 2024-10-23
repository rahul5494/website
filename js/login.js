// Burger menu toggle
const burgerMenu = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');

burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burgerMenu.classList.toggle('toggle');
});

// Password visibility toggle
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    // Toggle password visibility
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle the eye icon
    this.classList.toggle('fa-eye-slash');
});


function toggleSubjects() {
    const classSelection = document.getElementById('classSelection').value;
    const subjectSelection = document.getElementById('subjectSelection');

    if (classSelection == "11" || classSelection == "12") {
        subjectSelection.style.display = "block";
    } else {
        subjectSelection.style.display = "none";
    }
}

function validateForm() {
   
    const mobileNumber = document.getElementById("mobileNumber").value;
    const aadhaarNumber = document.getElementById("aadhaarNumber").value;

    const mobileRegex = /^[0-9]{10}$/;
    const aadhaarRegex = /^[0-9]{12}$/;


    // Validate mobile number
    if (!mobileRegex.test(mobileNumber)) {
        document.getElementById("mobileNumberError").textContent = "Mobile number should be exactly 10 digits.";
        document.getElementById("mobileNumberError").style.display = "block";
        return false;
    } else {
        document.getElementById("mobileNumberError").style.display = "none";
    }

    // Validate Aadhaar number
    if (!aadhaarRegex.test(aadhaarNumber)) {
        document.getElementById("aadhaarNumberError").textContent = "Aadhaar number should be exactly 12 digits.";
        document.getElementById("aadhaarNumberError").style.display = "block";
        return false;
    } else {
        document.getElementById("aadhaarNumberError").style.display = "none";
    }


    return true;
}
