/* ===========================
    GLOBAL VARIABLES
   ========================== */
let sessionId = getCookie("sessionID");
let selectedTreasureHunt = null;
let playerName = getCookie("playerName");
let score = getCookie("score");
let qrCameras= [];
let qrCurrentCameraIndex=0;
let qrScanner=null;

//Standard API URL part
const API_LINK= "https://codecyprus.org/th/api";

/* ===========================
    GET  TREASURE HUNTS
   ========================== */
async function getTreasureHunts() {
    try {
        //Request the data and wait for a response to store as JSON object
        const response = await fetch(`${API_LINK}/list`);
        //Wait for response
        const data = await response.json();
        //If the response was "ok" we call the render TreasureHunts Function
        if (data.status === "OK") {
            //Call the function with the array of TrHunts as parameter
            renderTreasureHunts(data.treasureHunts);
        }
        //Else show an error msg
        else{
            console.error("API Error: " + data.errorMessages);
        }
    }
        //Handle network errors or manual throw errors
    catch(error) {
        console.error("Network Error: " + error);
    }
}

/* ===========================
    DISPLAY THE TREASURE HUNTS
   ========================== */
//This Function will display a TreasureHunt list
function renderTreasureHunts(list) {
    //First access the div in HTML where the List will be displayed
    const container = document.getElementById("TrHuntList");
    container.innerHTML = "";//Clear previous content
    //Loop through the TreasureHunts
    list.forEach(hunt => {
        //For each TrHunt create a label of the same class
        const option = document.createElement("label");
        option.className = "TreasureHuntOption";
        //Access the label for the TreasureHunt and display the option it represents using
        //hunt.id
        option.innerHTML=`
        <input type="radio" name="TreasureHunt" value="${hunt.uuid}">
        ${hunt.name}
        `;
        //Put the option inside the list
        container.appendChild(option);
    });
}
/* ===========================
   START GAME
   ========================== */
//Function to start the Game
function startGame(){
    //Checks if the player has selected a TrHunt
    const selected = document.querySelector("input[name='TreasureHunt']:checked");
    //If not display an alert
    if (!selected) {
        alert("Please select a TreasureHunt first!");
        return;
    }
    //Variable to store the (hunt.uuid) of the selected TreasureHunt
    selectedTreasureHunt = selected.value;
    //open modal
    document.getElementById("Modalname").style.display="flex";
    document.getElementById("player-name").focus();
}

/* ===========================
   PLAYER NAME MODAL FUNCTIONS
   ========================== */
function closeModal(){
    document.getElementById("Modalname").style.display="none";
    document.getElementById("player-name").value="";
}
//what happens when player clicks start in modal
async function startModal() {
    const input = document.getElementById("player-name");
    const name = input.value.trim();

    console.log("Typed name: ", name);

    if (name === "") {
        alert("Please enter a valid name.");
        return;
    }
    playerName = name;
    setCookie("playerName", playerName,1);
    closeModal();

    try {
        console.log("Sending to API:", name);
        const response = await fetch(
            `${API_LINK}/start?player=${encodeURIComponent(playerName)}&app=webapp&treasure-hunt-id=${encodeURIComponent(selectedTreasureHunt)}`);
        const data = await response.json();

        if (data.status === "OK") {
            sessionId = data.session;
            setCookie("sessionID", sessionId,1);

            document.getElementById("SelectionArea").style.display = "none";
            document.getElementById("GameArea").style.display = "block";

            loadQuestion();
        } else {
            const msg= (data.errorMessages && data.errorMessages.length)
                ? data.errorMessages.join("\n")
                : "Invalid player name! Try again!";
            alert(msg);
            //reopen modal so player can try again
            document.getElementById("Modalname").style.display = "flex";
            document.getElementById("player-name").focus();
        }
    }
    catch(error){
        console.error("Network Error: " + error);
        alert("Network error. Try again!");
    }
}






