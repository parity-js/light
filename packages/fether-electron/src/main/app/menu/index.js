// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import { template } from './template';

const { Menu } = electron;

const menu = Menu.buildFromTemplate(template);

const getMenu = () => {
  return menu;
};

const addMenu = fetherAppWindow => {
  Menu.setApplicationMenu(menu);
  fetherAppWindow.setAutoHideMenuBar(true);
};

export { addMenu, getMenu };