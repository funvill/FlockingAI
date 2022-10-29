// List all the files in a folder
var fs = require("fs");
var path = require("path");

// PDF creation
var PdfPrinter = require("pdfmake");

var fonts = {
  default: {
    normal: "Helvetica",
  },
};

var printer = new PdfPrinter(fonts);

const sourceFolderPath = "./processed";
const destinationFolderPath = "../";

const outputFileSizeX = 6.25; // inches, The size of the image in the output file
const outputFileSizeY = 6.25; // inches, The size of the image in the output file
const pixelsPerInch = 72; // Pixles

console.log("Image PDF " + require("./package.json").version);
console.log("Source folder:       " + sourceFolderPath);
console.log("Destination folder:  " + destinationFolderPath);
console.log("Pixels per inch:     " + pixelsPerInch);
console.log(
  "Output file size:    " + outputFileSizeX + " x " + outputFileSizeY + " inches (" + Math.round(outputFileSizeX * pixelsPerInch) + " x " + Math.round(outputFileSizeY * pixelsPerInch) + " pixels)"
);

// Output file name
const outputPDFFile = path.join(destinationFolderPath, "FlockingAI-StevenSmethurst_prints_v" + require("./package.json").version + ".pdf");
console.log("outputPDFFile:       " + outputPDFFile);

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

// Get the list of all the images in the source folder.
const sourceFilesList = walkSync(sourceFolderPath);

// Loop thought the images one at a time
var content = [];
for (var i = 0; i < sourceFilesList.length; i++) {
  console.log("Processing " + sourceFilesList[i]);
  // Open the file and conver it to base64 for the PDF
  var bitmap = fs.readFileSync(path.join(sourceFolderPath, sourceFilesList[i]));
  var base64data = new Buffer(bitmap).toString("base64");
  content.push({ image: "data:image/png;base64," + base64data, width: outputFileSizeX * pixelsPerInch, height: outputFileSizeY * pixelsPerInch });
}

var docDefinition = {
  // a string or { width: number, height: number }
  pageSize: {
    width: outputFileSizeX * pixelsPerInch,
    height: outputFileSizeY * pixelsPerInch,
  },

  pageMargins: [0, 0, 0, 0],

  // by default we use portrait, you can change it to landscape if you wish
  pageOrientation: "portrait",

  info: {
    title: "Flocking AI print project",
    author: "Steven Smethurst @funvill abluestar.com",
  },

  content: content,
};

try {
  console.log("Creating PDF... Step 1");
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  console.log("Creating PDF... Step 2");
  pdfDoc.pipe(fs.createWriteStream(outputPDFFile));
  console.log("Creating PDF... Step 3");
  pdfDoc.end();
  console.log("Done");
} catch (e) {
  console.log("Error creating PDF: " + e);
}
