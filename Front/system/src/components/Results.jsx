import React from 'react'

export const Results = ({ allResponses }) => {
  return (
    <div id='results' className='section'>
      <p className='sectionTitle'>Wyniki</p>
      <hr />
      {allResponses.map((formattedResponse, index) => (
        <div key={index} className='formattedResponse'>
          <p dangerouslySetInnerHTML={{ __html: formattedResponse }}></p>
          <hr className='result-separator' />
        </div>
      ))}
    </div>
  )
}
