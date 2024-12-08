import React from 'react'
import DownArrow from '../../images/chevron-down.png'

function capitalize(string) {
  const words = string.trim().split(' ')
  return words.map((word) => !!word ? (word[0].toUpperCase() + word.substring(1)) : '').join(' ')
}

function DropDown({ options, handleOnChange, label, selectedValue, defaultValue }) {
  return (
    <div className={`relative flex flex-col text-sm ${label ? "gap-1" : "h-[42px]"} w-full`}>
      {label && (
        <label className="font-medium text-[14px]">{label}</label>
      )}
      <select required style={{ textIndent: '13px', appearance: 'none' }} onChange={(e) => { handleOnChange(e.target.value) }}
        className='inputFieldShadow py-2.5 border-[1px] border-[#E2E4E9] text-[14px] hover:border-[#CED0D5] text-[#525866] px-[0.15rem] rounded-[10px] w-full bg-transparent flex outline-none '
        value={selectedValue}
        defaultValue={defaultValue}
      >
        <option  className='text-[14px] font-SuisseIntlLight font-normal' disabled value={"select_template"}>{'Select template'}</option>
        {options?.map((item, index) => {
          return (
            <option key={index} className='text-[14px] font-SuisseIntlLight font-normal' value={item.value}>{capitalize(item.name)}</option>
          )
        })}
      </select>
      <img className='absolute top-[38px] right-0 mr-[14px]' width={'16px'} height={'16px'} src={DownArrow} alt='Arrow not found' />
    </div>
  )
}

export default DropDown
