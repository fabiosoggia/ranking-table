QUnit.module("JsonUtils");
QUnit.test("JsonUtils.cloneJson()", function(assert) {
	assert.deepEqual([], [], "Clone empty array");
	assert.deepEqual([1, 2], [1, 2], "Clone number array");
	assert.deepEqual([{}], [{}], "Clone array with empty objects");
	assert.deepEqual([{ a: "a" }], [{a: "a"}], "Clone array with not empty objects");
	assert.deepEqual({}, {}, "Clone empty objects");
	assert.deepEqual({ a: "a" }, { a: "a" }, "Clone not empty objects");
	assert.deepEqual({ a: "a", b: [1, 2] }, { a: "a", b: [1, 2] }, "Clone not empty objects with arrays");
});

QUnit.module("RatingCalculator");
QUnit.test("RatingCalculator.computeRatingDiff()", function(assert) {

	assert.equal(
			RatingCalculator.computeRatingDiff(10, 10, RatingCalculator.NEUTRAL_GROUND),
			0,
			"Ratings (10, 10, NEUTRAL_GROUND)"
		);

	assert.equal(
			RatingCalculator.computeRatingDiff(10, 10, RatingCalculator.FIRST_TEAM_HOME),
			3,
			"Ratings (10, 10, FIRST_TEAM_HOME)"
		);

	assert.equal(
			RatingCalculator.computeRatingDiff(10, 10, RatingCalculator.SECOND_TEAM_HOME),
			-3,
			"Ratings (10, 10, SECOND_TEAM_HOME)"
		);

	assert.equal(
			RatingCalculator.computeRatingDiff(10, 30, RatingCalculator.NEUTRAL_GROUND),
			-10,
			"Ratings diff can't be lower than -10"
		);

	assert.equal(
			RatingCalculator.computeRatingDiff(30, 10, RatingCalculator.NEUTRAL_GROUND),
			10,
			"Ratings diff can't be greater than 10"
		);
});

QUnit.test("RatingCalculator.computeGainedPoints()", function(assert) {

	// Team 1

	assert.equal(
			RatingCalculator.computeGainedPoints(RatingCalculator.OUTCOME_DRAW, 10)[0],
			1,
			"(Team 1) Draw, each team loses or wins the points calculated by dividing the rating difference by 10"
		);

	assert.deepEqual(
			RatingCalculator.computeGainedPoints(RatingCalculator.OUTCOME_TEAM_ONE_WIN, 10)[0],
			1 - (10 / 10),
			"(Team 1) If the first team wins, then it gains 1 - ( rating difference / 10 )"
		);

	assert.deepEqual(
			RatingCalculator.computeGainedPoints(RatingCalculator.OUTCOME_TEAM_TWO_WIN, 10)[0],
			-(1 + (10 / 10)),
			"(Team 1) if the first team loses, then it loses 1 + ( rating difference / 10 )"
		);


	// Team 2

	assert.equal(
			RatingCalculator.computeGainedPoints(RatingCalculator.OUTCOME_DRAW, 10)[1],
			10 / 10,
			"(Team 2) Draw, each team loses or wins the points calculated by dividing the rating difference by 10"
		);

	assert.deepEqual(
			RatingCalculator.computeGainedPoints(RatingCalculator.OUTCOME_TEAM_ONE_WIN, 10)[1],
			-(1 - (10 / 10)),
			"(Team 2) If the first team wins, the opposing team’s rating loses 1 - ( rating difference / 10 )"
		);

	assert.deepEqual(
			RatingCalculator.computeGainedPoints(RatingCalculator.OUTCOME_TEAM_TWO_WIN, 10)[1],
			(1 + (10 / 10)),
			"(Team 2) if the first team loses, the opposing team’s rating wins 1 + ( rating difference / 10 )"
		);

});

QUnit.module("FLYBALL");
QUnit.test("FLYBALL.addMatch()", function(assert) {

	var table = [
		{ "team": { "name": "Australia", "id": 32 }, "pos": 1, "pts": 54.23 },
		{ "team": { "name": "New Zealand", "id": 62 }, "pos": 2, "pts": 54.00 },
		{ "team": { "name": "France", "id": 2 }, "pos": 3, "pts": 52.95 },
		{ "team": { "name": "England", "id": 1 }, "pos": 4, "pts": 52.32 },
		{ "team": { "name": "Romania", "id": 24 }, "pos": 5, "pts": 43.50 }
	];

	var match = {
		"matchId": 2524,
		"description": "Match 2",
		"venue": {
			"id": 900,
			"name": "Stadium",
			"city": "Paris",
			"country": "France"
		},
		"teams": [
				{
					"id": 2,
					"name": "France",
					"abbreviation": "FRA"
				},
				{
					"id": 1,
					"name": "England",
					"abbreviation": "ENG"
				}
			],
		"scores": [ 19, 23 ],
		"status": "C",
		"outcome": "B"
	};

	var result = [
		{
			"oldPos": 1,
			"pos": 1,
			"pts": 54.23,
			"team": {
				"id": 32,
				"name": "Australia"
			}
		},
		{
			"oldPos": 2,
			"pos": 2,
			"pts": 54,
			"team": {
				"id": 62,
				"name": "New Zealand"
			}
		},
		{
			"oldPos": 3,
			"oldPts": 52.32,
			"pos": 3,
			"pts": 53.68,
			"team": {
				"id": 1,
				"name": "England"
			}
		},
		{
			"oldPos": 4,
			"oldPts": 52.95,
			"pos": 4,
			"pts": 51.59,
			"team": {
				"id": 2,
				"name": "France"
			}
		},
		{
			"oldPos": 5,
			"pos": 5,
			"pts": 43.5,
			"team": {
				"id": 24,
				"name": "Romania"
			}
		}
	];

	FLYBALL.init(table);
	deepEqual(FLYBALL.addMatch(match), result);

});
