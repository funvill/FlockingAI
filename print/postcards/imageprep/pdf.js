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

const sourceFolderPath = "../processed";
const destinationFolderPath = "../../";

const outputFileSizeX = 6.25; // inches, The size of the image in the output file
const outputFileSizeY = 4.25; // inches, The size of the image in the output file
const pixelsPerInch = 72; // Pixles
const birdNameFontSize = 6;
const birdNameCenterX = 382;
const birdNameCenterY = 95;

console.log("Image PDF " + require("./package.json").version);
console.log("Source folder:       " + sourceFolderPath);
console.log("Destination folder:  " + destinationFolderPath);
console.log("Pixels per inch:     " + pixelsPerInch);
console.log(
  "Output file size:    " + outputFileSizeX + " x " + outputFileSizeY + " inches (" + Math.round(outputFileSizeX * pixelsPerInch) + " x " + Math.round(outputFileSizeY * pixelsPerInch) + " pixels)"
);

// Output file name
const outputPDFFile = path.join(destinationFolderPath, "FlockingAI-StevenSmethurst_postcards_v" + require("./package.json").version + ".pdf");
console.log("outputPDFFile:       " + outputPDFFile);

const postCardAddressPath = path.join("../", "postcard-address.png");
console.log("postCardAddressPath: " + postCardAddressPath);

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

// Change text to capital case
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Extract the name of the bird from the file name
const getBirdName = (fileName) => {
  return "#" + toTitleCase(fileName.replace("postcard_", "").replace(".png", "").replace("-", " ").replace("-", " "));
};

// Get the list of all the images in the source folder.
const sourceFilesList = walkSync(sourceFolderPath);

// Get the addres card
var postCardAddressBitmap = fs.readFileSync(postCardAddressPath);
var postCardAddressBase64data = new Buffer(postCardAddressBitmap).toString("base64");

// Loop thought the images one at a time
var content = [];
for (var i = 0; i < sourceFilesList.length; i++) {
  // Open the file and conver it to base64 for the PDF
  var bitmap = fs.readFileSync(path.join(sourceFolderPath, sourceFilesList[i]));
  var base64data = new Buffer(bitmap).toString("base64");
  content.push({ image: "data:image/png;base64," + base64data, width: outputFileSizeX * pixelsPerInch, height: outputFileSizeY * pixelsPerInch });
  content.push({ text: " " }); // This creates a new page
  content.push({ text: getBirdName(sourceFilesList[i]), absolutePosition: { x: birdNameCenterX, y: birdNameCenterY }, align: "center" });
}

var docDefinition = {
  // a string or { width: number, height: number }
  pageSize: {
    width: outputFileSizeX * pixelsPerInch,
    height: outputFileSizeY * pixelsPerInch,
  },

  pageMargins: [0, 0, 0, 0],

  background: { image: "data:image/png;base64," + postCardAddressBase64data, width: outputFileSizeX * pixelsPerInch, height: outputFileSizeY * pixelsPerInch },

  // by default we use portrait, you can change it to landscape if you wish
  pageOrientation: "landscape",

  info: {
    title: "Flocking AI postcard project",
    author: "Steven Smethurst @funvill abluestar.com",
  },

  defaultStyle: {
    fontSize: birdNameFontSize,
    font: "default",
    align: "center",
    color: "gray",
  },

  content: content,
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream(outputPDFFile));
pdfDoc.end();
