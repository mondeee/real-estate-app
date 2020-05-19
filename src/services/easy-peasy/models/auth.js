import { action, thunk } from 'easy-peasy'
import * as Localization from 'expo-localization';

export default {
  user: null,
  language: 'ar',
  token: null,
  cities: null,
  genders: null,
  notifToken: null,
  categories: null,
  commercial_types: null,
  private_types: null,
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
  setCategories: action((state, payload) => {
    state.categories = payload;
  }),
  setCommercialTypes: action((state, payload) => {
    state.commercial_types = payload;
  }),
  setPivateTypes: action((state, payload) => {
    state.private_types = payload;
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