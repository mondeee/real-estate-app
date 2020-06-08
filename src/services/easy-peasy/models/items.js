import { action, thunk } from 'easy-peasy'
import * as Localization from 'expo-localization';

export default {
  property: null,
  section: null,
  setProperty: action((state, payload) => {
    state.property = payload;
  }),
  setSection: action((state, payload) => {
    state.section = payload;
  }),
  clearData: action((state, payload) => {
    state.property = {};
    state.section = {};
  })
}