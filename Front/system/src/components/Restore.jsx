import React from 'react'

export const Restore = ({
  restorePoints = [{ name: 'test1' }, { name: 'test2' }],
}) => {
  return (
    <div id='sectionRestore' className='section section-disabled'>
      <p className='sectionTitle'>Przywróć</p>
      <hr />

      <select defaultValue={'default'}>
        <option value={'default'} hidden>
          Wybierz punkt przywracania
        </option>
        {restorePoints != [] ? (
          restorePoints.map(rp => {
            return <option value={rp.name}>{rp.name}</option>
          })
        ) : (
          <option value={'none'} disabled>
            Brak plików do przywrócenia
          </option>
        )}
      </select>
    </div>
  )
}
