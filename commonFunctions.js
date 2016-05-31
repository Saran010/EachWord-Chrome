var disappearingStarted,
	drawingStarted,
	timeoutIdTimer,
	// Variables from "background.js".
	dictionaryArrayQueue,
	lastWord;
// Functions from "background.js".
// Special algorithm which shows word cards without reps
// alike cards and does it with equal probability.
function chooseWord() {
	"use strict";
	var flag,
		dictionaryArray,
		randomNumber;
	flag = false;
	dictionaryArray = localStorage.getItem("dictionaryArray");
	randomNumber = Math.floor(Math.random() * dictionaryArrayQueue.length);
	if (dictionaryArrayQueue.length === 0) {
		dictionaryArray = JSON.parse(dictionaryArray);
		dictionaryArrayQueue = dictionaryArray;
		localStorage.setItem("dictionaryArrayQueue", JSON.stringify(dictionaryArrayQueue));
		flag = true;
	}
	if (dictionaryArrayQueue.length === 1) {
		lastWord = dictionaryArrayQueue.splice(0, 1)[0];
		localStorage.setItem("dictionaryArrayQueue", JSON.stringify(dictionaryArrayQueue));
		return lastWord;
	}
	if (flag) {
		if (dictionaryArrayQueue[randomNumber].word === lastWord.word && dictionaryArrayQueue[randomNumber].translation === lastWord.translation) {
			if (randomNumber === 0) {
				lastWord = dictionaryArrayQueue.splice(randomNumber + 1, 1)[0];
				localStorage.setItem("dictionaryArrayQueue", JSON.stringify(dictionaryArrayQueue));
				return lastWord;
			}
			lastWord = dictionaryArrayQueue.splice(randomNumber - 1, 1)[0];
			localStorage.setItem("dictionaryArrayQueue", JSON.stringify(dictionaryArrayQueue));
			return lastWord;
		}
	}
	lastWord = dictionaryArrayQueue.splice(randomNumber, 1)[0];
	localStorage.setItem("dictionaryArrayQueue", JSON.stringify(dictionaryArrayQueue));
	return lastWord;
}
// End functions from "background.js".
// Functions from "content.js".
function disappearing() {
	"use strict";
	var wordCard,
		blurStyle,
		closeStyle,
		intervalIdDisappearing;
	disappearingStarted = true;
	wordCard = document.getElementById("wordCard8730011");
	blurStyle = document.getElementById("blurStyle8730011");
	closeStyle = document.getElementById("closeStyle8730011");
	if (blurStyle) {
		blurStyle.remove();
	}
	intervalIdDisappearing = setInterval(function () {
		var checkToTopOverflow = parseFloat(wordCard.style.top) - 1.5;
		if (checkToTopOverflow > -30) {
			wordCard.style.top = checkToTopOverflow + "%";
		} else {
			wordCard.remove();
			if (closeStyle) {
				closeStyle.remove();
			}
			clearInterval(intervalIdDisappearing);
			disappearingStarted = false;
			drawingStarted = false;
		}
	}, 10);
}
function closeButtonAction() {
	"use strict";
	clearTimeout(timeoutIdTimer);
	if (!disappearingStarted) {
		disappearing();
	}
	return false;
}
function formatDelay(selectDelay) {
	"use strict";
	var formatedDelay,
		minutesDelay,
		modulo;
	if (selectDelay < 10) {
		formatedDelay = "00:0" + selectDelay;
	} else if (selectDelay < 60) {
		formatedDelay = "00:" + selectDelay;
	} else {
		minutesDelay = Math.floor(selectDelay / 60);
		modulo = selectDelay % 60;
		if (minutesDelay < 10) {
			formatedDelay = "0" + minutesDelay + ":";
		} else {
			formatedDelay = minutesDelay + ":";
		}
		if (modulo < 10) {
			formatedDelay += "0" +  modulo;
		} else {
			formatedDelay += modulo;
		}
	}
	return formatedDelay;
}
function appearing(word, translation, settingsArray) {
	"use strict";
	var selectDelay,
		showClose,
		wordCard,
		blurStyle,
		closeStyle,
		closeButton,
		commonLength,
		words,
		timer,
		intervalIdAppearing;
	drawingStarted = true;
	selectDelay = settingsArray.selectDelay;
	showClose = settingsArray.showClose;
	wordCard = document.createElement("div");
	wordCard.id = "wordCard8730011";
	wordCard.style.top = "-30%";
	// Primary html-code of creating card.
	wordCard.innerHTML = "<div id=\"header8730011\"><span id=\"headerOne8730011\">Each</span><span id=\"headerTwo8730011\">Word</span><span id=\"headerOne8730011\"> &mdash; expand your vocabulary easily.</span></div><a href=\"\" id=\"closeButton8730011\" title=\"Close this card\" tabindex=\"-1\"></a><div id=\"words8730011\"><span id=\"word8730011\">" + word + "</span></span id=\"dash8730011\"> &mdash; </span><span id=\"translation8730011\">" + translation + "</span></div><div id=\"timer8730011\">" + formatDelay(selectDelay) + "</div>";
	if (settingsArray.showBlur) {
		blurStyle = document.createElement("style");
		blurStyle.id = "blurStyle8730011";
		blurStyle.innerHTML = "body{-webkit-filter:blur(10px);}";
		document.documentElement.appendChild(blurStyle);
	}
	document.documentElement.insertBefore(wordCard, document.documentElement.firstChild);
	closeButton = document.getElementById("closeButton8730011");
	// If user enabled "show close button" in options.
	if (showClose) {
		closeStyle = document.createElement("style");
		closeStyle.id = "closeStyle8730011";
		closeStyle.innerHTML = "#closeButton8730011{background:url(" + chrome.extension.getURL("images/icons/closeButton32.png") + ");position:absolute;top:5%;right:5%;display:block;width:32px;height:32px;outline:none;transition:0.2s;}#closeButton8730011:hover{background:url(" + chrome.extension.getURL("images/icons/closeButton32_hover.png") + ");-webkit-transform:rotate(180deg);}#closeButton8730011:active{background:url(" + chrome.extension.getURL("images/icons/closeButton32_active.png") + ");-webkit-transform:rotate(180deg);}";
		document.documentElement.appendChild(closeStyle);
		closeButton.onclick = closeButtonAction;
	} else {
		closeButton.remove();
	}
	commonLength = word.length + translation.length;
	words = document.getElementById("words8730011");
	// Pick up font size depending word and translation size.
	if (commonLength < 21) {
		words.style.fontSize = "40pt";
	} else if (commonLength < 26) {
		words.style.fontSize = "37pt";
	} else if (commonLength < 31) {
		words.style.fontSize = "34pt";
	} else if (commonLength < 36) {
		words.style.fontSize = "31pt";
	} else if (commonLength < 41) {
		words.style.fontSize = "28pt";
	} else if (commonLength < 46) {
		words.style.fontSize = "25pt";
	} else if (commonLength < 51) {
		words.style.fontSize = "22pt";
	} else if (commonLength < 56) {
		words.style.fontSize = "18pt";
	} else if (commonLength < 61) {
		words.style.fontSize = "15pt";
	} else {
		words.style.fontSize = "12pt";
	}
	timer = document.getElementById("timer8730011");
	intervalIdAppearing = setInterval(function () {
		var checkToTopOverflow,
			tempDelay;
		checkToTopOverflow = parseFloat(wordCard.style.top) + 1.5;
		if (checkToTopOverflow >= 0) {
			wordCard.style.top = "0%";
			clearInterval(intervalIdAppearing);
			tempDelay = selectDelay - 1;
			timeoutIdTimer = setTimeout(function timerUpdate() {
				timer.innerHTML = formatDelay(tempDelay);
				tempDelay--;
				if (tempDelay >= 0) {
					timeoutIdTimer = setTimeout(timerUpdate, 1000);
				} else {
					if (!disappearingStarted) {
						disappearing();
					}
				}
			}, 1000);
		} else {
			wordCard.style.top = checkToTopOverflow + "%";
		}
	}, 10);
}
function drawCard(word, translation, settingsArray) {
	"use strict";
	if (!drawingStarted) {
		appearing(word, translation, settingsArray);
	}
}
// End functions from "content.js".
Array.prototype.indexOfObject = function (object) {
	"use strict";
	var i,
		flag,
		key;
    for (i = 0; i < this.length; i++) {
        flag = true;
        for (key in object) {
			if (object.hasOwnProperty(key)) {
				if (this[i][key] !== object[key]) {
					flag = false;
					break;
				}
			}
		}
        if (flag) {
			return i;
		}
    }
    return -1;
};
// Works as semaphore for "disappearing()".
disappearingStarted = false;
// Works as semaphore for "drawCard()".
drawingStarted = false;