/* ===========================
   LOAD QUESTION
   ========================== */
//Function to Load Questions
async function loadQuestion() {
    try{
        //Call the API/question with ${sessionId} as parameter(sessionId was a result of the /start API)
        const response = await fetch(`${API_LINK}/question?session=${sessionId}`);
        const data = await response.json();
        //First Display the error if there is one
        if (data.status !== "OK") {
            console.error("Question Error:", data.errorMessages);
            return;
        }
        //Check if the selected treasureHunt is already completed
        if(data.completed){
            //Inform the user
            document.getElementById("QuestionText").innerText="You have completed this TreasureHunt!";
            //Empty out any question options
            document.getElementById("AnswerArea").innerHTML="";
            //Make all the buttons invisible
            document.getElementById("SubmitAnswerBtn").style.display="none";
            document.getElementById("SkipAnswerBtn").style.display="none";
            document.getElementById("SendLocationBtn").style.display="none";
            document.getElementById("leaderboardbtn").style.display="none";
            showQRScanBtn(false);
            //Make the raw leaderboard appear, and we hide the modal leaderboard
            document.getElementById("finalLeaderboard").style.display="block";
            document.getElementById("playAgainBtn").style.display="block";
            document.getElementById("feedback").style.display="none";
            document.getElementById("questionProgress").style.display="none";
            createLeaderboard("finalLeaderboardList");
            //Clear the saved session so the resume prompt does not appear on our next visit
            clearGameCookies();
            return;
        }
        //If no ERROR appears and the TrHunt is not completed already,the function will continue as expected
        //Call the createLeader Board
        createLeaderboard();
        //Inform the user about the current question and the total number of questions
        document.getElementById("questionProgress").innerText=
            `Question ${data.currentQuestionIndex + 1} of ${data.numOfQuestions}`;

        //Update the score here as well in case of a cookie
        updateScore();
        //Display the question Text
        document.getElementById("QuestionText").innerHTML=data.questionText;

        //Clear the previous Answer Area
        const answerArea = document.getElementById("AnswerArea");
        answerArea.innerHTML="";
        //Clear the previous Feedback area
        const feedbackArea = document.getElementById("feedback");
        feedbackArea.innerHTML="";

        //A switch handles each question type using data.questionType
        //Cases will be the possible answer types: BOOLEAN/INTEGER/NUMERIC/MCQ/TEXT
        switch (data.questionType){
            //In case of boolean create 2 buttons for the 2 possible answers(True/False) of the same class
            case "BOOLEAN":
                answerArea.innerHTML=`
                    <button class="boolBtn" data-value="true">True</button>
                    <button class="boolBtn" data-value="false">False</button>
                `;
                //Select all btn with class="boolBtn" and add an Event listener
                //On click call the submitAnswer() function with btn.dataset.value as the parameter
                document.querySelectorAll(".boolBtn").forEach(btn=>{
                    btn.addEventListener("click", ()=>submitAnswer(btn.dataset.value));
                });
                break;
            //In case of integer create an input box of type integer
            case "INTEGER":
                answerArea.innerHTML=`<input type="number" id="answerInput">`;
                break;
            //In case of a numeric create an input box of type number and add the step atrbute
            case "NUMERIC":
                answerArea.innerHTML=`<input type="number" step="0.01" id="answerInput">`;
                break;
            //In case of MCQ create buttons for each multiple choice answer
            case "MCQ":
                answerArea.innerHTML=`
                    <button class="mcqBtn" data-value="A">A</button>
                    <button class="mcqBtn" data-value="B">B</button>
                    <button class="mcqBtn" data-value="C">C</button>
                    <button class="mcqBtn" data-value="D">D</button>
                `;
                document.querySelectorAll(".mcqBtn").forEach(btn=>{
                    btn.addEventListener("click", ()=>submitAnswer(btn.dataset.value));
                });
                break;
            case "TEXT":
                answerArea.innerHTML=`<input type="text" id="answerInput">`;
                break;
        }
        //Makes the QR button visible whenever a question is loaded
        showQRScanBtn(true)
        //Skip button functionality that calls the skipQuestion() function
        const skipBtn = document.getElementById("SkipAnswerBtn");
        skipBtn.onclick = () =>{
            if(data.canBeSkipped){
                skipQuestion();
            }
            else {
                alert("This Question cannot be skipped!");
            }
        }
        //Location Requirement btn functionality
        const locationBtn = document.getElementById("SendLocationBtn");
        if(data.requiresLocation){
            locationBtn.style.display="block";
            locationBtn.onclick = sendLocation;
        }else {
            locationBtn.style.display="none";
        }
        //Submit Answer button functionality that calls  submitAnswer() using the id of the question as the parameter
        const submitBtn = document.getElementById("SubmitAnswerBtn");
        submitBtn.onclick = () =>{
            const input = document.getElementById("answerInput");
            if (input){
                //We use trim to remove any white spaces around the answer
                const value = input.value.trim();
                if (value === ""){
                    alert("Please enter an answer before Submitting!");
                    return;
                }
                submitAnswer(value);
            }
        };
    }catch(error) {
        console.error("Network Error: " + error);
    }
    //Re-enable the disabled buttons after the UI is finished loading
    disableButtons(false);
}
/* ===========================
   SUBMIT  ANSWER
   ========================== */
