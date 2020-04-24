import { action, thunk } from 'easy-peasy'
import * as Localization from 'expo-localization';

export default {
  user: null,
  language: 'ar',
  token: null,
  notifToken: null,
  setLanguage: action((state, payload) => {
    state.language = payload;
  }),
  setToken: action((state, payload) => {
    state.token = payload;
  }),
  setNotifToken: action((state, payload) => {
    state.notifToken = payload;
  }),
  clearAuth: action((state, payload) => {
    state.user = {};
  })
}