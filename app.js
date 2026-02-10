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
        <input type="radio" name="TreasureHunt" value="${hunt.id}">
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
    //Variable to store the (hunt.id) of the selected TreasureHunt
    selectedTreasureHunt = selected.value;

    //For now a random Player name just for testing
    const playerName ="Player" + Math.floor(Math.random() * 1000);
    //Now we call the API while using the playerName and TreasureHuntId as parameters
    try{
        const response = await fetch(`${API_LINK}/start?player=${playerName}&app=webapp&treasure-hunt-id=${selectedTreasureHunt}`);
        const data = await response.json();
        //If the response was "ok"
        if (data.status === "OK") {
            //Create a variable to store the session id
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
   EVENT LISTENER
   ========================== */
document.getElementById("submitTrHunt").addEventListener("click", startGame);

/* ===========================
   INITIAL LOAD(WHEN APP LAUNCHES)
   ========================== */
getTreasureHunts();


















