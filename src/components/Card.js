import React from 'react';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Card(props) {

    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = props.card.owner._id === currentUser._id;
    const cardDeleteButtonClassName = (
        `card__delete ${!isOwn ? 'card__delete_hidden' : ''}`
    );
    const isLiked = props.card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = (
        `card__like ${isLiked ? 'card__like_active' : ''}`
    );

    function handleLikeClick() {
        props.onCardLike(props.card)
    }

    function handleDeleteClick() {
        props.onDeleteCard(props.card)
    }
//удалил кей и добавил ...забыл как называется...когда в процессе удадения или создания тексты кнопок
    return (
            <li className="card">
                <img className="card__photo" 
                    src={props.card.link} 
                    alt={props.card.text} 
                    onClick={() => {
                        props.onCardClick(props.card);
                    }} />
                <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}/>
                <div className="card__text">
                    <h2 className="card__title">{props.card.name}</h2>
                    <div className="card__like-container">
                        <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
                        <p className="card__like-data">{props.card.likes.length}</p>
                    </div>
                </div>
            </li>
    );
  }
  
export default Card;