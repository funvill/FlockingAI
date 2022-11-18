// List all the files in a folder
var fs = require("fs");
var path = require("path");

// Image processing
const sharp = require("sharp");

// Consts
const sourceFolderPath = "../images";
const destinationFolderPath = "./processed";
// overlay_print.png does not have the blead lines. 
// overlay_draft.png has the blead lines and cut lines
// const overlayFile = "overlay_print.png"; 
const overlayFile = "overlay_draft.png"; 

const pixelsPerInch = 300; // Pixles
const outputImageSizeDiameter = 1.25 + 0.10; // inches, The size of the photo
const outputFileSizeDiameter = 1.75; // inches, The size of the image in the output file
const outputBorderSizePixels = Math.round(((outputFileSizeDiameter - outputImageSizeDiameter) * pixelsPerInch) / 2); // pixels, The size of the border around the image in the output file
const outputBorderColor = "black"; // The color of the border around the image in the output file

// Get the list of files in the folder
var walkSync = function (dir, filelist) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      filelist.push(file);
    }
  });
  return filelist;
};

// Print the consts to the console and the version info
console.log("Button project version: " + require("./package.json").version);
console.log("Source folder: " + sourceFolderPath);
console.log("Destination folder: " + destinationFolderPath);
console.log("Pixels per inch: " + pixelsPerInch);
console.log("Output image size diameter: " + outputImageSizeDiameter + " inches, pixels: " + Math.round(outputImageSizeDiameter * pixelsPerInch));
console.log("Output file size diameter: " + outputFileSizeDiameter);
console.log("Output border size pixels: " + outputBorderSizePixels);
console.log("Output border color: " + outputBorderColor);

// Create the Destinationdirectory if it doesn't exist
if (!fs.existsSync(destinationFolderPath)) {
  fs.mkdirSync(destinationFolderPath);
}

// Remove all the files in the Destination folder
var files = fs.readdirSync(destinationFolderPath);
files.forEach(function (file, index) {
  var curPath = destinationFolderPath + "/" + file;
  fs.unlinkSync(curPath);
});

walkSync(sourceFolderPath, []).forEach(function (file) {
  // files
  const sourceFile = path.join(sourceFolderPath, file);
  const destinationResizeFile = path.join(destinationFolderPath, "resized_" + file);

  // Debug info
  console.log("Processing file: " + sourceFile + " => " + destinationResizeFile);

  // Using sharp to resize the image to 3.75 inches square
  sharp(sourceFile)
    // Resize image
    .resize(outputImageSizeDiameter * pixelsPerInch, outputImageSizeDiameter * pixelsPerInch)
    // Add a border around the image
    .extend({
      top: outputBorderSizePixels,
      bottom: outputBorderSizePixels,
      left: outputBorderSizePixels,
      right: outputBorderSizePixels,
      background: outputBorderColor,
    })
    .composite([{ input: overlayFile }])

    .toFile(destinationResizeFile, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Done resizing photo and adding border to file: " + file);
    });
});
