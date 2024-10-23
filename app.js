const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {Pool} = require('pg')
require('dotenv').config();
const ip = require('ip');
const { ifError } = require('assert');
const ipAdd = ip.address();
const QRCode = require('qrcode');


const app = express();
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'static' folder
app.use('/static', express.static(path.join(__dirname, 'static')));

// Serve static files from the 'js' folder
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve HTML files from the 'html' folder
app.use(express.static(path.join(__dirname, 'html')));



//Database
const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

app.get('/try' , async(req,res) => {
    try{
        const result = await pool.query('SELECT * FROM "classFees"');
        res.json(result.rows)
    }
     catch (err){
        res.send(err)
     }
});





//get dData--------------------------------------------------------------------------------------------------------------------------------




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'home.html'));
});




app.get('/admission',(req,res)=>{
    res.sendFile(path.join(__dirname, 'html', 'admission.html'));
})




app.get('/results',(req,res)=>{
    res.sendFile(path.join(__dirname, 'html', 'result.html'));
})




app.get('/fees',(req,res)=>{
    res.sendFile(path.join(__dirname, 'html', 'fees.html'));
})





app.get('/notices',(req,res)=>{
    res.sendFile(path.join(__dirname, 'html', 'notices.html'));
})






//Pay Fees
app.get('/about-us',(req,res)=>{
    res.sendFile(path.join(__dirname, 'html', 'about.html'));
})








app.get('/update-info',(req,res)=>{
    res.sendFile(path.join(__dirname, 'html', 'update.html'));
})



//Post Data----------------------------------------------------------------------------------------------------------------------------------

//Admission Form Complete
app.post('/admission/auth', async (req, res) => {
    const { studentID ,studentName, fatherName, motherName, mobileNumber, aadhaarNumber, dob, classSel, subject, password } = req.body;
    const data = [studentID ,studentName, fatherName, motherName, mobileNumber, aadhaarNumber, dob, classSel, subject, password];
    const userExists = (await pool.query(`SELECT * FROM "student_data" WHERE "studentID"= '${studentID}'`)).rowCount;
    if (userExists == 0){
        await pool.query(
            'INSERT INTO "student_data" ("studentID", "studentName", "fatherName", "motherName", "mobileNumber", "aadhaarNumber", dob, class, section, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',data
        )
        res.sendFile(path.join(__dirname, 'html', 'admission-success.html'));
    }
    else if(userExists > 0){
        res.send(`<body style = "width: 100%;height: 100vh; display: flex; align-items: center; justify-content: center;">
        <p style = "text-align: center; font-size: 20px; ">
            User already registered <b> </b><a href='/admission' > <br>Go Back </a>
        </p>
        </body>`)
    }
    else if (err){
        res.send(`<body style = "width: 100%;height: 100vh; display: flex; align-items: center; justify-content: center;">
            <p style = "text-align: center; font-size: 20px; ">
                ${err} <b> </b><a href='/admission' > <br>Go Back </a>
            </p>
            </body>`)
    }
    else{
        console.log("FUCK")
    }
});
// Admission Form Submit




// Update Form

app.post('/update-info/auth', async (req,res) => {
    var {loginID, classSel , subject , aadhaarNumber, mobileNumber , password} = req.body;
    ifExists = (await pool.query(`SELECT * FROM "student_data" WHERE "studentID" = '${loginID}'`));
    if(ifExists.rowCount == 1){
        const savedPass = ifExists.rows[0].password;
        var savedClass = ifExists.rows[0].class;
        var savedSection = ifExists.rows[0].section ;
        var savedAadhaar = ifExists.rows[0].aadhaarNumber;
        var savedNumber = ifExists.rows[0].mobileNumber;
        if (classSel == null || classSel == ''){
            classSel = savedClass
        }
        if (subject == null || subject == ''){
            subject = savedSection;
        }
        if (aadhaarNumber == null || aadhaarNumber == ''){
            aadhaarNumber = savedAadhaar
        }
        if (mobileNumber == null || mobileNumber == ''){
            mobileNumber = savedNumber
        }
        
    
        if(ifExists.rowCount == 1 && savedPass == password){
            try{
                await pool.query(`
                    UPDATE "student_data" SET "class" = $1, "section" = $2, "aadhaarNumber" = $3, "mobileNumber" = $4 WHERE "studentID" = $5`, [classSel, subject, aadhaarNumber, mobileNumber, loginID]);
                    res.send(`<body style = "width: 100%;height: 100vh; display: flex; align-items: center; justify-content: center;">
            <p style = "text-align: center; font-size: 20px; ">
                 <b>Data has been Updated </b><a href='/' > <br>Go Back </a>
            </p>
            </body>`)
                }            
            catch(err){
               res.send(err)
            }
        }
    
        else{
            res.send(`<body style = "width: 100%;height: 100vh; display: flex; align-items: center; justify-content: center;">
            <p style = "text-align: center; font-size: 20px; ">
                 <b>Incorrect Password... </b><a href='/update-info' > <br>Go Back </a>
            </p>
            </body>`)
    
        }
    }
    else{
        res.send(`<body style = "width: 100%;height: 100vh; display: flex; align-items: center; justify-content: center;">
            <p style = "text-align: center; font-size: 20px; ">
                User Not Found <b> </b><a href='/update-info' > <br>Go Back </a>
            </p>
            </body>`)
    }
})



