import React, { useState } from 'react';

export const SelectFitFun = ({ selFitfuns, setSelFitfuns, fitfuns = [] }) => {

  const [tmpFitfun, setTmpFitfun] = useState()
  const [tmpDim, setTmpDim] = useState('')

  function handleSubmit(e) {
    e.preventDefault();
    setTmpDim('');
    setTmpFitfun('');
  }

  function handleChooseFitfun() {
    if (tmpFitfun !== 'default' && !selFitfuns.find(i => i.name === tmpFitfun)) {
      const newDomain = tmpDim;
  
      setSelFitfuns([
        ...selFitfuns,
        {
          name: tmpFitfun,
          domain: newDomain,
        },
      ]);
    }
  }

  return (
    <div id='selectFitFun' className='section'>
      <p className='sectionTitle'>Wybierz Funkcje Celu</p>
      <hr />
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='selectFitFunInput' className=''>
              Funkcja:
            </label>
            <select
              id='selectFitFunInput'
              defaultValue={'default'}
              value={tmpFitfun}
              onChange={e => setTmpFitfun(e.target.value)}
            >
              <option value='default' hidden>
                Wybierz funkcje celu
              </option>
              {fitfuns.length !== 0 &&
                fitfuns.map(f => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor='chooseDomain' className=''>
              Wymiar:
            </label>
            <input
              id='chooseDomain'
              type='text'
              placeholder='[[x1,y1, ...], [x2, y2, ...]]'
              value={tmpDim}
              onChange={e => setTmpDim(e.target.value)}
            />
          </div>
          <input
            id='selectFitfunButton'
            disabled={!tmpDim || !tmpFitfun}
            className=''
            type='submit'
            value='+'
            onClick={handleChooseFitfun}
          />
        </form>
        <ol id='choosenFitfuns'>
          {selFitfuns.length !== 0 &&
            selFitfuns.map(f => <li key={f.name}>{f.name}:{f.domain}</li>)}
        </ol>
      </div>
    </div>
  );
};
