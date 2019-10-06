export function removeById(array, id) {
  let index = -1;

  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    array.splice(index, 1);
  }
  
  return array;
}