async function submitAnswer(answerValue){
    //Disable Buttons to prevent user's spamming
    disableButtons(true);
    try{
        //Here we will use encodeURIComponent for the answerValue to protect the integrity of the data and ensure the functionality of the API call
        const response = await fetch(`${API_LINK}/answer?session=${sessionId}&answer=${encodeURIComponent(answerValue)}`);
        const data = await response.json();
        if (data.status !== "OK") {
            console.error("Answer error:", data.errorMessages);
            //Re-enable the buttons in case of on error
            disableButtons(false);
            return;
        }
        //Show feedback
        document.getElementById("feedback").innerText=data.message;
        //Call the updateScore function
        updateScore();
        if(data.correct){
            // Load next question after 2 seconds
            setTimeout(() => {
                loadQuestion();
            }, 2000);
        }
        else {
            //Re-enable the buttons so the player can retry
            disableButtons(false);
        }

    }
    catch(error){
        console.error("Network Error: " + error);
        //Re-enable the buttons in case of an error
        disableButtons(false);
    }
}
/* ===========================
   SKIP  QUESTION
   ========================== */
async function skipQuestion(){
    //Disable Buttons to prevent user's spamming
    disableButtons(true);
    try {
        const response = await fetch(`${API_LINK}/skip?session=${sessionId}`);
        const data = await response.json();
        if (data.status !== "OK") {
            console.error("Skip Error:", data.errorMessages);
            disableButtons(false);
            return;
        }
        //Display feedback message
        document.getElementById("feedback").innerText=data.message;
        //Call the updateScore function after skipping
        updateScore();
        //Load next question after 2 seconds
        setTimeout(() =>{
            loadQuestion();
        },2000);

    }
    catch(error){
        console.error("Network Error: " + error);
    }
}

/* ===========================
    UPDATE SCORE
   =========================== */
async function updateScore(){
    try {
        const response = await fetch (`${API_LINK}/score?session=${sessionId}`);
        const data = await response.json();

        if (data.status !== "OK") {
            console.error("Score Error:", data.errorMessages);
            return;
        }
        score = data.score;
        setCookie("score", score,1);
        //Update Score being displayed.
        document.getElementById("scoreDisplay").innerText = `Score: ${score}`;
    } catch (error){
        console.error("Network Error: " + error);
    }
}

/* ===========================
   SHARE LOCATION
   ========================== */
