import PopupWithForm from "./PopupWithForm.js";
import React from "react";

function AddPlacePopup(props) {

    const [place, setPlace] = React.useState('');
    const [link, setLink] = React.useState('');

    function handleLinkChange(e) {
        setLink(e.target.value);
      }
    
      function handlePlaceChange(e) {
        setPlace(e.target.value);
      }

      function handleSubmit(e) {
        e.preventDefault();
        props.setLoadingStatus(true);
        props.onAddCard({place: place,
                         link: link
      });
    }
    //сдаюсь с разбегу не придумаю пока как очистить :(

    // const placeRef = React.useRef();
    // const linkRef = React.useRef();

    // function handleSubmit(e) {
    //     e.preventDefault();
    //     props.setLoadingStatus(true);
    //     props.onAddCard({place: placeRef.current.value,
    //                      link: linkRef.current.value
    //                     });
    // }

    return(
        <PopupWithForm onSubmit={handleSubmit} isOpen={props.isOpen} onClose={props.onClose} buttonText={props.isLoading ? 'Сохранение...' : 'Добавить'} 
                       popupId="photo-add" title="Новое место" formId="load-cards">
            <label htmlFor="place" className="form__label">
                <input onChange={handlePlaceChange} type="text" name="place" id="place" className="form__item" placeholder="Название" required minLength="1" maxLength="30" />
                <span className="form__input-error" id="place-error"></span>
            </label>
            <label htmlFor="photo" className="form__label">
                <input onChange={handleLinkChange} type="url" id="photo" name="link" className="form__item" placeholder="Ссылка на картинку" required/>         
                <span className="form__input-error" id="link-error"></span>
            </label>
        </PopupWithForm>
    )
}

export default AddPlacePopup