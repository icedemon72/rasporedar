// Not sure if this will be used but oh my...

// This function adds an item to existing array
// elem is an object passed from input fields (input.target.value)
// key is the key needed to add the item (Enter for example) if null/undefined it won't check for the ky
// check (by default true) checks if the element (elem.target.value) already exists in the array
export const addItemToArrayOnKey = (array, elem, key = undefined, check = true) => {
  const value = elem?.target?.value || elem?.value;
  const pressedKey = elem?.key;
  
  if(pressedKey === key || !key) {
    if(value) {
      if((check && array.indexOf(value) === -1) || !check) {
        return { result: array.concat(value), changed: true };
      } 
    }
  }

  return { result: array, changed: false };
}

// This function deletes an item from an array by index 
export const deleteItemFromArray = (array, index) => {
  if(index >= 0 && index < array.length) {
    array.splice(index, 1);
    return array;
  }
}