// This function returns index of "key" with value "value" in objectArray (array of objects)
// if the index is not found, returns -1
export const indexOfKeyInArray = (objectArray, key, value) => {
  for(let i = 0; i < objectArray.length; i++) {
    if(objectArray[i][key] === value) {
      return i;
    }
  }
  return -1;
}

// export const findIndexFromKey = (objectArray, key, value) => {
//   for (let i = 0; i < objectArray.length; i++) {
//     if(objectArray[i][key] ===)
//   }
// }