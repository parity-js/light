// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import Pino from '../utils/pino';

const pino = Pino();

function setupWin32Listeners () {
  if (process.platform === 'win32') {
    /**
     * Hook WM_SYSKEYUP
     *
     * Open the Fether Electron menu when the Fether window is active
     * and the user enters a keyboard combination of both the ALT and 'm' keys
     *
     * Reference: https://docs.microsoft.com/en-gb/windows/desktop/inputdev/wm-syskeyup
     */
    this.fetherApp.window.hookWindowMessage(
      Number.parseInt('0x0105'),
      (wParam, lParam) => {
        // Reference: https://nodejs.org/api/buffer.html
        /**
         * Detect when user presses ALT+keyCode.
         * i.e. Use `wParam && wParam.readUInt32LE(0) === 77` to detect ALT+m
         */
        if (wParam) {
          this.showTrayBalloon();
        }
      }
    );

    /**
     * Hook WM_SYSCOMMAND
     *
     * Detect events on Windows
     *
     * Credit: http://robmayhew.com/listening-for-events-from-windows-in-electron-tutorial/
     */
    this.fetherApp.window.hookWindowMessage(
      Number.parseInt('0x0112'),
      (wParam, lParam) => {
        let eventName = null;

        if (wParam.readUInt32LE(0) === 0xf060) {
          // SC_CLOSE
          eventName = 'close';
          this.onWindowClose();
        } else if (wParam.readUInt32LE(0) === 0xf030) {
          // SC_MAXIMIZE
          eventName = 'maximize';
          this.showTrayBalloon();
        } else if (wParam.readUInt32LE(0) === 0xf020) {
          // SC_MINIMIZE
          eventName = 'minimize';
          this.processSaveWindowPosition();
        } else if (wParam.readUInt32LE(0) === 0xf120) {
          // SC_RESTORE
          eventName = 'restored';
          this.showTrayBalloon();
        }

        if (eventName !== null) {
          pino.info('Detected event:', eventName);
        }
      }
    );

    /**
     * Hook WM_EXITSIZEMOVE
     *
     * Detect event on Windows when Fether window was moved
     * or resized
     */
    this.fetherApp.window.hookWindowMessage(
      Number.parseInt('0x0232'),
      (wParam, lParam) => {
        pino.info('Detected completion of move or resize event');

        // Move Fether window back up into view if it was a resize event
        // that causes the bottom to be cropped
        this.moveWindowUp();

        // Try again after a delay incase Fether window resize occurs
        // x seconds after navigating to a new page.
        setTimeout(() => {
          this.moveWindowUp();
        }, 5000);

        // Save Fether window position to Electron settings
        this.processSaveWindowPosition();
      }
    );
  }
}

export default setupWin32Listeners;