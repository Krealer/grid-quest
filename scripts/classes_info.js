import classes from '../info_data/classes.js';

export function getClassInfo(id) {
  return classes.find((c) => c.id === id);
}

export function getAllClasses() {
  return classes;
}
