// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import settings from 'electron-settings';

const { app, shell } = electron;

// Create the Application's main menu
// https://github.com/electron/electron/blob/master/docs/api/menu.md#examples
export const getTemplate = fetherApp => {
  const menuItemAlwaysOnTop = {
    label: 'Toggle Always On Top',
    click () {
      const isAlwaysOnTop = settings.has('always-on-top')
        ? settings.get('always-on-top')
        : fetherApp.win.isAlwaysOnTop();

      fetherApp.win.setAlwaysOnTop(!isAlwaysOnTop);
      settings.set('always-on-top', !isAlwaysOnTop);

      if (isAlwaysOnTop) {
        fetherApp.win.moveTop();
      }
    }
  };

  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, menuItemAlwaysOnTop, { role: 'close' }]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () {
            shell.openExternal('https://parity.io');
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
      }
    );

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      menuItemAlwaysOnTop,
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }

  return template;
};
