export const BASE_URL = 'https://auth.nomoreparties.co';

//тут минус - я не узнаю в каком апи появилась ошибка,
//если мы вызываем не функцией, то соответственно не передаем параметры и не могу передать уникальный текст ошибки.
//если подскажете как добавить текста в ошибку буду благодарен
function _checkResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка в авторизации ${res.status}`);
};

export function register({ email, password }) {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
    })
    .then(_checkResponse); //это не класс и при вызове this не нужно использовать
};

export const login = ({ email, password }) => fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
    })
    .then(_checkResponse)
    .then((data) => {
        if(data != null) {
            localStorage.setItem('token', data.token);
        }
        return data;
    })

export const tokenValid = (token) => fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
})
    .then(_checkResponse)
    .then((res) => res);