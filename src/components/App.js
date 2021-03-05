import React from 'react';
import { Redirect, Switch, Route, useHistory } from 'react-router-dom';
import Main from './Main.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import DelCardPopup from './DelCardPopup.js';
import ProtectedRoute from './ProtectedRoute.js';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip.js';
import Header from './Header.js';
import * as auth from '../utils/auth.js';

function App() {

const [currentUser, setUserData] = React.useState({name: '', about: '', avatar: '', email: ''});

const history = useHistory();

function getInitialData(email) {
    setLoggedIn(true);
    return Promise.all([api.getInitialCards(), api.getUserData()])
        .then(([resp, response]) => {
            setUserData({ ...response, email});
            setCards(resp)
        })
}

//validnost' tokena
React.useEffect(() => {
    const token = localStorage.getItem('token');
    if(token !== null) {
        auth.tokenValid(token)
        .then((res) => {
            if(res) {
                getInitialData(res.data.email);
            } else {
                setLoggedIn(false)
            }
        }).catch((err) => {
            console.log('Ошибка в эфекте "валидации" токена',err);
        })
    }
}, []);

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

// React.useEffect(() => {
//     api.getInitialCards()
//     .then((res) => {
//         setCards(res)
//     }).catch((err) => {
//         console.log('Ошибка в получении карточек', err)
//     })
// }, [])

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
    setIsInfoToolOpen(false);
}

const [isInfoToolOpen, setIsInfoToolOpen] = React.useState(false);

const [isRegisterSuccess, setIsRegisterSuccess] = React.useState(true);
function handleRegister(registerData) {
    auth.register(registerData)
    .then((res) => { 
        if (res !== null) {
            setIsRegisterSuccess(true);
            setIsInfoToolOpen(true);
            history.push('/sign-in');
        }})
    .catch((err) => {
        console.log('Ошибка в регистрации handleRegister', err);
        setIsRegisterSuccess(false);
        setIsInfoToolOpen(true);
    })
}

function handleLogin(loginData) {
    auth.login(loginData)
    .then((res) => {
        if(res !== null) {
            getInitialData(loginData.email)
            .catch((err) => {
                console.log('получение емейла handleLogin getInitialdata', err)})
        }
    }).catch((err) =>{
        console.log('handllogin eror', err);
        setIsRegisterSuccess(false);
        setIsInfoToolOpen(true);
    });
}

const [loggedIn, setLoggedIn] = React.useState(false);
function handleLogout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    currentUser.email = null;
}

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="page__content">
            <Switch>
                <Route path={'/sign-up'}>
                    {loggedIn ? <Redirect to="./" /> : <>
                                                        <Header link={'sign-in'} text={'Войти'} />
                                                        <Register onInfoTool={handleRegister}/>
                                                       </>}
                </Route>

                <Route path={'/sign-in'}>
                    {loggedIn ? <Redirect to="./" /> : <>
                                                        <Header link={'sign-up'} text={'Регистрация'} />
                                                        <Login onInfoTool={handleLogin}/>
                                                       </>}
                </Route>

                <ProtectedRoute component={Main} path={'/'} cards={cards} onCardLike={handleCardLike} onDeleteCard={handleDelClick}
                                onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} 
                                onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick}
                                onLogout={handleLogout} isLoggedIn={loggedIn}>
                

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
                </ProtectedRoute>
            </Switch>
            <InfoTooltip isSuccess={isRegisterSuccess} isOpen={isInfoToolOpen} onClose={closeAllPopups} />
        </div>
    </CurrentUserContext.Provider>
  );
}

export default App;