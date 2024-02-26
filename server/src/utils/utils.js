import { ObjectId } from 'mongodb'

export const isObjectIdValid = (id) => !ObjectId.isValid(id) ? { valid: false, message: `'${id}' nije ObjectId!`} : { valid: true };