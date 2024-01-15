import React from 'react';

export const Results = ({ allResponses }) => {
  return (
    <div id='results' className='section'>
      <p className='sectionTitle'>Wyniki</p>
      <hr />
      {allResponses.map((formattedResponse, index) => (
        <div key={index} className='formattedResponse'>
          <p>{formattedResponse}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};
