/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import "./i18n"
import DialApp from './DialApp';
import CallApp from './CallApp';

AppRegistry.registerComponent("launcher", () => App);
AppRegistry.registerComponent("dialer", () => DialApp);
AppRegistry.registerComponent("call", () => CallApp);