
var canvas;
let rawData = [];
var fileName = [];
let files = [];
var numberOfFiles=0;
function setup() {
  titleText = createElement('h1', 'Load DJI SRT files here to fix altitude');
  titleText.position(5,5);
  input = createFileInput(handleFile, true);//multiple file input
  input.position(5, 75);
  fixButton = createButton('Fix Files');
  fixButton.position(5, 100);
  fixButton.mousePressed(fixFiles);
  fixButton.hide();
}

function draw() {
}

function handleFile(file) {

  if (file.name.indexOf("srt") >= 0 || file.name.indexOf("SRT") >= 0) {//make sure its an SRT file
    print("srt file found");
    print(file.name);
    fileName[numberOfFiles] = file.name;
    //files[numberOfFiles] = file;
    rawData[numberOfFiles] = loadStrings(file.data, fileLoaded);
    numberOfFiles++;
  }
}

function fileLoaded() {
  input.hide();
  fixButton.show();
}

function fixFiles() {
  let altKeyWord = "altitude: ";
  let altKeyLength = altKeyWord.length;
  for (let i=0; i<numberOfFiles; i++) {
    //rawData = loadStrings(files[i].data);
    var index = 0;
    while (index < rawData[i].length) {
      let indexForAltitude = rawData[i][index].indexOf(altKeyWord);
      if (indexForAltitude >= 0) {
        let altitudeString = rawData[i][index].substring(indexForAltitude+altKeyLength, indexForAltitude+altKeyLength+9);
        let altitudeFloatFixed = float(altitudeString)*10;
        // print(altitudeString + "->" + str(altitudeFloatFixed));
        rawData[i][index] = rawData[i][index].replace(altitudeString, str(altitudeFloatFixed));
      }
      index++;
    }
    saveStrings(rawData[i], "FIXED_"+fileName[i], "SRT");
  }
  numberOfFiles=0;
  fixButton.hide();
  input.show();
}
