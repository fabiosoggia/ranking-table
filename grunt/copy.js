module.exports = {
	all: {
		files: [
			{ expand: true, cwd: "fonts/", src: ["**"], dest: "dist/fonts/" },
			{ expand: true, cwd: "js/lib", src: ["**"], dest: "dist/js/lib/" }
		]
	}
};
