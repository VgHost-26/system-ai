import React, { useEffect, useState } from 'react'



export const SelectAlgo = ({
  selAlgo,
  setSelAlgo,
  params,
  setParams,
  algos = [],
  showNotification,
  testModeEnum,
  testMode,
  setTestMode,
  selAlgoList = [],
  setSelAlgoList,
}) => {
  const testModeOptions = [
    { value: testModeEnum.SINGLE_ALGORITHM, label: 'Pojedynczy algorytm' },
    { value: testModeEnum.MULTIPLE_ALGORITHMS, label: 'Wiele algorytmów' },
  ];

  const [tmpSteps, setTmpSteps] = useState('');

  useEffect(() => {
    if (selAlgo) {
      setParams(
        selAlgo.params.map((p) => ({
          name: p.name,
          value: p.lowerBound,
        }))
      );
    }
  }, [selAlgo]);

  useEffect(() => {
    // Clear selected algos when test mode changes
    handleClearAlgos();
    handleClear();
  }, [testMode]);

  
  function handleClearAlgos() {
    setSelAlgoList([]);
  }

  function handleClear() {
    setTmpSteps('');
  }

  const handleSelect = (e) => {
    setSelAlgo(algos.find((i) => i.name === e.target.value));
  }

  const updateParam = (name, newVal) => {
    setParams(
      params.map((p) =>
        p.name === name
          ? { name: name, value: newVal }
          : { name: p.name, value: p.value }
      )
    );
  }

  const handleAddToAlgoList = () => {
    const newSteps = generateSteps();
    if (newSteps != null) {
      setSelAlgoList([...selAlgoList, {
        name: selAlgo.name,
        steps: newSteps,
      },
      ]);
      showNotification('');
    } else {
      showNotification('Invalid input for steps', 'error');
    }
  }

  
  const handleRemoveFromAlgoList = (index) => {
    const updatedAlgoList = [...selAlgoList];
    updatedAlgoList.splice(index, 1);
    setSelAlgoList(updatedAlgoList);
  }

  function parseValues(input) {
    const parsedValues = input.split(',').map((value) => parseFloat(value.trim()));
    return Array.isArray(parsedValues) ? parsedValues : [];
  }

  function generateSteps() {
    const tSteps = parseValues(tmpSteps);
    if (tSteps.length === selAlgo.params.length ) {
      const steps = '[' + tSteps + ']';
      return steps;
    } else {
      return null;
    }
  }

  return (
    <div id='selectAlgorithm' className='section'>
      <p className='sectionTitle'>Wybierz Algorytm</p>
      <hr />
      <div className='wrapper'>
        <div>
          <label htmlFor='selectTestModeInput' className='desc'>
            Tryb testowy:{' '}
          </label>
          <select
            id='selectTestModeInput'
            value={testMode}
            onChange={(e) => setTestMode(e.target.value)}
          >
            {testModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {testMode === testModeEnum.SINGLE_ALGORITHM && (
          <>
            {/* Single Algorithm Section */}
            <div>
              <label htmlFor='selectAlgoInput' className='desc'>
                Algorytm:{' '}
              </label>
              <select
                id='selectAlgoInput'
                defaultValue={'default'}
                value={selAlgo?.name}
                onChange={(e) => handleSelect(e)}
              >
                <option value='default' hidden>
                  Wybierz algorytm
                  </option>
                  {algos != [] ? (
                    algos.map(a => {
                      return <option value={a.name}>{a.name}</option>
                    })
                  ) : (
                  <option disabled>Najpierw dodaj algorytm</option>
                )}
              </select>
            </div>
            <div>
              <p className='desc'>Parametry:</p>
              <div id='parameters'>
                {selAlgo && params ? (
                  selAlgo.params.map((p) => (
                    <label key={p.name} title={p.description}>
                      {p.name}
                      <input
                        type='number'
                        min={p.lowerBoundary || 0}
                        max={p.upperBoundary || 10}
                        step={p.step || 1}
                        onChange={(e) => updateParam(p.name, e.target.value)}
                      />
                    </label>
                  ))
                ) : (
                  <>-</>
                )}
              </div>
            </div>
          </>
        )}

        {testMode === testModeEnum.MULTIPLE_ALGORITHMS && (
          // Multiple Algorithms Section
          <>
            <div>
              <label htmlFor='selectAlgoInput' className='desc'>
                Algorytm:{' '}
              </label>
              <select
                id='selectAlgoInput'
                defaultValue={'default'}
                value={selAlgo?.name}
                onChange={(e) => handleSelect(e)}
              >
                <option value='default' hidden>
                  Wybierz algorytm
                  </option>
                  {algos != [] ? (
                    algos.map(a => {
                      return <option value={a.name}>{a.name}</option>
                    })
                    ) : (
                  <option disabled>Najpierw dodaj algorytm</option>
                )}
              </select>
            </div>
            <label htmlFor='chooseMin' className=''>
                Steps:
                <input
                  id='chooseSteps'
                  type='text'
                  placeholder='1, 2, 3, ...'
                  value={tmpSteps}
                  onChange={(e) => setTmpSteps(e.target.value)}
                />
              </label>
            {/* Button to add the selected algorithm to the list */}
            <input
            disabled={!selAlgo}
            id='selectFitfunButton'
            className=''
            type='submit'
            value='+'
            onClick={handleAddToAlgoList}
          />
        
        {/* Display selected algorithms with remove button */}
        <div>
          <p className='desc'>Wybrane algorytmy:</p>
          <ul>
            {selAlgoList.length !== 0 &&
              selAlgoList.map((algo, index) => (
                <li key={`${algo.name}-${index}`}>
                  <button
                  className='delete-button'
                  onClick={() => handleRemoveFromAlgoList(index)}
                >
                  X
                </button>
                {algo.name}: {algo.steps}
                </li>
              ))}
          </ul>
        </div>
        </>
        )}
      </div>
    </div>
  );
};