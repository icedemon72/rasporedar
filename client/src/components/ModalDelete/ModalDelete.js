import React from 'react'
import { AlertTriangle } from 'lucide-react';
// CHANGE THIS TO ACCEPT A FUNCTION
const ModalDelete = ({ closeFunc, title, text, children }) => {
  return (
    <>
      <div className="fixed left-0 top-0 z-[1054] h-full w-full overflow-y-auto overflow-x-outline-none bg-black bg-opacity-80 flex justify-center items-center">
        <div className="fixed left-0 top-0 h-full w-full z-[1055]" onClick={closeFunc}></div>
        <div className="max-w-[600px] min-h-[250px] z-[1056] bg-secondary border-4 border-black py-8 px-16 flex flex-col justify-between">
        <div className="text-center font-bold text-xl flex justify-center">
            <p><AlertTriangle color="red" size={46} /></p>
          </div>
          <div className="text-center ">
            <p className="font-bold text-xl">{ title }</p>
            <p className="text-lg">{ text }</p>
          </div>
          <div className="flex flex-row justify-center gap-3">
            { children.map(child => {
              return <child.type className={child.props.className} onClick={child.props.onClick}>{ child.props.children }</child.type>
            })} 
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalDelete;