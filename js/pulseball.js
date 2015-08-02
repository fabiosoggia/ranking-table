/**
 * @namespace PULSEBALL
 */
var PULSEBALL = (function (window, undefined) {
	"use strict";

	// It's an alias for window.Math
	var Math = window.Math;

	/**
	 * This method clone a json object.
	 * WARNING: it can't clone function or instance of Date.
	 * @memberof! PULSEBALL
	 * @private
	 * @param  {Object} json the object to clone
	 * @return {Object}
	 */
	function cloneJson (json) {
		return JSON.parse(JSON.stringify(json));
	}


	/**
	 * This class represent a rankings table. A rankings table is a set of
	 * rows. Each rows contains information about a team and its position
	 * in the tournment.
	 * In this implementation, the rows of the table are ordered by
	 * score value (descendent).
	 * @memberof! PULSEBALL
	 * @class
	 * @param {Object} rankingsJson A json representation of the table.
	 */
	function RankingsTable (rankingsJson) {
		/**
		 * To semplify the code, RankingsTable use the same json format of
		 * rankingsJson to represent internally the data.
		 * @attribute table
		 * @type {Object}
		 */
		this.table = cloneJson(rankingsJson);

		/**
		 * Use this map (teamId => tableRow) to increase the lookup operation
		 * performance. It can be used to lookup in O(1) a table row by the teamId.
		 * @attribute index
		 * @type {Array}
		 */
		this.index = [];

		// Sort the row of the table and set the correct "pos" attribute for each row.
		this.updatePositions();
	}

	/**
	 * When the score of a team changes, this method is called to keep the data sorted.
	 * This method update the the "pos" attribute and the index too.
	 *
	 * Even if this is a public method, currently it's called only by other internal
	 * function. There is no need to call this methos manually.
	 */
	RankingsTable.prototype.updatePositions = function () {
		this.table.sort(function (teamA, teamB) {
			return teamB.pts - teamA.pts;
		});
		var rowsCount = this.table.length;
		for (var i = 0; i < rowsCount; i++) {
			var row = this.table[i];
			var pos = i + 1;
			if (row.pts !== row.oldPts) {
				row.oldPos = row.pos;
			}

			if (row.pos !== pos) {
				row.pos = pos;
			}

			// Indexing the row by teamId. This operation should not be executed
			// more than once but in this version it's called every time the positions
			// are updated.
			this.index[row.team.id] = row;
		}
	};

	/**
	 * Return the json representation of this instance.
	 * @return {Object} an array of rows
	 */
	RankingsTable.prototype.toJson = function () {
		return cloneJson(this.table);
	};

	/**
	 * Clone this instance,
	 * @return {RankingsTable} a complete copy of this instance
	 */
	RankingsTable.prototype.clone = function () {
		var rankingsJson = this.toJson();
		return new RankingsTable(rankingsJson);
	};

	/**
	 * This method return the position of the team identified by teamId
	 * in the ranking.
	 * @param  {Number} teamId the id of the team
	 * @return {Number}        -1 if the team is not in the table, it's position otherwise
	 */
	RankingsTable.prototype.getTeamPosition = function(teamId) {
		if (teamId in this.index) {
			var row = this.index[teamId];
			return row.pos;
		}
		return -1;
	};

	/**
	 * This method return true if a team identified by teamId is in the table,
	 * false otherwise.
	 * @param  {Number} teamId
	 * @return {Boolean}
	 */
	RankingsTable.prototype.teamExists = function(teamId) {
		return (this.getTeamPosition(teamId) !== -1);
	};

	/**
	 * This method return the score of a team identified by teamId.
	 * @param  {Number} teamId
	 * @return {Number}        -1 if the team is not in the table, it's score otherwise
	 */
	RankingsTable.prototype.getTeamPts = function(teamId) {
		var index = this.getTeamPosition(teamId) - 1;

		if (index === -1) {
			// The team does not exist
			return -1;
		}

		return this.table[index].pts;
	};

	/**
	 * Set a new score to the team identified by teamId and update the table.
	 * @param {Number} teamId
	 * @param {Number} teamPts the score to assign to the team
	 */
	RankingsTable.prototype.setTeamPts = function(teamId, teamPts) {
		var index = this.getTeamPosition(teamId) - 1;

		if (index === -1) {
			// TO DO: The team does not exist.
			return;
		}

		this.table[index].oldPts = this.table[index].pts;
		this.table[index].pts = teamPts.toFixed(2) * 1;
		this.updatePositions();
	};

	/**
	 * This method return true if the place is the home of the specified team.
	 * @memberof! PULSEBALL
	 * @private
	 * @param  {Object}  team
	 * @param  {Object}  place
	 * @return {Boolean}
	 */
	function isHomeOfTeam (team, place) {
		// The specification is not clear.
		// In the examples the venue.country of the match is alway equal to the name
		// of the team, so use that rule.
		return (team.name === place.country);
	}

	function computeRatingDiff (firstTeam, secondTeam, venue) {
		// To suppress the advantage playing at home might give for the home team,
		// its rating is temporarily increased by 3 points when performing the calculations.
		var firstTeamRatingTemp = firstTeam.rating;
		if (isHomeOfTeam(firstTeam, venue)) {
			firstTeamRatingTemp += 3;
		}

		var secondTeamRatingTemp = secondTeam.rating;
		if (isHomeOfTeam(secondTeam, venue)) {
			secondTeamRatingTemp += 3;
		}

		// first subtract the second team’s rating from the first’s.
		var ratingDiff = firstTeamRatingTemp - secondTeamRatingTemp;

		// If the rating points difference is greater than 10, then it is capped at 10.
		ratingDiff = Math.min(10, ratingDiff);
		// If the rating points difference is lower than -10, then it is capped at -10.
		ratingDiff = Math.max(-10, ratingDiff);

		return ratingDiff;
	}

	function gainedPoint (outcome, ratingDiff) {
		var firstTeamGainedPoints = 0;
		var secondTeamGainedPoints = 0;
		var dividedRatingDiff = ratingDiff / 10;
		var amount;

		switch (outcome) {
			case "A":
				// team 1 win
				amount = 1 - dividedRatingDiff;
				firstTeamGainedPoints = amount;
				secondTeamGainedPoints = -(amount);
			break;
			case "B":
				// team 2 win
				amount = 1 + dividedRatingDiff;
				firstTeamGainedPoints = -(amount);
				secondTeamGainedPoints = (amount);
			break;
			case "D":
				// draw
				firstTeamGainedPoints = (dividedRatingDiff);
				secondTeamGainedPoints = (dividedRatingDiff);
			break;
		}

		return [firstTeamGainedPoints, secondTeamGainedPoints];
	}

	/**
	 * Predict the match rating using the data i "table" and "match" and update
	 * table with the results.
	 * @memberof! PULSEBALL
	 * @private
	 * @param  {RankingsTable} table this table is updated at the end of the process
	 * @param  {Object} match
	 * @return {RankingsTable}
	 */
	function predict (table, match) {
		var teams = match.teams;
		teams[0].rating = table.getTeamPts(teams[0].id);
		teams[1].rating = table.getTeamPts(teams[1].id);

		var ratingDiff = computeRatingDiff(teams[0], teams[1], match.venue);
		var points = gainedPoint(match.outcome, ratingDiff);
		table.setTeamPts(teams[0].id, teams[0].rating + points[0]);
		table.setTeamPts(teams[1].id, teams[1].rating + points[1]);

		return table;
	}

	var currentTable;

	return {
		/**
		 * Init a rankings table.
		 * @memberOf PULSEBALL
		 * @param  {Object} rankingsJson a valid json representation of a rankings table
		 */
		init: function (rankingsJson) {
			currentTable = new RankingsTable(rankingsJson);
		},
		/**
		 * Update the rankings table with the results of a match.
		 * @memberOf PULSEBALL
		 * @param {Object} match a valid json representation of a match
		 */
		addMatch: function (match) {
			if (!currentTable) {
				throw Error("You must call the init() function before add a match.");
			}

			// Applying the match data to a global function with the
			// signature PULSEBALL.addMatch( match ) would create a new rankings table.
			var predictedTable = predict(currentTable.clone(), match);
			if (match.status === "C") {
				currentTable = predictedTable;
			}
			return predictedTable.toJson();
		}
	};

})(window);
