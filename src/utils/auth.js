export const BASE_URL = 'https://auth.nomoreparties.co';

export function register({ email, password }) {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка в фунции апи регистрации (ауф.жс): ${res.status}`)
    })
}

export const login = ({ email, password }) => fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка в фунции апи логина (ауф.жс): ${res.status}`)
    })
    .then((data) => {
        console.log(data);
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
    .then((res) => {
        if(res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка в фунции апи токена (ауф.жс): ${res.status}`);
    })
    .then((res) => res);