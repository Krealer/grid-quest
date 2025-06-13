import classes from '../info_data/classes.json' assert { type: 'json' };

export function getClassInfo(id) {
  return classes.find((c) => c.id === id);
}

export function getAllClasses() {
  return classes;
}
