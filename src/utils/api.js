export class Api {
    constructor(options) {
        this._headers = options.headers;
        this._baseUrl = options.baseUrl;
    }

    _fetch(url, method, body) {
        return fetch(this._baseUrl + url, {
            method: method,
            headers: this._headers,
            body: body
        })
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибочка вышла: ${res.status}`);
        });
    }

    //далее идут методы которые подставляюся в выше написанный метод
    //получить список карточек
    getInitialCards() {
        return this._fetch('/cards', 'GET')
    }

    //добавить карточку
    addUserCard(values) {
        return this._fetch('/cards', 'POST', JSON.stringify({
            name: values.place,
            link: values.link
        }))
    }

    //поставить лайк
    takeCardLike(cardId) {
        return this._fetch(`/cards/likes/${cardId}`, 'PUT')
    }

    //удалить лайк
    removeCardLike(cardId) {
        return this._fetch(`/cards/likes/${cardId}`, 'DELETE')
    }

    changeLikeCardStatus(cardId, isLiked) {
        if(isLiked) {
            return this.takeCardLike(cardId)
        } else {
            return this.removeCardLike(cardId)
        }
    }

    //удалить карточку
    delCard(cardId) {
        return this._fetch(`/cards/${cardId}`, 'DELETE')
    }

    //получить имя и професию с сервака
    getUserData() {
        return this._fetch('/users/me', 'GET')
    }

    //изменить имя и професию на серваке
    patchUserData(values) {
        return this._fetch('/users/me', 'PATCH', JSON.stringify({
            name: values.name,
            about: values.about
        }))
    }

    // изменить аватарку на серваке
    patchUserAvatar(values) {
        return this._fetch('/users/me/avatar', 'PATCH', JSON.stringify({
            avatar: values.avatar
        }))
    }
}

//база для поключения к WebAPI и использование класса
const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-19',
    headers: {
        authorization: '047d2b93-9a25-4779-80e5-3e6df788b9a7',
        'Content-Type': 'application/json'
    }
})

export default api