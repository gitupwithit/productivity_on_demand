const CLIENT_ID = '784556155032-lopna1i1ht68ohhpta2ufjp1ukmr9e7j.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDXf-9Y0hZi455fM5MdhLGc7Eu0X3xluSc';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const authorizeButton = document.getElementById('authorizeButton')
const calendarIcon = document.getElementById('calendarIcon');
const goalsIcon = document.getElementById('goalsIcon');
const challengesIcon = document.getElementById('challengesIcon');
const goButton = document.getElementById('goButton');

const calendarSection = document.getElementById('calendarSection');
const goalsSection = document.getElementById('goalsSection');
const challengesSection = document.getElementById('challengesSection');
const recommendationsSection = document.getElementById('recommendationsSection');

let tokenClient;
let accessToken = null;

window.onload = function () {
    initializeGisClient();
    handleClientLoad();
};


authorizeButton.addEventListener('click', requestAccessToken)

calendarIcon.addEventListener('click', () => {
    calendarSection.style.display = 'block';
    goalsSection.style.display = 'none';
    challengesSection.style.display = 'none';
    recommendationsSection.style.display = 'none';
});

goalsIcon.addEventListener('click', () => {
    goalsSection.style.display = 'block';
    calendarSection.style.display = 'none';
    challengesSection.style.display = 'none';
    recommendationsSection.style.display = 'none';
});

challengesIcon.addEventListener('click', () => {
    challengesSection.style.display = 'block';
    calendarSection.style.display = 'none';
    goalsSection.style.display = 'none';
    recommendationsSection.style.display = 'none';
});

goButton.addEventListener('click', () => {
    recommendationsSection.style.display = 'block';
    calendarSection.style.display = 'none';
    goalsSection.style.display = 'none';
    challengesSection.style.display = 'none';
});

function addGoal() {
    const newGoal = document.getElementById('newGoal').value;
    if (newGoal) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${newGoal} <input type="range" class="slider" min="0" max="100">
            <button onclick="removeGoal(this)">Remove</button>
        `;
        document.getElementById('goalsList').appendChild(li);
        document.getElementById('newGoal').value = '';
    }
}

function removeGoal(button) {
    button.parentElement.remove();
}

function addChallenge() {
    const newChallenge = document.getElementById('newChallenge').value;
    if (newChallenge) {
        const li = document.createElement('li');
        li.textContent = newChallenge;
        document.getElementById('challengesList').appendChild(li);
        document.getElementById('newChallenge').value = '';
    }
}

// Load the Google API client library
function handleClientLoad() {
    gapi.load('client', initClient);
}

function initializeGisClient() {
    tokenClient = google.accounts.oauth2.initTokenClient({ // Uncaught ReferenceError: google is not defined
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
            if (response.error) {
                console.error('Error during token request:', response.error);
                return;
            }
            accessToken = response.access_token;
            listUpcomingEvents();
        }
    });
}

function requestAccessToken() {
    tokenClient.requestAccessToken();
}

// Initialize the Google API client library
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    }).then(function () {
        console.log("Google API Client initialized");
    }).catch(function (error) {
        console.error('Error initializing Google API Client:', error);
    });
}

// Update the UI based on sign-in status
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        console.log("user is signed in")
        listUpcomingEvents(); // If signed in, fetch calendar events
    } else {
        gapi.auth2.getAuthInstance().signIn(); // Prompt user to sign in
    }
}

// Fetch the user's upcoming events
function listUpcomingEvents() {
    if (!accessToken) {
        console.error('Access token is missing.');
        return;
    }
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        const events = response.result.items;
        console.log('Upcoming events:', events);
    }).catch(function (error) {
        console.error('Error fetching events:', error);
    });
}

