import { error, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile';
defaultModules.set(PNotifyMobile, {});

export default error;
