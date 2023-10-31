export function showNotification(message, type){
    localStorage.setItem('notification', JSON.stringify({message:message, type:type}))
}