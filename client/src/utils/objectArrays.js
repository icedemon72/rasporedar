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

export const excludeSameIDsFromArray = (arrToExclude, excludee) => {
  let finalArray = [];
  for(let i = 0; i < arrToExclude.length; i++) {
    let toPush = true;
    for(let j = 0; j < excludee.length; j++) {
      if(arrToExclude[i]._id === excludee[j]._id) {
        toPush = false;
        break;
      }
    }

    if(toPush) {
      finalArray.push(arrToExclude[i]);
    } 
  }

  return finalArray;
}