async function sendLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const response = await fetch(`${API_LINK}/location?session=${sessionId}&latitude=${lat}&longitude=${lon}`);
            const data = await response.json();

            if (data.status !== "OK") {
                console.error("Location Error: ", data.errorMessages);
                return;
            }

            // Show feedback from the API
            document.getElementById("feedback").innerText = data.message;

            // Update score after sending location
            updateScore();

            // Load next question after  2 seconds
            setTimeout(() => {
                loadQuestion();
            }, 2000);

        } catch (error) {
            console.error("Network Error:", error);
        }
    }, () => {
        alert("Unable to retrive your location.");
    });
}

/* ===========================
   SILENT LOCATION UPDATER
   ========================== */
 function sendLocationSilent() {

    if (!navigator.geolocation)  return;

    navigator.geolocation.getCurrentPosition(async position => {
        if(!sessionId) return; //Onload the app will ask for permission and skip waste the API call

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const response = await fetch(`${API_LINK}/location?session=${sessionId}&latitude=${lat}&longitude=${lon}`);
            const data = await response.json();

            if (data.status !== "OK") {
                console.error("Silent Location Error: ", data.errorMessages);
                return;
            }
            console.log("Location updated silently");
        } catch (error) {
            console.error("Silent Location Network Error:", error);
        }
    }, () => {
        console.log("Please give access to location");
    });
}

/* ==========================
   LEADERBOARD FUNCTION
   ========================== */
async function createLeaderboard (containerId="leaderboardList") {
    try {

        //Make the API call
        const response = await fetch(`${API_LINK}/leaderboard?session=${sessionId}&sorted&limit=10`);
        const data = await response.json();

        //Check if response was successful
        if (data.status !== "OK") {
            console.error("LeaderBoard Error:", data.errorMessages);
            return;
        }
        //Render leaderboard
        renderLeaderboard(data.leaderboard, data.treasureHuntName,containerId);
    }

    catch (error) {
        console.error("Network Error:", error);
    }
}

/* ==========================
   DISPLAY THE LEADERBOARD
   ========================== */
function renderLeaderboard(leaderboard, treasureHuntName,containerId="leaderboardList") {
    //Gets the container where the leader board will be displayed
    const container = document.getElementById(containerId);

    //Clear any existing content
    container.innerHTML = "";

    //Create and add the title element
    const titleElement = document.createElement("li");
    titleElement.className = "leaderboard-title";
    titleElement.textContent = `Treasure Hunt: ${treasureHuntName}`;
    container.appendChild(titleElement);

    //Create and add the header element
    const headerElement = document.createElement("li");
    headerElement.className = "leaderboard-header";
    headerElement.innerHTML = "<strong>Rank</strong> <strong>Player</strong> <strong>Score</strong> <strong>Completion Time</strong>";
    container.appendChild(headerElement);

    console.log(leaderboard);

    //Loop through each player in the leaderboard array
    leaderboard.forEach ((leaderboardEntry, index) => {

        //Create a list item for each player
        const listItem = document.createElement("li");
        listItem.className = "leaderboard-item";

        //Formatting the completion time text
        let completionTimeText;
        if (leaderboardEntry.completionTime === 0) {
            completionTimeText = "In progress";
        }
        else {
            const date = new Date(leaderboardEntry.completionTime);
            completionTimeText = date.toLocaleString();
        }

        console.log(leaderboardEntry.name);

        //Fill the list item
        listItem.innerHTML = `<span>${index + 1}</span> <span>${leaderboardEntry.player}</span> <span>${leaderboardEntry.score}</span> <span>${completionTimeText}</span>`;

        //Add the filled list item to the container
        container.appendChild(listItem);
    });

}


/* ===========================
   LEADERBOARD MODAL FUNCTIONS
   ========================== */
    async function openLeaderBoardModal() {
        try {
            await createLeaderboard();
        }
        catch (error) {
            console.error("Failed to load leaderboard:", error);
        }
        //Show the leaderboard
        document.getElementById("leaderboardModal").style.display = "block";
    }

    function closeLeaderBoardModal() {
        document.getElementById("leaderboardModal").style.display = "none";
    }

