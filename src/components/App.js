import React from 'react';
import '../index.css';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import DelCardPopup from './DelCardPopup.js';

function App() {

const [currentUser, setUserData] = React.useState({name: '', about: '', avatar: ''});

React.useEffect(() => {
    api.getUserData()
    .then((res) =>{
        setUserData(res)
    }).catch((err) =>{
        console.log('Ошибка в эфекте стейта юзера: ', err)
    })
}, [])

const [cards, setCards] = React.useState([]);
function handleCardLike(card) {

    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
        const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        setCards(newCards);
    }).catch((err) => {
        console.log(err);
    });
}

React.useEffect(() => {
    api.getInitialCards()
    .then((res) => {
        setCards(res)
    }).catch((err) => {
        console.log('Ошибка в получении карточек', err)
    })
}, [])

const [delCard, setDelCard] = React.useState(null);

function handleCardDelete() {
    api.delCard(delCard._id).then(() => {
        const newCards = cards.filter((c) => c._id !== delCard._id);
        setCards(newCards);
        closeAllPopups()
    }).catch((err) => {
        console.log(err);
    })
}

function handleUpdateUser(userData) {
    api.patchUserData(userData)
    .then((res) => {
        setUserData(res);
        closeAllPopups()
    }).catch((err) => {
        console.log('Ошибка в хандле апдейт юзер', err)
    })
}

function handleUpdateAvatar(userData) {
    api.patchUserAvatar(userData)
    .then((res) => {
        setUserData(res);
        closeAllPopups();
    }).catch((err) => {
        console.log('Ошибка в хандле апдейт аватарки', err)
    })
}

function handleAddPlaceSubmit(userCardData) {
    api.addUserCard(userCardData)
    .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups()
    }).catch((err) => {
        console.log('Ошибка в добавлении карточки на сервер', err)
    })
}

const [popupLoading, setPopupLoading] = React.useState(false);

//из предыдущего спринта:
const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
}

const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
}

const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
}

const [isDelPopupOpen, setIsDelPopupOpen] = React.useState(false);
function handleDelClick(card) {
    setIsDelPopupOpen(true)
    setDelCard(card)
}


const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
const [selectedCard, setSelectedCard] = React.useState({});
function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
}

function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsImagePopupOpen(false)
    setIsDelPopupOpen(false)
    setPopupLoading(false);
}

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="page__content">
            <Header />
            <Main cards={cards} onCardLike={handleCardLike} onDeleteCard={handleDelClick}
                  onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} 
                  onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick} />
            <Footer />

            <EditProfilePopup inputText={currentUser} onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} 
                              onClose={closeAllPopups} 
                              isLoading={popupLoading} setLoadingStatus={setPopupLoading} />
            
            <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                             isLoading={popupLoading} setLoadingStatus={setPopupLoading} />
            
            <AddPlacePopup onAddCard={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} 
                           isLoading={popupLoading} setLoadingStatus={setPopupLoading}/>
            
            <DelCardPopup onDeleteCard={handleCardDelete} isOpen={isDelPopupOpen} onClose={closeAllPopups} 
                          isLoading={popupLoading} setLoadingStatus={setPopupLoading}/>
            
            <ImagePopup isOpen={isImagePopupOpen} card={selectedCard} onClose={closeAllPopups}/>
        </div>
    </CurrentUserContext.Provider>
  );
}

export default App;