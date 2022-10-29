// List all the files in a folder
var fs = require("fs");
var path = require("path");

// Image processing
const sharp = require("sharp");

// Consts
const sourceFolderPath = "../images";
const destinationFolderPath = "./processed";
const destinationFolderResizedPath = "./processed/resized";

const pixelsPerInch = 300; // Pixles
const outputFileSizeXY = 6.25; // inches, The size of the image in the output file
const imageBorderSize = 1 / 16; // inches, The size of the border around the image in the output file
const marginSize = 0.5 + 0.125; // inches, The size of the margin around the image

const imageSize = outputFileSizeXY - marginSize * 2 - imageBorderSize * 2; // inches

const outputBorderSizePixels = Math.round(imageBorderSize * pixelsPerInch); // pixels, The size of the border around the image in the output file
const outputBorderColor = "black";
const outputFileBackgroundColor = "white";
const infoBoxFontColor = "black";

/*
*---------------------------------------------* <== outputFileSizeXY 
|                                             | <== marginSize, outputFileBackgroundColor
|   *-------------------------------------*   | <== imageBorderSize, outputBorderColor 
|   |*-----------------------------------*|   |
|   ||                                   ||   |
|   ||                                   ||   |
|   ||                                   ||   | <== Art, imageSize
|   ||                                   ||   |
|   ||                                   ||   |
|   |*-----------------------------------*|   |
|   *-------------------------------------*   |
|                      __NAME_BIRD__ (#123)   | <== infoBlock
|                               2022 MMM DD   |
*---------------------------------------------*
*/

// Get the list of files in the folder
var walkSync = function (dir, filelist) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function (file) {
    if (!fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist.push(file);
    }
  });
  return filelist;
};

var CreateAndEmptyFolder = function (folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  } else {
    fs.readdirSync(folderPath).forEach(function (file, index) {
      var curPath = path.join(folderPath, file);
      if (!fs.statSync(curPath).isDirectory()) {
        fs.unlinkSync(curPath);
      }
    });
  }
};

// Change text to capital case
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// Print the const to the console
console.log("Prints version " + require("./package.json").version);
console.log("sourceFolderPath: " + sourceFolderPath);
console.log("destinationFolderResizedPath: " + destinationFolderResizedPath);
console.log("destinationFolderPath: " + destinationFolderPath);
console.log("pixelsPerInch: " + pixelsPerInch);

console.log("outputBorderSizePixels: " + outputBorderSizePixels);
console.log("outputBorderColor: " + outputBorderColor);
console.log("outputFileBackgroundColor: " + outputFileBackgroundColor);

console.log("---------------------------------------------");
console.log("imageSize: " + imageSize);
console.log("marginSize: " + marginSize);
console.log("imageBorderSize: " + imageBorderSize);
console.log("outputFileSizeXY: " + outputFileSizeXY);

// process.exit(1);

const textWidth = Math.round((imageSize + imageBorderSize ) * pixelsPerInch); // inches
console.log("textWidth: " + textWidth);

CreateAndEmptyFolder(destinationFolderPath);
CreateAndEmptyFolder(destinationFolderResizedPath);

// Get the list of files in the folder
walkSync(sourceFolderPath, []).forEach(function (file) {
  // files
  const sourceFile = path.join(sourceFolderPath, file);
  const outputResizeImageFile = path.join(destinationFolderResizedPath, "prints_" + file);
  const outputImageFile = path.join(destinationFolderPath, "done_" + file);

  console.log("Processing file: " + file + " => " + outputResizeImageFile);

  // Using sharp to resize the image to 3.75 inches square
  sharp(sourceFile)
    // Resize image
    .resize(Math.round(imageSize * pixelsPerInch), Math.round(imageSize * pixelsPerInch))
    // Add a border around the image
    .extend({
      top: outputBorderSizePixels,
      bottom: outputBorderSizePixels,
      left: outputBorderSizePixels,
      right: outputBorderSizePixels,
      background: outputBorderColor,
    })

    .toFile(outputResizeImageFile, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Done resizing photo and adding black border to file: " + outputResizeImageFile);
      // +", x=" + imageSize + (outputBorderSizePixels/pixelsPerInch) + " y=" + imageSize + (outputBorderSizePixels/pixelsPerInch));

      // Extract the name and the ID from file name 001-steward.png
      const fileName = file.split(".")[0];
      const name = fileName.split("-")[1];
      const id = fileName.split("-")[0];

      const dayjs = require("dayjs");
      var birdDate = dayjs("2022-08-22").add(parseInt(id) - 1, "day"); // Get the date from "August 22, 2022" + id in days
      const label = toTitleCase(name) + " #" + id + " - " + birdDate.format("MMM DD YYYY");

      const svg = `
      <svg width="${textWidth}" height="${1 * pixelsPerInch}">
        <rect x="0" y="0" fill="#333333" />
        <text style="font-family: Helvetica; font-size:64px;" text-anchor="end" dy="120"  fill="${infoBoxFontColor}" x="${textWidth}" y="0">${label}</text>
      </svg>`;
      const svg_buffer = Buffer.from(svg);

      // Extend the image to full size.
      sharp(outputResizeImageFile)
        // Extend the image border.
        .extend({
          top: Math.round(marginSize * pixelsPerInch),
          bottom: Math.round(marginSize * pixelsPerInch),
          left: Math.round(marginSize * pixelsPerInch),
          right: Math.round(marginSize * pixelsPerInch),
          background: outputFileBackgroundColor,
        })
        .composite([
          {
            input: svg_buffer,
            top: Math.round((imageSize + marginSize) * pixelsPerInch),
            left: Math.round(marginSize * pixelsPerInch + 20),
          },
        ])

        .toFile(outputImageFile, function (err) {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Done: " + outputImageFile);
        });
    });
});
