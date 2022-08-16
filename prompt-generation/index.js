// Load the EveryBirdSpecies.json file as JSON
// randomly select 3 words from the list by priority

const { LoadTextFile, GetWordsFromList } = require("./helpers.js");

// Consts
const RUN_COUNT = 7;


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