/* ===========================
   DISABLE BUTTON FUNCTION
   ========================== */
function disableButtons(value){
    document.getElementById("SubmitAnswerBtn").disabled = value;
    document.getElementById("SkipAnswerBtn").disabled = value;
    //Using the same strategy on classes worn work because:
    // getElementsByClassName returns a list of elements on which .disable does not work
    //So we have to use querySelectorAll to loop through each element individually
    document.querySelectorAll(".mcqBtn").forEach(btn => btn.disabled = value);
    document.querySelectorAll(".boolBtn").forEach(btn => btn.disabled = value);
}

/* ===========================
   CLEAR GAME COOKIES
   ========================== */
function clearGameCookies(){
    //Doing this will clear the browser cookie by expiring its date
    setCookie("sessionID","",-1);
    setCookie("playerName","",-1);
    setCookie("score","",-1);
    //But we also have to clear our variables by setting them to Null
    sessionId= null;
    playerName=null;
    score = null;
}
/* ===========================
   CONTINUE GAME FUNCTION
   ========================== */
async function continueGame(){
    //Only show if a saved session cookie actually exists
    if(!sessionId || sessionId ===""){
        document.getElementById("SelectionArea").style.display = "block";
        return;
    }

    //If a session cookie exist, show the modal and the playerName if we have it
    const previousName = playerName? `Player ${playerName}` : "";
    document.getElementById("resumeModalText").textContent = `Hey ${previousName}! A previous session was found.
    Would you like to continue where you left off?`;
    document.getElementById("ResumeModal").style.display = "flex";

    if (score){
        document.getElementById("scoreDisplay").innerText = `Score: ${score}`;
    }
}

/* ===========================
   QR SCANNER INITIALIZER
   ========================== */

function initQRScanner() {
    //Options for the scanner to use(scanner settings)
    let opts = {
        continuous: true,            //Default value - scans continuously for QR codes
        video: document.getElementById('qr-preview'),   //Accesses the HTML element to display the camera preview
        mirror: true,               //Mirrors the video preview shown on the device
        captureImage: false,        //We do not want the imaged saved
        backgroundScan: false,      //Reduces CPU usage when false
        refractoryPeriod: 5000,     //A QR code can be scanned every 5000milliseconds(5 seconds)
        scanPeriod: 1               //Default value to analyse frames between scans
    };
    //Initialise the scanner with our settings from above
    qrScanner = new Instascan.Scanner(opts);

    //Listen for a successful scan
    qrScanner.addListener("scan", function(scannedContent){
        console.log("QR scanned: ", scannedContent);
        //Check if the scanned content is a URL link
        let isURL = scannedContent.startsWith('http://') || scannedContent.startsWith('https://');

        if (isURL){
            //Display a clickable link in the result area that opens in a new tab
            document.getElementById('qr-result').innerHTML= 'URL: <a href="' + scannedContent + '" target="_blank">' + scannedContent + '</a>';
        }
        else {
            //Autofill the answer input with the scanned or Inserted text
            let answerInput = document.getElementById("answerInput");
            if (answerInput){
                answerInput.value = scannedContent;
                document.getElementById("qr-result").innerText = 'Inserted: ' + scannedContent;
            }
            else {
                document.getElementById("qr-result").innerText = 'Scanned: ' + scannedContent;
            }
            //Automatically close the scanner after inserting the text
            stopQRScanner();
        }
    });
    //Load available cameras
    Instascan.Camera.getCameras().then(function(foundCameras){
        //Check if the
        if(foundCameras.length > 0) {
            qrCameras = foundCameras;   //Fill the empty array

            //Disable the cycle camera buttons if only 1 camera is available
            if (qrCameras.length === 1) {
                document.getElementById("prevCamBtn").disabled = true;
                document.getElementById("nextCamBtn").disabled = true;
            }
        }
         //Display an error and remove the scanner button if no cameras are available
        else {
                console.error("QR Scanner: No cameras found.");
                document.getElementById("QRScanBtn").style.display = 'none';
        }
    }).catch(function(e){
        console.error("QR Scanner init error:", e)
    });
}

