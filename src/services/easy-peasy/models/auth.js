import { action, thunk } from 'easy-peasy'
import * as Localization from 'expo-localization';

export default {
  user: null,
  language: 'ar',
  token: null,
  cities: null,
  genders: null,
  notifToken: null,
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setLanguage: action((state, payload) => {
    state.language = payload;
  }),
  setCities: action((state, payload) => {
    state.cities = payload;
  }),
  setGenders: action((state, payload) => {
    state.genders = payload;
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