app.post('/fees/pay-fees', async (req,res) =>{
    const {loginID, password} = req.body;
    loginData = await pool.query(`SELECT "studentID", "studentName", "password", "class", "section" FROM "student_data" WHERE "studentID" = '${loginID}'`);
    if(loginData.rowCount == 1){
        const studentID = loginData.rows[0].studentID;
        const studentName = loginData.rows[0].studentName;
        const studentClass = loginData.rows[0].class;
        const realPassword = loginData.rows[0].password;
        const fees = (await pool.query(`SELECT "fees" FROM "classFees" WHERE "class" = '${studentClass}'`)).rows[0].fees;
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleString();
        if(studentID == loginID && realPassword == password){
            const upiLink = `upi://pay?pa=9772539583@ibl&pn=Rahul Kumar Prajapat&am=${fees}&cu=INR&tn=${studentName}${studentClass}${formattedTime}`;
            var upiQR
            try{
                upiQR = await QRCode.toDataURL(upiLink);
            }
            catch(err){
                err
            }
            res.send(`'
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>NCUP | Pay Fees</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet"> <!-- Font Awesome for icons -->
                    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js"></script> <!-- QR Code Library -->
                    <style>
                        /* General Reset */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Arial', sans-serif;
                }
                
                body {
                    background-color: #f5f5f5;
                }
                
                /* Container Styles */
                .container {
                    max-width: 600px;
                    margin: 120px auto;
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                }
                
                h3 {
                    text-align: center;
                    margin: 20px 0;
                    color: #007bff;
                }
                
                .fees-info {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 1.2rem;
                    color: #333;
                }
                
                .qr-section {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .qr-section #qrcode {
                    display: inline-block;
                    padding: 10px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                .upi-details {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 1rem;
                    color: #555;
                }
                
                /* Navbar Styling */
                .navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #1e1e1e;
                    padding: 1rem 2rem;
                    position: fixed;
                    width: 100%;
                    top: 0;
                    z-index: 1000;
                }
                
                .navbar .logo a {
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #fff;
                    text-decoration: none;
                }
                
                .nav-links {
                    list-style: none;
                    display: flex;
                }
                
                .nav-links li {
                    margin-left: 20px;
                }
                
                .nav-links li a {
                    color: #fff;
                    text-decoration: none;
                    font-size: 1.2rem;
                    transition: color 0.3s ease;
                }
                
                .nav-links li a:hover {
                    color: #ffb703;
                }
                
                .burger {
                    display: none;
                    cursor: pointer;
                }
                
                .burger div {
                    width: 25px;
                    height: 2px;
                    background-color: #fff;
                    margin: 5px;
                    transition: all 0.3s ease;
                }
                
                @media screen and (max-width: 768px) {
                    .nav-links {
                        position: absolute;
                        right: 0px;
                        height: 100vh;
                        top: 0;
                        background-color: #1e1e1e;
                        flex-direction: column;
                        align-items: center;
                        width: 50%;
                        transform: translateX(100%);
                        transition: transform 0.3s ease-in;
                        padding-top: 100px;
                    }
                
                    .nav-links li {
                        margin: 20px 0;
                    }
                
                    .nav-links.active {
                        transform: translateX(0%);
                    }
                
                    .burger {
                        display: block;
                    }
                
                    .burger.toggle .line1 {
                        transform: rotate(-45deg) translate(-5px, 6px);
                    }
                
                    .burger.toggle .line2 {
                        opacity: 0;
                    }
                
                    .burger.toggle .line3 {
                        transform: rotate(45deg) translate(-5px, -6px);
                    }
                }
                #active{
                    color: #ffb703;
                }
                
                
                #content {
                    display: none; /* Initially hide content */
                    padding: 20px;
                }
                
                video {
                    display: inline-block;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: fit-content;
                    height: fit-content;
                    translate: -50% -50%;
                    z-index: 9999; /* Ensure it appears above all content */
                    object-fit: cover; 
                }
                
                    </style>
                    
                
                </head>
                <body>
                   <!-- Navigation Bar -->
                    <nav class="navbar">
                        <div class="logo">
                            <a href="/">BrandLogo</a> <!-- Same logo as other pages -->
                        </div>
                        <ul class="nav-links" id="navLinks">
                            <li><a href="/admission">Admission</a></li>
                            <li><a href="/results">Results</a></li>
                            <li><a href="/fees" id="active">Pay Fees</a></li>
                            <li><a href="/about-us">About Us</a></li>
                            <li><a href="/notices">Notices</a></li>
                        </ul>
                        <div class="burger" id="burgerMenu">
                            <div class="line1"></div>
                            <div class="line2"></div>
                            <div class="line3"></div>
                        </div>
                    </nav>
                
                    <!-- Main Content for Fees Page -->
                    <div class="container">
                        <h2><span id="nameOfStudent">Name: <big>${studentName}</big></span></h2>
                        <div class="fees-info">
                            <p><strong>Your Due Fees:</strong> ₹<span id="dueFees">${fees}</span></p> <!-- Backend will populate the due fees -->
                        </div>
                
                        <div class="qr-section">
                            <h3>Scan to Pay: ₹${fees}</h3>
                            <div id="qrcode"><img src="${upiQR}" width= "100%" alt="QR Code" /></div> <!-- QR Code will be generated here -->
                        </div>
                
                        <div class="upi-details">
                            <p><strong>UPI Payment Address:</strong> 9772539583@ibl</p>
                            <p><strong>Name:</strong> Rahul Kumar Prajapat</p>
                            <p><strong>Currency:</strong> INR</p>
                        </div>
                    </div>
                
                    <script>
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
                
                
                
                    </script>
                
                </body>
                </html>

                '`);
        }
    }



    else{
        res.send(`<body style = "width: 100%;height: 100vh; display: flex; align-items: center; justify-content: center;">
        <p style = "text-align: center; font-size: 20px; ">
            User Not Found <b> </b><a href='/fees' > <br>Go Back </a>
        </p>
        </body>`)
        
    }
    
})




