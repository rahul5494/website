// Mobile menu toggle
const burger = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// Show subjects based on class selection
function toggleSubjects() {
    const classSelection = document.getElementById('classSelection').value;
    const subjectSelection = document.getElementById('subjectSelection');

    if (classSelection == "11" || classSelection == "12") {
        subjectSelection.style.display = "block";
    } else {
        subjectSelection.style.display = "none";
    }
}

// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirmPassword');

togglePassword.addEventListener('click', () => {
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
    togglePassword.classList.toggle('fa-eye-slash');
});

toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordField.type === 'password' ? 'text' : 'password';
    confirmPasswordField.type = type;
    toggleConfirmPassword.classList.toggle('fa-eye-slash');
});

function validateForm() {
    // Get the form values
    const studentName = document.getElementById("studentName").value;
    const fatherName = document.getElementById("fatherName").value;
    const motherName = document.getElementById("motherName").value;
    const mobileNumber = document.getElementById("mobileNumber").value;
    const aadhaarNumber = document.getElementById("aadhaarNumber").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const aadhaarRegex = /^[0-9]{12}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character

    // Validate student name
    if (!nameRegex.test(studentName)) {
        document.getElementById("studentNameError").textContent = "Student name should only contain alphabets and spaces.";
        document.getElementById("studentNameError").style.display = "block";
        return false;
    } else {
        document.getElementById("studentNameError").style.display = "none";
    }

    // Validate father's name
    if (!nameRegex.test(fatherName)) {
        document.getElementById("fatherNameError").textContent = "Father's name should only contain alphabets and spaces.";
        document.getElementById("fatherNameError").style.display = "block";
        return false;
    } else {
        document.getElementById("fatherNameError").style.display = "none";
    }

    // Validate mother's name
    if (!nameRegex.test(motherName)) {
        document.getElementById("motherNameError").textContent = "Mother's name should only contain alphabets and spaces.";
        document.getElementById("motherNameError").style.display = "block";
        return false;
    } else {
        document.getElementById("motherNameError").style.display = "none";
    }

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

    // Validate password
    if (!passwordRegex.test(password)) {
        document.getElementById("passwordError").textContent = "Password must be at least 8 characters, with one uppercase, one lowercase, one digit, and one special character.";
        document.getElementById("passwordError").style.display = "block";
        return false;
    } else {
        document.getElementById("passwordError").style.display = "none";
    }

    // Validate password matching
    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        document.getElementById("confirmPasswordError").style.display = "block";
        return false;
    } else {
        document.getElementById("confirmPasswordError").style.display = "none";
    }

    return true;
}
