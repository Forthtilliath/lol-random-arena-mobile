const { transformIgnorePatterns } = require("jest-expo/jest-preset");

module.exports = {
	preset: "jest-expo",
	testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
	setupFiles: ["./jest.setup.js"],
	moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
	// Les paquets @forthtilliath sont publiés en ESM : Jest doit les transformer comme ceux d'Expo.
	transformIgnorePatterns: [
		transformIgnorePatterns[0].replace("(?!(", "(?!(@forthtilliath|"),
		...transformIgnorePatterns.slice(1),
	],
};
