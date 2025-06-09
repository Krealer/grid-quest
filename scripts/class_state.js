import { getClassInfo } from './classesInfo.js';

const STORAGE_KEY = 'gridquest.class';
let chosenClass = null;

function loadClass() {
  if (chosenClass !== null) return chosenClass;
  const id = localStorage.getItem(STORAGE_KEY);
  if (id) {
    chosenClass = id;
  }
  return chosenClass;
}

function saveClass() {
  if (chosenClass) {
    localStorage.setItem(STORAGE_KEY, chosenClass);
  }
}

export function chooseClass(id) {
  if (chosenClass) return false;
  const info = getClassInfo(id);
  if (!info) return false;
  chosenClass = id;
  saveClass();
  document.dispatchEvent(new CustomEvent('classChosen', { detail: { id } }));
  return true;
}

export function getChosenClass() {
  return loadClass();
}

export function getClassBonuses() {
  const id = loadClass();
  const info = id ? getClassInfo(id) : null;
  return info?.bonuses || {};
}
