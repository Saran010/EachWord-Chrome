function fromLanguageSave() {
	"use strict";
	localStorage.setItem("fromLanguage", JSON.stringify(document.getElementById("fromLanguage").value));
}
// To save inputed letters in "Translation" field when user closes extension window.
function intoLanguageSave() {
	"use strict";
	localStorage.setItem("intoLanguage", JSON.stringify(document.getElementById("intoLanguage").value));
}
// If user turns on or turns off extension.
function switchButtonChangeState() {
	"use strict";
	var switchState,
		switchButton;
	switchState = localStorage.getItem("switchState");
	switchState = JSON.parse(switchState);
	switchButton = document.getElementById("switchButton");
	if (switchState) {
		switchState = false;
		localStorage.setItem("switchState", JSON.stringify(switchState));
		switchButton.innerHTML = "Turn on";
		switchButton.title = "Turn on push cards";
		switchButton.classList.remove("colorFirst");
		switchButton.classList.add("colorSecond");
		// Change color icon to icon without color to indicate state of extension.
		chrome.browserAction.setIcon({path: "images/default_icons/icon38_(without_color).png"});
		if (JSON.parse(localStorage.getItem("dictionaryArray")).length !== 0) {
			chrome.runtime.sendMessage({type: "stopInterval"});
		}
	} else {
		switchState = true;
		localStorage.setItem("switchState", JSON.stringify(switchState));
		switchButton.innerHTML = "Turn off";
		switchButton.title = "Turn off push cards";
		switchButton.classList.remove("colorSecond");
		switchButton.classList.add("colorFirst");
		chrome.browserAction.setIcon({path: "images/default_icons/icon38.png"});
		if (JSON.parse(localStorage.getItem("dictionaryArray")).length !== 0) {
			chrome.runtime.sendMessage({type: "startInterval"});
		}
	}
	document.getElementById("fromLanguage").focus();
	return false;
}
// Function to play word when user clicks to speaker.
function playWord() {
	"use strict";
	var settingsArray,
		tr,
		trNodesArray,
		i;
	settingsArray = localStorage.getItem("settingsArray");
	settingsArray = JSON.parse(settingsArray);
	tr = this.parentNode.parentNode;
	trNodesArray = tr.parentNode.children;
	for (i = 1; i < trNodesArray.length; i++) {
		if (this === trNodesArray[i].children[1].children[0]) {
			chrome.tts.speak(trNodesArray[i].children[0].innerHTML, {"voiceName": "Google UK English Male"});
			break;
		}
	}
	return false;
}
function deleteWord() {
	"use strict";
	var tr,
		trNodesArray,
		index,
		dictionaryArray,
		dictionaryArrayQueue,
		deleteIndex,
		i;
	tr = this.parentNode.parentNode;
	trNodesArray = tr.parentNode.children;
	index = 0;
	for (i = 1; i < trNodesArray.length; i++) {
		if (this === trNodesArray[i].children[3].children[0]) {
			break;
		} else {
			index++;
		}
	}
	dictionaryArray = localStorage.getItem("dictionaryArray");
	dictionaryArrayQueue = localStorage.getItem("dictionaryArrayQueue");
	dictionaryArray = JSON.parse(dictionaryArray);
	dictionaryArrayQueue = JSON.parse(dictionaryArrayQueue);
	deleteIndex = dictionaryArrayQueue.indexOfObject(dictionaryArray.splice(index, 1)[0]);
	if (deleteIndex !== -1) {
		dictionaryArrayQueue.splice(deleteIndex, 1);
	}
	if (dictionaryArray.length === 0) {
		chrome.runtime.sendMessage({type: "stopInterval"});
	}
	localStorage.setItem("dictionaryArray", JSON.stringify(dictionaryArray));
	localStorage.setItem("dictionaryArrayQueue", JSON.stringify(dictionaryArrayQueue));
	tr.remove();
	document.getElementById("fromLanguage").focus();
	chrome.runtime.sendMessage({type: "changeDictionary"});
	return false;
}
function addWord() {
	"use strict";
	var word,
		translation,
		dictionaryArray,
		dictionaryArrayQueue,
		frameDocument,
		tr,
		td,
		a;
	word = document.getElementById("fromLanguage").value;
	translation = document.getElementById("intoLanguage").value;
	word = word.trim();
	translation = translation.trim();
	if (!word) {
		document.getElementById("fromLanguage").focus();
		return false;
	}
	if (!translation) {
		document.getElementById("intoLanguage").focus();
		return false;
	}
	word = word[0].toUpperCase() + word.slice(1);
	translation = translation[0].toUpperCase() + translation.slice(1);
	document.getElementById("fromLanguage").value = null;
	document.getElementById("intoLanguage").value = null;
	dictionaryArray = localStorage.getItem("dictionaryArray");
	dictionaryArrayQueue = localStorage.getItem("dictionaryArrayQueue");
	dictionaryArray = JSON.parse(dictionaryArray);
	dictionaryArrayQueue = JSON.parse(dictionaryArrayQueue);
	dictionaryArray.push({word : word, translation : translation});
	dictionaryArrayQueue.push({word : word, translation : translation});
	if (dictionaryArray.length === 1) {
		chrome.runtime.sendMessage({type: "startInterval"});
	}
	localStorage.setItem("dictionaryArray", JSON.stringify(dictionaryArray));
	localStorage.setItem("dictionaryArrayQueue", JSON.stringify(dictionaryArrayQueue));
	frameDocument = document.getElementsByTagName("iframe")[0].contentWindow.document;
	tr = document.createElement("tr");
	td = document.createElement("td");
	td.className = "firstColumn";
	td.innerHTML = word;
	tr.appendChild(td);
	td = document.createElement("td");
	td.className = "secondColumn";
	a = document.createElement("a");
	a.href = "";
	a.title = "Listen";
	a.className = "playWordButton";
	a.onclick = playWord;
	td.appendChild(a);
	tr.appendChild(td);
	td = document.createElement("td");
	td.className = "thirdColumn";
	td.innerHTML = translation;
	tr.appendChild(td);
	td = document.createElement("td");
	td.className = "fourthColumn";
	a = document.createElement("a");
	a.href = "";
	a.className = "deleteButton";
	a.innerHTML = "X";
	a.onclick = deleteWord;
	td.appendChild(a);
	tr.appendChild(td);
	frameDocument.getElementsByTagName("table")[0].appendChild(tr);
	localStorage.setItem("fromLanguage", JSON.stringify(""));
	localStorage.setItem("intoLanguage", JSON.stringify(""));
	tr.scrollIntoView(true);
	document.getElementById("fromLanguage").focus();
	chrome.runtime.sendMessage({type: "changeDictionary"});
	return false;
}
// Press "enter" to add card to dictionary.
document.onkeyup = function (e) {
	"use strict";
	var word,
		translation;
    if (e.keyCode === 13) {
		word = document.getElementById("fromLanguage").value;
		translation = document.getElementById("intoLanguage").value;
		word = word.trim();
		translation = translation.trim();
		if (!word) {
			document.getElementById("fromLanguage").focus();
			return;
		}
		if (!translation) {
			document.getElementById("intoLanguage").focus();
			return;
		}
        addWord();
    }
};
// Fill in extension window.
window.onload = function () {
	"use strict";
	var addButton,
		switchButton,
		fromLanguage,
		intoLanguage,
		switchState,
		dictionaryArray,
		i,
		word,
		translation,
		frameDocument,
		tr,
		td,
		a;
	addButton = document.getElementById("addButton");
	switchButton = document.getElementById("switchButton");
	fromLanguage = document.getElementById("fromLanguage");
	intoLanguage = document.getElementById("intoLanguage");
	// State of extension: "Turn on" or "Turn off".
	switchState = localStorage.getItem("switchState");
	addButton.onclick = addWord;
	switchButton.onclick = switchButtonChangeState;
	// Save inputed letters in fields when extension closes.
	fromLanguage.oninput = fromLanguageSave;
	intoLanguage.oninput = intoLanguageSave;
	// Load saved letters from localStorage into fields.
	fromLanguage.value = JSON.parse(localStorage.getItem("fromLanguage"));
	intoLanguage.value = JSON.parse(localStorage.getItem("intoLanguage"));
	switchState = JSON.parse(switchState);
	if (switchState) {
		switchButton.innerHTML = "Turn off";
		switchButton.title = "Turn off push cards";
		switchButton.classList.remove("colorSecond");
		switchButton.classList.add("colorFirst");
	} else {
		switchButton.innerHTML = "Turn on";
		switchButton.title = "Turn on push cards";
		switchButton.classList.remove("colorFirst");
		switchButton.classList.add("colorSecond");
	}
	// Array of words in localStorage.
	dictionaryArray = localStorage.getItem("dictionaryArray");
	dictionaryArray = JSON.parse(dictionaryArray);
	// Fill in words, translation and "deleteButton" into "iframe".
	for (i = 0; i < dictionaryArray.length; i++) {
		word = dictionaryArray[i].word;
		translation = dictionaryArray[i].translation;
		frameDocument = document.getElementsByTagName("iframe")[0].contentWindow.document;
		tr = document.createElement("tr");
		td = document.createElement("td");
		td.className = "firstColumn";
		td.innerHTML = word;
		tr.appendChild(td);
		td = document.createElement("td");
		td.className = "secondColumn";
		a = document.createElement("a");
		a.href = "";
		a.title = "Listen";
		a.className = "playWordButton";
		a.onclick = playWord;
		td.appendChild(a);
		tr.appendChild(td);
		td = document.createElement("td");
		td.className = "thirdColumn";
		td.innerHTML = translation;
		tr.appendChild(td);
		td = document.createElement("td");
		td.className = "fourthColumn";
		a = document.createElement("a");
		a.href = "";
		a.className = "deleteButton";
		a.tabIndex = "-1";
		a.innerHTML = "X";
		a.onclick = deleteWord;
		td.appendChild(a);
		tr.appendChild(td);
		frameDocument.getElementsByTagName("table")[0].appendChild(tr);
		tr.scrollIntoView(true);
	}
	document.getElementById("fromLanguage").focus();
};