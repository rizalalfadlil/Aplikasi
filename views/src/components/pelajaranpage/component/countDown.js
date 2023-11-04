// countdownUtils.js
export function calculateCountdown(deadline) {
    const now = Date.now();
    const difference = deadline - now;
  
    if (difference <= 0) {
      return '00:00:00'; // Waktu telah berakhir
    }
  
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
  
    const formattedCountdown = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    return formattedCountdown;
  }
  