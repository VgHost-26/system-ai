import React from 'react'

export const HelpButton = () => {
  return (
    <>
      <dialog id='helpDialog'>
        tutaj będzie cała instrukcja obsługi programu itp
        <button onClick={()=> helpDialog.close()}>OK</button>
      </dialog>
      <button
        id='helpButton'
        className='button-circle'
        onClick={()=>helpDialog.showModal()}
      >?</button>
    </>
  )
}
