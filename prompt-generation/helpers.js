const fs = require("fs");
const path = require("path");

// Each line contains a word
function LoadTextFile(fileName) {
  let output = fs.readFileSync(path.join(__dirname, "data", fileName), "utf8").split("\n");
  // remove any empty lines or lines that start with a #
  output = output.filter((line) => line.length > 0 && line[0] != "#");
  return output;
}

function GetWordsFromList(list, count, divider) {
  let words = [];

  if (divider == undefined) {
    divider = ", ";
  }
  // If the count is not defined then use all words
  if (count == undefined) {
    count = list.length;
    for (let i = 0; i < count; i++) {
      words.push(list[i]);
    }
    return words.join(divider) + " ";
  }

  // Get random words from the list
  for (let i = 0; i < count; i++) {
    words.push(list[Math.floor(Math.random() * list.length)]);
  }
  return words.join(divider) + " ";
}

// Export
module.exports = {
  LoadTextFile,
  GetWordsFromList,
};