app.post('/results/download', async (req,res) =>{
    var {loginID, classSel ,  password} = req.body;
    ifExists = (await pool.query(`SELECT * FROM "student_data" WHERE "studentID" = '${loginID}'`));
    if(ifExists.rowCount == 1){
        const mainID = ifExists.rows[0].studentID;
        const mainClass = ifExists.rows[0].class;
        const mainPass = ifExists.rows[0].password;
        if(loginID == mainID && classSel == mainClass && password == mainPass){
            res.send(`<body style = "width: 100%;height: 100vh; display: flex; align-items: center; justify-content: center;">
            <p style = "text-align: center; font-size: 20px; ">
                <b> Result coming soon</b><a href='/' > <br>Go Back </a>
            </p>
            </body>`)
        }
        else{
            res.send(`<body style = "width: 100%;height: 100vh; display: flex; align-items: center; justify-content: center;">
                <p style = "text-align: center; font-size: 20px; ">
                    <b> Incorrect Information</b><a href='/results' > <br>Go Back </a>
                </p>
                </body>`)
        }
    }
    else{
        res.send(`<body style = "width: 100%;height: 100vh; display: flex; align-items: center; justify-content: center;">
                <p style = "text-align: center; font-size: 20px; ">
                    <b> User ${loginID} not found</b><a href='/results' > <br>Go Back </a>
                </p>
                </body>`)
    }
})




app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT} OR http://${ipAdd}`);
});

