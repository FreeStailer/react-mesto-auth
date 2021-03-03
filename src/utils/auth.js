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
        return Promise.reject(`Ошибка в фунции регистрации(ауф.жс): ${res.status}`)
    })
}

export const logIn = ({ email, password }) => {}