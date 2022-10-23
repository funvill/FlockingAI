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

const outputButtonDiameter = 1.75; // inches, The size of the image in the output file
const pixelsPerInch = 72; // Pixles

console.log("Image PDF " + require("./package.json").version);
console.log("Source folder:       " + sourceFolderPath);
console.log("Destination folder:  " + destinationFolderPath);
console.log("Pixels per inch:     " + pixelsPerInch);
console.log("Output button size:  " + outputButtonDiameter + " inches (" + Math.round(outputButtonDiameter * pixelsPerInch) + " pixels)");

// Output file name
const outputPDFFile = path.join(destinationFolderPath, "FlockingAI-StevenSmethurst_buttons_v" + require("./package.json").version + ".pdf");
console.log("outputPDFFile:       " + outputPDFFile);

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

// Change text to capital case
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Get the list of all the images in the source folder.
const sourceFilesList = walkSync(sourceFolderPath);

var images = [];

// Loop thought the images one at a time
for (var i = 0; i < sourceFilesList.length; i++) {
  // Open the file and conver it to base64 for the PDF
  var bitmap = fs.readFileSync(path.join(sourceFolderPath, sourceFilesList[i]));
  var base64data = new Buffer(bitmap).toString("base64");
  images.push({ image: "data:image/png;base64," + base64data, width: outputButtonDiameter * pixelsPerInch, height: outputButtonDiameter * pixelsPerInch });
}

// Convert the images array into a content columns for pdfmake
var spacing = " ";
var content = [];
content.push({ text: "Flocking AI Buttons v" + require("./package.json").version, style: "header" });
content.push({ text: spacing });
for (var i = 0; i < images.length; i += 3) {
  content.push({
    columns: [spacing, images[i + 0], spacing, images[i + 1], spacing, images[i + 2], spacing],
  });  
  content.push({ text: spacing });
}

var docDefinition = {
  // a string or { width: number, height: number }
  pageSize: "A4",

  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins  
  pageMargins: [ 40, 60, 40, 60 ],

  // by default we use portrait, you can change it to landscape if you wish
  pageOrientation: "portrait",

  info: {
    title: "Flocking AI button project",
    author: "Steven Smethurst @funvill abluestar.com",
  },

  defaultStyle: {
    fontSize: 16,
    font: "default",
    align: "center",
    color: "gray",
  },

  content: content,
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream(outputPDFFile));
pdfDoc.end();
