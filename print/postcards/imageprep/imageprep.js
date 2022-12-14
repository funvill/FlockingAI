// List all the files in a folder
var fs = require("fs");
var path = require("path");

// Image processing
const sharp = require("sharp");

// Consts
const sourceFolderPath = "../../images";
const destinationFolderPath = "../processed";
const resizedDestinationFolderPath = "../processed/resized";

const pixelsPerInch = 300; // Pixles
const outputImageSizeXY = 3.5; // inches, The size of the photo
const outputFileSizeX = 6.25; // inches, The size of the image in the output file
const outputFileSizeY = 4.25; // inches, The size of the image in the output file
const outputBorderSize = 1 / 16; // inches, The size of the border around the image in the output file
const outputBorderSizePixels = Math.round((outputBorderSize * pixelsPerInch) / 2); // pixels, The size of the border around the image in the output file
const outputBorderColor = "black";
const outputFileBackgroundColor = "white";

/**
 *
 *    *-----------------------------------*  <== Output file size 6.25 x 4.25 inches
 *    |                                   |  <== White space 
 *    |     *-----------------------*     |  <== Border 
 *    |     |*---------------------*|     |
 *    |     ||                     ||     |
 *    |     ||     Art Image       ||     |
 *    |     ||       (3.5)         ||     |
 *    |     ||                     ||     |
 *    |     |*---------------------*|     |
 *    |     *-----------------------*     |
 *    |                                   |
 *    *-----------------------------------*
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

// Print the conts to the console
// Print the application version
console.log("Image Processing Application version " + require("./package.json").version);
console.log("Source folder:      " + sourceFolderPath);
console.log("Resize folder:      " + resizedDestinationFolderPath);
console.log("Destination folder: " + destinationFolderPath);
console.log("Pixels per inch:    " + pixelsPerInch);
console.log("Output image size:  " + outputImageSizeXY + " inches, " + Math.round(outputImageSizeXY * pixelsPerInch) + " pixels");
console.log("Output border size: " + outputBorderSize + " inches, " + outputBorderSizePixels + " pixels");
console.log("Image + border size: " + (outputImageSizeXY + outputBorderSize * 2) + " inches, " + Math.round((outputImageSizeXY + outputBorderSize * 2) * pixelsPerInch) + " pixels"); 
console.log(
  "Output file size:   " + outputFileSizeX + " x " + outputFileSizeY + " inches (" + Math.round(outputFileSizeX * pixelsPerInch) + " x " + Math.round(outputFileSizeY * pixelsPerInch) + " pixels)"
);
console.log("Output border color:" + outputBorderColor);
console.log("Output file background color:" + outputFileBackgroundColor);

function CreateAndEmptyFolder(folderPath) {
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
}

CreateAndEmptyFolder(resizedDestinationFolderPath);
CreateAndEmptyFolder(destinationFolderPath);

// Get the list of files in the folder
walkSync(sourceFolderPath, []).forEach(function (file) {
  // files
  const sourceFile = path.join(sourceFolderPath, file);
  const destinationResizeFile = path.join(resizedDestinationFolderPath, "resized_" + file);
  const outputImageFile = path.join(destinationFolderPath, "postcard_" + file);

  // Debug info
  console.log("Processing file: " + sourceFile + " => " + outputImageFile);

  // Using sharp to resize the image to 3.75 inches square
  sharp(sourceFile)
    // Resize image
    .resize(outputImageSizeXY * pixelsPerInch, outputImageSizeXY * pixelsPerInch)
    // Add a border around the image
    .extend({
      top: outputBorderSizePixels,
      bottom: outputBorderSizePixels,
      left: outputBorderSizePixels,
      right: outputBorderSizePixels,
      background: outputBorderColor,
    })

    .toFile(destinationResizeFile, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Done resizing photo and adding black border to file: " + file);

      // Using sharp to resize the image to 3.75 inches square
      const image = sharp(destinationResizeFile);
      image.metadata().then(function (metadata) {
        // Add a white background to extend the image, and extend the image to the output file size
        return image
          .extend({
            top: Math.round((outputFileSizeY * pixelsPerInch - metadata.height) / 2),
            bottom: Math.round((outputFileSizeY * pixelsPerInch - metadata.height) / 2),
            left: Math.round((outputFileSizeX * pixelsPerInch - metadata.width) / 2),
            right: Math.round((outputFileSizeX * pixelsPerInch - metadata.width) / 2),
            background: outputFileBackgroundColor,
          })
          .toFile(outputImageFile, function (err) {
            if (err) {
              console.log(err);
              return;
            }
            // Delete the temporary file
            // fs.unlinkSync(destinationResizeFile);
            console.log("Deleted temporary file: " + destinationResizeFile);

            // Done
            console.log("Done resizing image to output size. file: " + file);
          });
      });
    });
});
