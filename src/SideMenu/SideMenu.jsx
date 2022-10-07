import React, { useState } from 'react';

import { Menu, SubMenu, Item } from "burger-menu";
import Hamburger from 'hamburger-react'

import 'burger-menu/lib/index.css';
import './Menu.css';

export const SideMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div id="hamburger-menu">
        <Hamburger
          onToggle={() => setIsOpen(!isOpen)}
          toggled={isOpen}
        />
      </div>
      <Menu
        className="burger-menu"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        side={"left"}
        customCrossIcon={true}
        overlayClassName={"burger-overlay"}
      >
        <SubMenu title="Filter By Kana Set">
          {props.letterSetOptions}
        </SubMenu>
      </Menu>
    </>

  );
}