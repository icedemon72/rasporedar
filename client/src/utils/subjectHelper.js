import { indexOfKeyInArray } from "./objectArrays";

// This function checks if selectedProfessor (ID) is in fetchedProfessors (array of objects)
export const addProfessorInArray = (selectedProfessor, professors, fetchedProfessors, type) => { 
  // if selectedProfessor isn't default value (0)
  if(selectedProfessor !== '0') {
    const index = professors.indexOf(selectedProfessor);
    // if selectedProfessor doesn't exist in array of IDs professors
    if(index === -1) {
      const tempIndex = indexOfKeyInArray(fetchedProfessors, '_id', selectedProfessor);
      console.log(fetchedProfessors);
      
      let tempProfessors = professors;
      let tempFetched = JSON.parse(JSON.stringify(fetchedProfessors));
      // check if ID exists in fetchedProfessors array, if it doesn't it means that it hasn't been added
      // either as professor or as an assistant
      if(tempIndex !== -1 && (type === 'A' || type === 'P')) {
        tempProfessors = [...tempProfessors, selectedProfessor];
        tempFetched[tempIndex].selected = true;
        tempFetched[tempIndex].role = type;
        
        return {
          tempProfessors: tempProfessors,
          tempFetched: tempFetched,
          done: true
        }
      }
    }
  }

  // if previous return wasn't called done: false should be returned to signalize that no change has been made
  return {
    done: false
  }

}

// This function deletes professor with ID selectedProfessor from fetchedProfessors and professors arrays
export const deleteProfessorFromArray = (selectedProfessor, professors, fetchedProfessors) => {
  // index is the index of selectedProfessor in professors array
  const index = professors.indexOf(selectedProfessor);
  // indexObj is the index of selectedProfessor in fetchedProfessors array of objects (index of _id field)
  const indexObj = indexOfKeyInArray(fetchedProfessors, '_id', selectedProfessor);

  // if it exists and if it is selected 
  if(index !== -1 && fetchedProfessors[indexObj].selected) {
    let tempProfessors = professors;
    let tempFetched = JSON.parse(JSON.stringify(fetchedProfessors));

    tempProfessors.splice(index, 1);
    tempFetched[indexObj].selected = false;
    delete tempFetched[indexObj].role;

    return {
      tempProfessors: tempProfessors,
      tempFetched: tempFetched,
      done: true
    }
  }

  return {
    done: false
  }
}