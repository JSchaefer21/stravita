import { validateJwt, validatePassword } from 'validators'
import Apicaller from 'apicaller'

function updateUserPassword(token, password, newPassword, newPasswordRepeat) {
    validateJwt(token)
    validatePassword(password)
    validatePassword(newPassword, 'new password')
    validatePassword(newPasswordRepeat, 'new password repeat')

    if (password === newPassword)
        throw new Error('current password and new password are the same')
    if (newPassword !== newPasswordRepeat) 
        throw new Error('new password and new password repeat are not the same')


    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => {
        const result = await api.patch('/users', {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify({ password: newPassword })})

            const { status, payload } = result

            if (status >= 400 && status < 500) { 
                const data = JSON.parse(payload)
                throw new Error(data.error) 
            } 
            else if (status >= 500) {
                throw new Error('server error')
            }
            else if (status === 204) {
                return
            }
    })()
}

export default updateUserPassword