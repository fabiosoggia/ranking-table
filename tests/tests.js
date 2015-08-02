QUnit.module("PULSEBALL");
QUnit.test("PULSEBALL.addMatch()", function(assert) {

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

	PULSEBALL.init(table);
	deepEqual(PULSEBALL.addMatch(match), result);

});
