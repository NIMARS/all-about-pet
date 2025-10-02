export function setToken(token) {
    try { localStorage.setItem('token', token) } catch { /* ssr / privacy */ }
}
export function getToken() {
    try { return localStorage.getItem('token') } catch { return null }
}
export function removeToken() {
    try { localStorage.removeItem('token') } catch { }
}
export function setUser(user) {
    try { localStorage.setItem('user', JSON.stringify(user)) } catch { }
}
export function getUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
}
export function removeUser() {
    try { localStorage.removeItem('user') } catch { }
}
