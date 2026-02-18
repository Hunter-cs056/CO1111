/* ===========================
    GLOBAL VARIABLES
   ========================== */
let sessionId = null;
let selectedTreasureHunt = null;

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
async function startGame(){
    //Checks if the player has selected a TrHunt
    const selected = document.querySelector("input[name='TreasureHunt']:checked");
    //If not display an alert
    if (!selected) {
        alert("Please select a TreasureHunt first!");
        return;
    }
    //Variable to store the (hunt.uuid) of the selected TreasureHunt
    selectedTreasureHunt = selected.value;

    //For now a random Player name just for testing(Later we will call the API and check if the error Msg for used Name)
    const playerName ="Player" + Math.floor(Math.random() * 1000);
    //Now we call the API while using the playerName and TreasureHuntId as parameters
    try{
        //Call the API/start with ${playerName} and ${selectedTreasureHunt} as parameters on the URL
        const response = await fetch(`${API_LINK}/start?player=${playerName}&app=webapp&treasure-hunt-id=${selectedTreasureHunt}`);
        const data = await response.json();
        //If the response was "ok"
        if (data.status === "OK") {
            //Assign to our variable the session id
            sessionId=data.session;
            //Make the SelectionArea section  not visible
            document.getElementById("SelectionArea").style.display="none";
            //Then make the GameArea section visible(It was  invisible at start)
            document.getElementById("GameArea").style.display="block";
            //Call the function that loads the Questions
            loadQuestion();
        }
        else {
            console.error("Start Error: " , data.errorMessages);
        }
    }catch(error) {
        console.error("Network Error: " + error);
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
            return;
        }
        //If no ERROR appears and the TrHunt is not completed already,the function will continue as expected

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
}
/* ===========================
   SUBMIT  ANSWER
   ========================== */
async function submitAnswer(answerValue){
    try{
        //Here we will use encodeURIComponent for the answerValue to protect the integrity of the data and ensure the functionality of the API call
        const response = await fetch(`${API_LINK}/answer?session=${sessionId}&answer=${encodeURIComponent(answerValue)}`);
        const data = await response.json();
        if (data.status !== "OK") {
            console.error("Answer error:", data.errorMessages);
            return;
        }
        //Show feedback
        document.getElementById("feedback").innerText=data.message;
        //Call the updateScore function
        updateScore();
        //Load next Question after 5 seconds
        setTimeout(() =>{
            loadQuestion();
        },5000);
    }
    catch(error){
        console.error("Network Error: " + error);
    }
}
/* ===========================
   SKIP  QUESTION
   ========================== */
async function skipQuestion(){
    try {
        const response = await fetch(`${API_LINK}/skip?session=${sessionId}`);
        const data = await response.json();
        if (data.status !== "OK") {
            console.error("Skip Error:", data.errorMessages);
            return;
        }
        //Display feedback message
        document.getElementById("feedback").innerText=data.message;
        //Call the updateScore function after skipping
        updateScore();
        //Load next question after 5 seconds
        setTimeout(() =>{
            loadQuestion();
        },3000);

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
        //Update Score being displayed.
        document.getElementById("scoreDisplay").innerText = `Score: ${data.score}`;
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

            // Load next question after  3 seconds
            setTimeout(() => {
                loadQuestion();
            }, 3000);
        } catch (error) {
            console.error("Network Error:", error);
        }
    }, () => {
        alert("Unable to retrive your location.");
    });
}

/* ===========================
   EVENT LISTENER
   ========================== */
document.getElementById("submitTrHunt").addEventListener("click", startGame);

/* ===========================
   INITIAL LOAD(WHEN APP LAUNCHES)
   ========================== */
getTreasureHunts();


















