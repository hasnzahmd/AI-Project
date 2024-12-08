import React from 'react'
import Generating from '../images/generating.gif'
function Loader({ className, spninnerClassName, variant }) {
  return (
    <div className={className}>
      { variant === "small" ? (
        <img className={`small-spinner animate-spin ${spninnerClassName}`} src={Generating} alt="Loading icon" loading='eager' ></img>
      ): (
        <img className={`large-spinner animate-spin ${spninnerClassName}`} src={Generating} alt="Loading icon" loading='eager' ></img>
      )}
    </div>
  )
}

export default Loader
