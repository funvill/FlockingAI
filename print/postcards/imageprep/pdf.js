// List all the files in a folder
var fs = require("fs");
var path = require("path");

// PDF creation
var PdfPrinter = require("pdfmake");

var fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

var printer = new PdfPrinter(fonts);

const sourceFolderPath = "../images/processed";
const destinationFolderPath = "../";

const outputFileSizeX = 6.25; // inches, The size of the image in the output file
const outputFileSizeY = 4.25; // inches, The size of the image in the output file
const pixelsPerInch = 300; // Pixles

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

const sourceFilesList = walkSync(sourceFolderPath);
console.log("sourceFilesList: " + JSON.stringify(sourceFilesList));

// Loop thought the images one at a time
var content = [];
for (var i = 0; i < sourceFilesList.length; i++) {
  // Open the file and conver it to base64 for the PDF
  var bitmap = fs.readFileSync(path.join(sourceFolderPath, sourceFilesList[i]));
  var base64data = new Buffer(bitmap).toString("base64");
  content.push({ image: "data:image/png;base64," + base64data });
}

var docDefinition = {
  // a string or { width: number, height: number }
  pageSize: {
    width: outputFileSizeX * pixelsPerInch,
    height: outputFileSizeY * pixelsPerInch,
  },

  pageMargins: [0, 0, 0, 0],

  // by default we use portrait, you can change it to landscape if you wish
  pageOrientation: "landscape",

  info: {
    title: "Flocking AI postcard project",
    author: "Steven Smethurst @funvill abluestar.com",
  },

  defaultStyle: {
    fontSize: 15,
    bold: true,
    font: "Helvetica",
  },

  content: content,
};

const outputPDFFile = path.join(destinationFolderPath, "done.pdf");
console.log("outputPDFFile: " + outputPDFFile);

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream(outputPDFFile));
pdfDoc.end();
