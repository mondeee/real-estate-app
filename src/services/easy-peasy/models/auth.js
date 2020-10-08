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
  isMediaAllowed: false,
  districts: null,
  location: null,
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setAllowMedia: action((state, payload) => {
    state.isMediaAllowed = payload;
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
  setDistricts: action((state, payload) => {
    state.districts = payload;
  }), 
  setLocation: action((state, payload) => {
    state.location = payload;
  }), 
  clearAuth: action((state, payload) => {
    state.user = {};
  })
}