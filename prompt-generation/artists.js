const { LoadTextFile, GetWordsFromList } = require("./helpers.js");

const artists = LoadTextFile("artists.txt");
const birdTypes = LoadTextFile("bird_type_short_list.txt");
const parameters = LoadTextFile("parameters.txt");

let output = "";

artists.forEach((artistsStyle) => {
  birdTypes.forEach((bird) => {
    output += artistsStyle + " style of a cute " + bird + " ";
    parameters.forEach((parm) => {
      output += parm + " ";
    });
    output += "\n";
  });
  output += "\n";
});

console.log(output);
