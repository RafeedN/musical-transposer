/*
These functions handle parsing the chord-pro text format
*/

//Data Structures and Global Variables
const map1 = new Map();

map1.set('A', 1);
map1.set('A#', 2);
map1.set('B', 3);
map1.set('C', 4);
map1.set('C#', 5);
map1.set('D', 6);
map1.set('D#', 7);
map1.set('E', 8);
map1.set('F', 9);
map1.set('F#', 10);
map1.set('G', 11);
map1.set('G#', 12);

const chords = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

countUp = 0;
countDown = 0;

function parseChordProFormat(chordProLinesArray) {
  countUp = 0;
  countDown = 0;
  //parse the song lines with embedded
  //chord pro chords and add them to DOM
  console.log('parseChordProFormat::chordProLinesArray')
  console.dir(chordProLinesArray)

  //clear any newline or return characters as a precaution --might not be needed
  for (let i = 0; i < chordProLinesArray.length; i++) {
    chordProLinesArray[i] = chordProLinesArray[i].replace(/(\r\n|\n|\r)/gm, "");
  }

  //add the lines of text to html <p> elements
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ''

  for (let i = 0; i < chordProLinesArray.length; i++) {
    let line = chordProLinesArray[i]
    let isReadingChord = false;

    chordLine = ''
    lyricLine = ''
    let chordLength = 0 //length of chord symbol

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      let ch = line.charAt(charIndex)
      if (ch === '[') {
        isReadingChord = true
        chordLength = 0
      }
      if (ch === ']') {
        isReadingChord = false
      }
      if (!isReadingChord && ch != ']') {
        lyricLine = lyricLine + ch
        if (chordLength > 0) chordLength-- //consume chord symbol char
        else chordLine = chordLine + ' '   //pad chord line with blank
      }
      if (isReadingChord && ch != '[') {
        chordLine = chordLine + ch
        chordLength++
      }

    }

    console.log('')
    if (chordLine.trim() !== '') textDiv.innerHTML = textDiv.innerHTML + `<pre> <span class='chord'>${chordLine}</span></pre>`;

    if (lyricLine.trim() !== '') textDiv.innerHTML = textDiv.innerHTML + `<pre> ${lyricLine}</pre>`
  }
}

//Mod function
function mod(y, x) {
  return ((y % x) + x) % x;
}

//=============================================================================
//Algorithm to change the chords and transpose them one semi-tone up or down
function transpose(direction) {

  countIncrement(direction)
  
  const span = document.querySelectorAll('span');
  for (let i = 0; i < span.length; i++) {
    let string = ''
    for (let x = 0; x < span[i].innerHTML.length; x++) {
      if (map1.has(span[i].innerHTML[x])) {
        if (span[i].innerHTML[x + 1] === "#") {
          let chord = span[i].innerHTML[x]
          chord += "#"

          let index;
          if(direction === "down"){
            index = mod((map1.get(chord) - 2), 12)
          }else{
            index = mod(map1.get(chord), 12)
          }

          string += chords[index]
        } else if (span[i].innerHTML[x + 1] === "b") {
          let tempIndx
          if(direction === "down"){
            tempIndx = mod(map1.get(span[i].innerHTML[x]) - 3, 12)
          }else{
            tempIndx = mod(map1.get(span[i].innerHTML[x]) - 1, 12)
          }
          
          string += chords[tempIndx]
        } else {
          if(direction === "down"){
            index = mod((map1.get(span[i].innerHTML[x]) - 2), 12)
          }else{
            index = mod(map1.get(span[i].innerHTML[x]), 12)
          }
          
          string += chords[index]
        }

      } else {
        if (span[i].innerHTML[x] !== "#" && span[i].innerHTML[x] !== "b") {
          string += span[i].innerHTML[x];
        }
      }
    }
    span[i].innerText = string;
  }
  chordsColor()
}

function countIncrement(direction){
  if(direction === "down"){
    ++countDown;
  }else{
    ++countUp;
  }
}

//When it reaches the original notes it turns green otherwise its red
function chordsColor(){
  const span = document.querySelectorAll('span');
  if (countUp - countDown === 0 || mod(countUp - countDown, 12) === 0) {
    for (let i = 0; i < span.length; i++) {
      span[i].style.color = "green";
    }
  }else{
    for (let i = 0; i < span.length; i++) {
      span[i].style.color = "red";
    }
  }
}