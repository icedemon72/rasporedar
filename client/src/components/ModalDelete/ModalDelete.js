import React from 'react'

const ModalDelete = ({ display, title, text, children }) => {
  return (
    <div className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-outline-none bg-black flex justify-center items-center">
      <div className="w-[500px] h-[200px] bg-slate-500 rounded-sm">
        <div className="">
          <p>{ title }</p>
        </div>
        <div className="">
          <p>{ text }</p>
        </div>
        <div className="">
          { children.map(child => {
            return <child.type onClick={child.props.onClick}>{ child.props.children }</child.type>
          })} 
        </div>
      </div>
    </div>
  )
}

export default ModalDelete