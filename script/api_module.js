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
	const newPlayerKey = push(child(ref(db), 'players')).key;
	update(ref(db, 'players/'+newPlayerKey), {
		name: document.getElementById("input_name").value,
		score: n
	});
	console.log(n);
}

// CHECKING FOR DATABASE UPDATES //
function dateBaseUpdated(data) {
	let curData = data.val();
	let newData = [];
	let places = document.getElementsByClassName('place');
	let n = (Object.keys(curData).length < places.length) ? Object.keys(curData).length : places.length;
	for (let i = 0; i < n; i++){
		let key = Object.keys(curData)[0];
		for (let d in curData){
			if (curData[key].score < curData[d].score) key = d;
		}
		newData[i] = curData[key];
		delete curData[key];
	}
	for (let i = 0; i < n; i++){
		let value = '';
		if (i < newData.length) value = newData[i].name + " " + newData[i].score;
		places[i].innerHTML = value.toUpperCase(); // putting data to DOM element
	}
}

// CHECKING FOR IN-GAME UPDATES //
/*
let updateChecking = setInterval(function () {
	let score = document.getElementById("info").innerHTML;
	if (score !== '') { // tracking score if there is
		insertData(parseInt(score)); // adding new data from the score
		document.getElementById("info").innerHTML = '';
	}
}, 1000 / 60);

*/
let info = document.getElementById("info");
info.addEventListener("gameover", function(data){
	insertData(parseInt(data.detail.score));
}, false);
onValue(ref(db, 'players'), dateBaseUpdated); // checking for updates in the database
