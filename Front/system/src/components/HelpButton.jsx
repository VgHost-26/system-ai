import React from "react"

export const HelpButton = ({ children }) => {
  return (
    <>
      <dialog id='helpDialog'>
        {children}
        <button onClick={() => helpDialog.close()}>OK</button>
      </dialog>
      <button
        id='helpButton'
        className='button-circle'
        onClick={() => helpDialog.showModal()}
      >
        ?
      </button>
    </>
  )
}
