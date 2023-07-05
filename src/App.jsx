import { useEffect, useState } from "react";
import { getRandomInt, shuffleArray } from "./utils";
import useLocalStorage from "use-local-storage";

import "./App.css";
import data from "./data.json";
import dots from "./dots.json";

import { SideMenu } from "./SideMenu/SideMenu";

const ALL_OPTION = "ALL";
const HIRAGANA_OPTION = "h";
const KATAKANA_OPTION = "k";

function App() {
  const [masterCharList, setMasterCharList] = useState([]); //master list of alphabetical objects
  const [masterDotsList, setMasterDotsList] = useState([]); //master list of all dakuten and handakuten
  const [masterQueue, setMasterQueue] = useState([]); //shuffled list to iterate over
  const [currIndex, setCurrIndex] = useState(0); //keeps track of where the list is
  const [masterNameList, setMasterNameList] = useState([]); //english names of syllables
  const [masterDotsNameList, setMasterDotsNameList] = useState([]); //english names of dakuten / handakuten syllables
  const [currentNamesList, setCurrentNamesList] = useState([]);
  const [currOptions, setCurrOptions] = useState([]); //current options to pick
  const [currChar, setCurrChar] = useState(null); //current character
  const [displayedChar, setDisplayedChar] = useState(null); //displayed character
  const [willAskForNext, setWillAskForNext] = useState(false); //next trigger
  const [answerMessage, setAnswerMessage] = useState(null); //response message
  const [letterSetFilter, setLetterSetFilter] = useState(ALL_OPTION); //filter options
  const [dotsToggle, setDotsToggle] = useState(false);

  //THEMING STUFF
  const defaultLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultLight ? "light" : "dark"
  );

  const switchTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  //SET UP
  useEffect(() => {
    document.title = "Kana Tool :3";

    //Populate initial data
    let list = data.data;
    let dotsList = dots.data;

    let masterCharListBuffer = [];
    let masterNameListBuffer = [];

    let masterDotsListBuffer = [];
    let masterDotsNameListBuffer = [];

    list.forEach((element) => {
      let charList = element.chars;
      charList.forEach((item) => {
        if (item.h !== "" && item.k !== "") {
          masterCharListBuffer.push(item);
          masterNameListBuffer.push(item.n);
        }
      });
    });

    dotsList.forEach((element) => {
      let charList = element.chars;
      charList.forEach((item) => {
        if (item.h !== "" && item.k !== "") {
          masterDotsListBuffer.push(item);
          masterDotsNameListBuffer.push(item.n);
        }
      });
    });

    setMasterCharList(masterCharListBuffer);
    setMasterNameList(masterNameListBuffer);

    setMasterDotsList(masterDotsListBuffer);
    setMasterDotsNameList(masterDotsNameListBuffer);
  }, []);

  useEffect(() => {
    //Set up initial character and options once loaded
    if (masterCharList.length !== 0) {
      getNewCharacter();
    }
  }, [masterQueue]);

  const getAllChars = () => {
    let newList = [];

    masterCharList.forEach((element) => {
      let obj = { name: "", char: "" };
      obj.name = element.n;
      obj.char = element[HIRAGANA_OPTION];
      newList.push(obj);

      let obj2 = { name: "", char: "" };
      obj2.name = element.n;
      obj2.char = element[KATAKANA_OPTION];
      newList.push(obj2);
    });

    if (dotsToggle) {
      masterDotsList.forEach((element) => {
        let obj = { name: "", char: "" };
        obj.name = element.n;
        obj.char = element[HIRAGANA_OPTION];
        newList.push(obj);

        let obj2 = { name: "", char: "" };
        obj2.name = element.n;
        obj2.char = element[KATAKANA_OPTION];
        newList.push(obj2);
      });
    }

    return newList;
  };

  const getHiraganaOrKatakana = (option) => {
    let newList = [];

    masterCharList.forEach((element) => {
      let obj = { name: "", char: "" };
      obj.name = element.n;
      obj.char = element[option];
      newList.push(obj);
    });

    if (dotsToggle) {
      masterDotsList.forEach((element) => {
        let obj = { name: "", char: "" };
        obj.name = element.n;
        obj.char = element[option];
        newList.push(obj);
      });
    }

    return newList;
  };

  useEffect(() => {
    let newList = [];
    switch (letterSetFilter) {
      case ALL_OPTION:
        newList = getAllChars();
        break;
      case HIRAGANA_OPTION:
        newList = getHiraganaOrKatakana(HIRAGANA_OPTION);
        break;
      case KATAKANA_OPTION:
        newList = getHiraganaOrKatakana(KATAKANA_OPTION);
        break;
      default:
        newList = getAllChars();
    }

    let currentNamesBuffer = dotsToggle
      ? masterNameList.concat(masterDotsNameList)
      : masterNameList;
    setCurrentNamesList(currentNamesBuffer);

    shuffleArray(newList);
    setMasterQueue(newList);
    setCurrIndex(0);
  }, [letterSetFilter, masterCharList, dotsToggle]);

  const getNewCharacter = () => {
    let tmpChar;

    if (currIndex > masterQueue.length - 1) {
      console.log("RESET ARRAY");
      tmpChar = masterQueue[0];
      setCurrIndex(0);

      let tmpArray = masterQueue;
      shuffleArray(tmpArray);
      setMasterQueue(tmpArray);
    } else {
      tmpChar = masterQueue[currIndex];
    }

    if (tmpChar && tmpChar.name) {
      let tmpOptions = getOptions(tmpChar.name);

      //Dump buffer
      setCurrChar(tmpChar);
      setCurrOptions(tmpOptions);
      setDisplayedChar(tmpChar.char);
    }
  };

  const getOptions = (currCharBuff) => {
    let currOptionsBuffer = [];

    currOptionsBuffer.push(currCharBuff);

    while (currOptionsBuffer.length < 3) {
      let index = getRandomInt(currentNamesList.length);

      let sylb = currentNamesList[index];

      if (currOptionsBuffer.includes(sylb) === false) {
        currOptionsBuffer.push(sylb);
      }
    }
    shuffleArray(currOptionsBuffer);

    return currOptionsBuffer;
  };

  //Selective rendering for buttons
  const getButtons = () => {
    if (willAskForNext === false) {
      let buttons = [];
      for (let [i, v] of currOptions.entries()) {
        buttons.push(
          <button className="btn-option" key={i} onClick={() => checkAnswer(v)}>
            {v}
          </button>
        );
      }
      return buttons;
    } else {
      return (
        <button className="btn-option" onClick={() => handleNext()}>
          Next
        </button>
      );
    }
  };

  const checkAnswer = (char) => {
    setWillAskForNext(true);
    if (char == currChar.name) {
      setAnswerMessage("Correct!");
    } else {
      setAnswerMessage("Sorry, the right answer was: " + currChar.name);
    }
    setCurrIndex((e) => e + 1);
  };

  const handleNext = () => {
    setAnswerMessage(null);
    setWillAskForNext(false);
    getNewCharacter();
  };

  const applySetFilter = (e) => {
    let option = e.target.value;
    switch (option) {
      case ALL_OPTION:
        setLetterSetFilter(ALL_OPTION);
        break;
      case HIRAGANA_OPTION:
        setLetterSetFilter(HIRAGANA_OPTION);
        break;
      case KATAKANA_OPTION:
        setLetterSetFilter(KATAKANA_OPTION);
        break;
      default:
        setLetterSetFilter(ALL_OPTION);
    }
  };

  const handleDotsToggle = () => {
    setDotsToggle((e) => !e);
  };

  const getFilterButtons = () => {
    let buttons = [
      <div key={ALL_OPTION}>
        <input
          type="radio"
          name="letter-set"
          id="ALL"
          className="radio-btn"
          value={ALL_OPTION}
          checked={letterSetFilter === ALL_OPTION}
          onChange={applySetFilter}
        />
        <label htmlFor="ALL" className="radio-btn-label">
          ALL
        </label>
      </div>,
      <div key={HIRAGANA_OPTION}>
        <input
          type="radio"
          name="letter-set"
          id="HIRAGANA"
          className="radio-btn"
          value={HIRAGANA_OPTION}
          checked={letterSetFilter === HIRAGANA_OPTION}
          onChange={applySetFilter}
        />
        <label htmlFor="HIRAGANA" className="radio-btn-label">
          HIRAGANA
        </label>
      </div>,
      <div key={KATAKANA_OPTION}>
        <input
          type="radio"
          name="letter-set"
          id="KATAKANA"
          className="radio-btn"
          value={KATAKANA_OPTION}
          checked={letterSetFilter === KATAKANA_OPTION}
          onChange={applySetFilter}
        />
        <label htmlFor="KATAKANA" className="radio-btn-label">
          KATAKANA
        </label>
      </div>,
    ];
    return buttons;
  };

  const getDotsToggle = () => {
    let title = dotsToggle ? "Enabled" : "Disabled";
    return (
      <div>
        <input
          type="checkbox"
          name="dots"
          id="dots"
          checked={dotsToggle}
          onChange={handleDotsToggle}
          className="radio-btn"
        />
        <label htmlFor="dots" className="radio-btn-label">
          {title}
        </label>
      </div>
    );
  };

  const getThemeSwitchButton = () => {
    let title = theme === "dark" ? "DARK MODE" : "LIGHT MODE";

    return (
      <div>
        <input
          type="checkbox"
          name="theme"
          id="theme"
          checked={theme === "light"}
          onChange={switchTheme}
          className="radio-btn"
        />
        <label htmlFor="theme" className="radio-btn-label">
          {title}
        </label>
      </div>
    );
  };

  return (
    <div className="App" data-theme={theme}>
      <SideMenu
        letterSetOptions={getFilterButtons()}
        dotsOption={getDotsToggle()}
        themeOption={getThemeSwitchButton()}
      />
      <div id="card">
        <p id="char">{currChar && displayedChar}</p>
      </div>
      <div id="buttons">{getButtons()}</div>
      {answerMessage && (
        <div id="answer-check">
          <p id="message">{answerMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App;
