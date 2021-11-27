// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAO9gfPPV1Ifv6eQt7yJroVOCv5Lrlhqa8",
	authDomain: "infra-hulling-333305.firebaseapp.com",
	databaseURL: "https://infra-hulling-333305-default-rtdb.firebaseio.com",
	projectId: "infra-hulling-333305",
	storageBucket: "infra-hulling-333305.appspot.com",
	messagingSenderId: "381890839448",
	appId: "1:381890839448:web:9d97e4f0d7e008867d21ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import { getDatabase, ref, get, set, child, onValue, push, update, remove } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js"
const db = getDatabase();

// FIRST LOAD OF DATA //
get(ref(db, 'players')).then(dateBaseUpdated).catch(err => console.error("Data Cannot be Saved Error " + err));

// ----- INSERTING DATA ------ //
function insertData(n) {
	/*
	get(ref(db, 'players')).then(data => {
		if (data.exists()) { // checking if data exists
			let currentData = data.val();
			currentData.push({ //adding new data to the existing data
				name: document.getElementById("input_name").value,
				score: n
			});
			return currentData; // returning data to upload to databse
		} else console.log("No data available");
	}).then(data => {
		set(ref(db, "players"), data).then(() => console.log("Data Saved") ).catch(err => console.error("Data Cannot be Saved Error " + err) ); // uploading to database
	}).catch(err => console.error("Data Cannot be Saved Error " + err) );
	*/
	update(ref(db, 'players/'), [{
		name: document.getElementById("input_name").value,
		score: n
	}]);
}

// CHECKING FOR DATABASE UPDATES //
function dateBaseUpdated(data) {
	if (!data.exists()) return; // check if data exists
	let currentData = data.val();
	currentData.sort(function (a, b) { // sort data according to players score
		var keyA = a.score, keyB = b.score;
		if (keyA > keyB) return -1;
		if (keyA < keyB) return 1;
		return 0;
	});
	for (let i = 0; i < document.getElementsByClassName('place').length; i++) {
		let value = '';
		if (i < currentData.length) value = currentData[i].name + " " + currentData[i].score;
		document.getElementsByClassName('place')[i].innerHTML = value.toUpperCase(); // putting data to DOM element
	}
}

// CHECKING FOR IN-GAME UPDATES //
let updateChecking = setInterval(function () {
	let score = document.getElementById("info").innerHTML;
	if (score !== '') { // tracking score if there is
		insertData(parseInt(score)); // adding new data from the score
		document.getElementById("info").innerHTML = '';
	}
}, 1000 / 60);
onValue(ref(db, 'players'), dateBaseUpdated); // checking for updates in the database
