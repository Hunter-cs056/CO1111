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
async function fetchTreasureHunt() {
    try {
        //Request the data and wait for a response to store as JSON object
        const response = await fetch(`${API_LINK}/list`);
        //Wait for response
        const data = await response.json();
        //If the response was "OK" we call the render TreasureHunts Function
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






















