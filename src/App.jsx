import { useEffect, useState } from 'react';
import { getRandomInt, shuffleArray } from './utils';

import './App.css'
import data from './data.json';

function App() {
  const [masterCharList, setMasterCharList] = useState([]); //master list of alphabetical objects
  const [masterSylList, setMasterSylList] = useState([]); //head of syllables 
  const [masterQueue, setMasterQueue] = useState([]); //shuffled list to iterate over
  const [currIndex, setCurrIndex] = useState(0); //keeps track of where the list is
  const [masterNameList, setMasterNameList] = useState([]); //english names of syllables
  const [currOptions, setCurrOptions] = useState([]); //current options to pick
  const [currChar, setCurrChar] = useState(null); //current character
  const [displayedChar, setDisplayedChar] = useState(null); //displayed character
  const [willAskForNext, setWillAskForNext] = useState(false); //next trigger
  const [answerMessage, setAnswerMessage] = useState(null); //response message

  useEffect(() => {
    document.title = "Kana Tool :3"

    //Populate initial data
    let list = data.data;
    let masterListBuffer = [];
    let masterCharListBuffer = [];
    let masterNameListBuffer = [];
    let masterQueueBuffer = [];
    

    list.forEach((element) => {
      masterListBuffer.push(element.syl);
      let charList = element.chars;
      charList.forEach((item) => {
        if (item.h !== "" && item.k !== "") {
          masterCharListBuffer.push(item);
          masterNameListBuffer.push(item.n);
        }
      });
    })

    masterCharListBuffer.forEach((element) => {
      let obj = {name: "", char: ""}
      obj.name = element.n;
      obj.char = element.h;

      masterQueueBuffer.push(obj);

      let obj2 = {name: "", char: ""}
      obj2.name = element.n;
      obj2.char = element.k;

      masterQueueBuffer.push(obj2);
    });

    //SCRAMBLES IT
    shuffleArray(masterQueueBuffer);

    setMasterCharList(masterCharListBuffer);
    setMasterSylList(masterListBuffer);    
    setMasterNameList(masterNameListBuffer);
    setMasterQueue(masterQueueBuffer);
  }, []);

  useEffect(() => {
    //Set up initial character and options
    if (masterCharList.length !== 0) {
      getNewCharacter();
    }

  }, [masterCharList]);

  const getNewCharacter = () => {
    let tmpChar;

    if (currIndex > masterQueue.length - 1){
      console.log("RESET ARRAY")
      tmpChar = masterQueue[0];
      setCurrIndex(0);

      let tmpArray = masterQueue;
      shuffleArray(tmpArray);
      setMasterQueue(tmpArray);      
    } else {
      tmpChar = masterQueue[currIndex];
      setCurrIndex(currIndex + 1);
    }

    let tmpOptions = getOptions(tmpChar.name);    

    //Dump buffer
    setCurrChar(tmpChar);
    setCurrOptions(tmpOptions);
    setDisplayedChar(tmpChar.char);    
  };

  const getOptions = (currCharBuff) => {
    let currOptionsBuffer = [];

    currOptionsBuffer.push(currCharBuff);    

    while (currOptionsBuffer.length < 3) {
      let index = getRandomInt(masterNameList.length)

      let sylb = masterNameList[index];

      if (currOptionsBuffer.includes(sylb) === false) {
        currOptionsBuffer.push(sylb);
      }
    }
    shuffleArray(currOptionsBuffer);

    return currOptionsBuffer;
  }

  //Selective rendering for buttons
  const getButtons = () => {
    if (willAskForNext === false) {
      let buttons = [];
      for (let [i, v] of currOptions.entries()) {
        buttons.push(<button key={i} onClick={() => checkAnswer(v)} >{v}</button>);
      }
      return buttons;
    } else {
      return <button onClick={() => handleNext()}>Next</button>
    }
  }

  const checkAnswer = (char) => {
    setWillAskForNext(true);
    if (char == currChar.name) {
      setAnswerMessage("Correct!")
    } else {
      setAnswerMessage("Sorry, the right answer was: " + currChar.name);
    }
  }

  const handleNext = () => {
    setAnswerMessage(null);
    setWillAskForNext(false);
    getNewCharacter();
  }

  return (
    <div className="App">
      <div id="card">
        <p id="char">{currChar && displayedChar}</p>
      </div>
      <div id="buttons">
        {getButtons()}
      </div>
      {answerMessage &&
        <div id="answer-check">
          <p id="message">{answerMessage}</p>
        </div>
      }
    </div>
  )
}

export default App;
