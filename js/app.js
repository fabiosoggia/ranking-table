var app = angular.module("PulseballApp", []);

app.factory("FakeMatchUpdater", function($timeout) {
	var data = {
		results: [],
		updateInterval: 2,
		matchCount: 0
	};

	var table = [
		{ "team": { "name": "Australia", "id": 32, abbreviation: "aus" }, "pos": 1, "pts": 54.23 },
		{ "team": { "name": "New Zealand", "id": 62, abbreviation: "nzl" }, "pos": 2, "pts": 54.00 },
		{ "team": { "name": "France", "id": 2, abbreviation: "fra" }, "pos": 3, "pts": 52.95 },
		{ "team": { "name": "England", "id": 1, abbreviation: "eng" }, "pos": 4, "pts": 52.32 },
		{ "team": { "name": "Romania", "id": 24, abbreviation: "rou" }, "pos": 5, "pts": 43.50 },
		{ "team": { "name": "Italy", "id": 25, abbreviation: "ita" }, "pos": 6, "pts": 43 },
		{ "team": { "name": "Spain", "id": 26, abbreviation: "esp" }, "pos": 7, "pts": 42 },
		{ "team": { "name": "USA", "id": 10, abbreviation: "usa" }, "pos": 8, "pts": 41 }
	];
	PULSEBALL.init(table);

	function randomElement (array) {
		return array[Math.round(Math.random() * (array.length - 1))];
	}

	function randomMatch () {
		var firstTeam = randomElement(table).team;
		var secondTeam;
		do {
			secondTeam = randomElement(table).team;
		} while (firstTeam.name === secondTeam.name);

		return {
			"venue": {
				"country": randomElement(table).team.name
			},
			"teams": [
				firstTeam,
				secondTeam
			],
			"status": randomElement(["C"]),
			"outcome": randomElement(["A", "B", "D", "N"])
		};
	}

	function isChanged (oldRow, newRow) {
		if (!oldRow) {
			return true;
		}
		if (oldRow.pts !== newRow.pts) {
			return true;
		}
		if (oldRow.team.id !== newRow.team.id) {
			return true;
		}
		return false;
	}

	// function deepReplace (to, from) {
	// 	for (var key in from) {
	// 		if (typeof from[key] === "object") {
	// 			if (!to[key]) {
	// 				to[key] = {};
	// 			}
	// 			deepReplace(to[key], from[key]);
	// 			continue;
	// 		}
	// 		if (to[key] !== from[key]) {
	// 			to[key] = from[key];
	// 		}
	// 	}
	// }

	var update = function() {
		var match = randomMatch();
		data.lastMatch = match;
		data.matchCount++;
		var json = PULSEBALL.addMatch(match);
		// deepReplace(data.results, json);
		for (var i = json.length - 1; i >= 0; i--) {
			var res = json[i];
			if (isChanged(data.results[i], res)) {
				data.results[i] = res;
			}

		}
		$timeout(update, data.updateInterval * 1000);
	};
	update();

	return data;
});


app.controller("RankingsTableController", ["$scope", "FakeMatchUpdater", function ($scope, matches) {
	$scope.table = matches;
	$scope.stop = function () {
		alert("I am sorry. No one can stop Pulseball players.\nThe SPORT must go on.");
		return false;
	};
}]);
