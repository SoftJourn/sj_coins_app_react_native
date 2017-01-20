/**
 * @flow
 */

'use strict';

import type { Action } from './types';

type Tab = 'home' | 'favorites' | 'all-items' | 'profile';

function switchTab(tab: Tab): Action {
  return {
    type: 'SWITCH_TAB',
    tab,
  }
}

module.exports = { switchTab };
