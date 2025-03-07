import React, { useState, useEffect } from "react";
import { ALL_OPTION, KATAKANA_OPTION, HIRAGANA_OPTION } from "../utils";

import "./Menu.less";

const BurgerMenu = (props) => {
  const { isOpen, onClick } = props;

  return (
    <div className="burger-menu" onClick={onClick}>
      <span className={isOpen ? "bar x" : "bar"}></span>
      <span className={isOpen ? "bar x" : "bar"}></span>
      <span className={isOpen ? "bar x" : "bar"}></span>
    </div>
  );
};

export const SideMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [vignetteVisible, setVignetteVisible] = useState(false);

  const getDotsToggle = () => {
    let title = props.dotsToggle ? "Enabled" : "Disabled";
    return (
      <div>
        <input
          type="checkbox"
          name="dots"
          id="dots"
          checked={props.dotsToggle}
          onChange={props.handleDotsToggle}
          className="radio-btn"
        />
        <label htmlFor="dots" className="radio-btn-label">
          {title}
        </label>
      </div>
    );
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
          checked={props.letterSetFilter === ALL_OPTION}
          onChange={props.applySetFilter}
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
          checked={props.letterSetFilter === HIRAGANA_OPTION}
          onChange={props.applySetFilter}
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
          checked={props.letterSetFilter === KATAKANA_OPTION}
          onChange={props.applySetFilter}
        />
        <label htmlFor="KATAKANA" className="radio-btn-label">
          KATAKANA
        </label>
      </div>,
    ];
    return buttons;
  };

  const getThemeSwitchButton = () => {
    let title = props.theme === "dark" ? "DARK MODE" : "LIGHT MODE";

    return (
      <div>
        <input
          type="checkbox"
          name="theme"
          id="theme"
          checked={props.theme === "light"}
          onChange={props.switchTheme}
          className="radio-btn"
        />
        <label htmlFor="theme" className="radio-btn-label">
          {title}
        </label>
      </div>
    );
  };

  // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  useEffect(() => {
    async function waitForVignette() {
      await waitForElm("#vignette").then(setIsOpen(true));
    }
    if (vignetteVisible) {
      waitForVignette();
    }
  }, [vignetteVisible]);

  const handleMenuOpen = async () => {
    //open drawer
    if (!isOpen) {
      setVignetteVisible(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div id="side-menu">
      {vignetteVisible && (
        <div
          id="vignette"
          className={isOpen ? "vignette open" : "vignette"}
          onClick={() => {
            if (isOpen) setIsOpen(false);
          }}
          onTransitionEnd={() => {
            if (!isOpen) setVignetteVisible(false);
          }}
        />
      )}
      <div className={isOpen ? "drawer open" : "drawer"}>
        <div className="options">
          <p className="option-title">Filter By Kana Set</p>
          {getFilterButtons()}
          <div className="menu-break" />
          <p className="option-title">Dakuten / Handakuten</p>
          {getDotsToggle()}
          <div className="menu-break" />
          <p className="option-title">Theme</p>
          {getThemeSwitchButton()}
        </div>
      </div>
      <BurgerMenu isOpen={isOpen} onClick={handleMenuOpen} />
    </div>
  );
};
