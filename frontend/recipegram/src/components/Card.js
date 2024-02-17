import React from 'react';
import './Card.css';

export default function Card({title, backImg}) {
  return (
    <div className='cardR' style={{'backgroundImage': ` linear-gradient(rgba(0, 0, 0, 0) 60%,rgba(0, 0, 0, 0.8) ), URL(${backImg})`}}><h4 className='cardText'>{title}</h4></div>
  )
}
