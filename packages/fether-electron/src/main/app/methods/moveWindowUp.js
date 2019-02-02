// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import Pino from '../utils/pino';

const pino = Pino();

/**
 * If the Fether window is restored on a page with a small window height
 * and the window is positioned close to the bottom of the screen, then
 * we do not want it to crop the bottom of the window when the user navigates
 * to a page with a larger window height. So if the user navigates to a page
 * with a larger window height that causes it to be cropped, then we will
 * automatically move the window upward so it is viewable to the user
 */
function moveWindowUp () {
  if (!this.fetherApp.window) {
    return;
  }

  pino.info('Fether window resized. Moving it back up into view if required');

  const position = this.fetherApp.window.getPosition();
  const positionStruct = {
    x: position[0],
    y: position[1]
  };
  const trayDepth = this.fetherApp.trayDepth || 40; // Default incase resizes on load
  const currentScreenResolution = this.getScreenResolution();
  const windowHeight = this.fetherApp.window.getSize()[1];
  const maxWindowY = currentScreenResolution.y - windowHeight - trayDepth;
  const adjustY = positionStruct.y - maxWindowY;

  if (adjustY > 0) {
    this.fetherApp.emit('moved-window-up-into-view');
    this.fetherApp.window.setPosition(positionStruct.x, maxWindowY);
  }
}

export default moveWindowUp;