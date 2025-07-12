import "./StudyMap.less";

export const StudyMap = (props) => {
  const { letterDict } = props;

  const getLetterBoxes = () => {
    const elements = [];
    for (let i = 0; i < letterDict.length; i++) {
      const elementTemplate = [];
      for (let j = 0; j < letterDict[i].chars.length; j++) {
        const letter = letterDict[i].chars[j];
        if (letter.h === "" && letter.k === "") {
          console.log(letter.n)
          elementTemplate.push(<div className="letterBox"></div>);
        } else {
          elementTemplate.push(
            <div className="letterBox">
              <div className="char">
                {letter.h} {letter.k}
              </div>
              <div className="name">{letter.n}</div>
            </div>,
          );
        }
      }
      elements.push(<div className="letterRow">{elementTemplate}</div>);
    }
    return elements;
  };

  return (
    <div id="studymap">
      <div className="vignette" />
      <div id="letterFlex">
        <div id="letterContainer">{getLetterBoxes()}</div>
      </div>
    </div>
  );
};
