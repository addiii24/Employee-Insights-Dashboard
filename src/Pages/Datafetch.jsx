import React from 'react'
import Header from '../Others/Header.jsx'

const Datafetch = (props) => {
  return (
    <div>
      <Header Changeuser= {props.Changeuser } data={props.data}/>
    </div>
  )
}

export default Datafetch;