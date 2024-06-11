import get from 'lodash/get';

const getLabel = (toLook, data, secondParam = '_id', param = '_id', ) => {
  if(typeof toLook === 'object') {
    if(toLook?.length > 0){
      const selected = toLook.map((prof) => ({
        value: prof,
        // @ts-ignore
        label: get(data.find((p) => p[param] === prof), secondParam) // change this...
      }));

      return selected;
    }
  } else if (typeof toLook === 'string') {
    const selected = { value: toLook, label: get(data.find((p) => get(p, secondParam) === toLook), param) }    
    return selected;
  }
  
}

export default getLabel;