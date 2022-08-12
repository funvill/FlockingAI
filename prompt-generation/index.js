// Load the EveryBirdSpecies.json file as JSON
// randomly select 3 words from the list by priority
const fs = require("fs");
const path = require("path");

// Consts
const RUN_COUNT = 7;

// Each line contains a word
function LoadTextFile(fileName) {
  return fs.readFileSync(path.join(__dirname, "data", fileName), "utf8").split("\n");
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
      word = list[i];
      if (word.length > 0 && word[0] != "#") {
        words.push(word);
      }
    }
    return words.join(divider) + " ";
  }

  // Get random words from the list

  for (let i = 0; i < count; i++) {
    do {
      word = list[Math.floor(Math.random() * list.length)];
    } while (word.length <= 0 || word[0] == "#");
    words.push(word);
  }
  return words.join(divider) + " ";
}

for (let i = 0; i < RUN_COUNT; i++) {
  var output = "";

  output += GetWordsFromList(LoadTextFile("adjectives.txt"), 1);
  output += GetWordsFromList(LoadTextFile("bird_types.txt"), 1);
  output += "bird ";
  // output += " :: as a ";
  // output += GetWordsFromList(LoadTextFile("character_type.txt"), 1);
  // output += " :: ";
  // output += GetWordsFromList(LoadTextFile("list_of_feelings.txt"), 1);
  output += " :: ";
  output += GetWordsFromList(LoadTextFile("location.txt"), 1, " ");
  output += " :: ";
  output += GetWordsFromList(LoadTextFile("colors.txt"), 1, " ");
  // output += " :: ";
  output += GetWordsFromList(LoadTextFile("keywords.txt"), 4);
  output += " :: ";
  output += GetWordsFromList(LoadTextFile("lighitng.txt"), 1);
  output += ", ";
  output += GetWordsFromList(LoadTextFile("style.txt"), 2);
  output += " :: ";
  output += GetWordsFromList(LoadTextFile("yes.txt"), undefined);
  output += " :: ";
  output += GetWordsFromList(LoadTextFile("no.txt"), undefined);
  output += " ";
  output += GetWordsFromList(LoadTextFile("parameters.txt"), undefined, " ");

  // Randomly choose the orintation of the image (vertical or horizontal)
  if (Math.floor(Math.random() * 2) == 0) {
    output += " --ar 3:2"; // Vertical
  } else {
    output += " --ar 2:3"; // Horizontal
  }

  console.log(output + "\n");
}
