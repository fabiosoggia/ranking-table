module.exports = {

	options: {
		cache: false
	},

    dist: {
		files: [{
			expand: true,
			cwd: "img/",
			src: ["**/*.{png,jpg,gif}"],
			dest: "dist/img"
		}]
	}
};