/* ===========================
   QR SCANNER - OPEN
   ========================== */
function openQRScanner(){
    if(qrCameras.length ===0){
        alert("No cameras available");      //If the camera array is empty inform the user
        return;
    }
    document.getElementById("qr-result").innerHTML="";
    document.getElementById("QRModal").style.display= "flex";
    qrScanner.start(qrCameras[qrCurrentCameraIndex]);
}
/* ===========================
   QR SCANNER - CLOSE
   ========================== */
function stopQRScanner(){
    qrScanner.stop();
    document.getElementById("QRModal").style.display ="none";
}
/* ===========================
   QR SCANNER - SHOW/HIDE BUTTON
   ========================== */
function showQRScanBtn(visible){
    document.getElementById("QRScanBtn").style.display = visible? "inline-block" : "none";
}





/* ===========================
   EVENT LISTENERS
   ========================== */
document.getElementById("submitTrHunt").addEventListener("click", startGame);
document.getElementById("startbutton").addEventListener("click", startModal);
document.getElementById("cancelbutton").addEventListener("click",closeModal);
document.getElementById("leaderboardbtn").addEventListener("click",openLeaderBoardModal);
document.getElementById("closeLeaderboardBtn").addEventListener("click", closeLeaderBoardModal);
document.getElementById("QRScanBtn").addEventListener("click",openQRScanner)
document.getElementById("closeQRBtn").addEventListener("click",stopQRScanner)
document.getElementById("prevCamBtn").addEventListener("click",function (){
    qrCurrentCameraIndex = (qrCurrentCameraIndex- 1 + qrCameras.length) % qrCameras.length;
    qrScanner.start(qrCameras[qrCurrentCameraIndex]);
});
document.getElementById("nextCamBtn").addEventListener("click",function (){
    qrCurrentCameraIndex = (qrCurrentCameraIndex+1) % qrCameras.length;
    qrScanner.start(qrCameras[qrCurrentCameraIndex]);
});

//Continue Game Modal button event listeners
//If the player chooses to load the previous session, hide the modal and the TrHunt selection and call the loadQuestion()
document.getElementById("resumeYesBtn").addEventListener("click", ()=>{
    document.getElementById("ResumeModal").style.display = "none";
    document.getElementById("SelectionArea").style.display = "none";
    document.getElementById("GameArea").style.display = "block";
    loadQuestion();
});
//If the player chooses to start a new session, close the modal,clear the cookies and let him choose the TrHunt he wants
document.getElementById("resumeNoBtn").addEventListener("click", ()=>{
    document.getElementById("ResumeModal").style.display = "none";
    document.getElementById("SelectionArea").style.display = "block";
    clearGameCookies();
})


/* ===========================
   LINK BUTTONS
   ========================== */
//let links = document.getElementsByClassName("social-link")
//links.setAttribute("target", "_blank");


/* ===========================
   INITIAL LOAD(WHEN APP LAUNCHES)
   ========================== */
continueGame();
getTreasureHunts();
initQRScanner()
sendLocationSilent()                                //Will ask for location access on page load
const sessionChecker = setInterval(()=>{        //Will check for sessionId every 10 seconds
    if (sessionId){
        setInterval(sendLocationSilent, 30000); //After a session exists, the location will silently update every 30 seconds silently

        clearInterval(sessionChecker);                  //After the location interval is active, we disable the session checker.
    }
},10000);

// cookie functions 
function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    let exp = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + ";" + exp + ";path=/";
}
function getCookie(cName) {
  let name = cName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

