import { BASE_API_URL, API_KEY } from './api';

class Session {
  getTokenGuestSession = async () => {
    const url = `${BASE_API_URL}/authentication/guest_session/new?api_key=${API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Ошибка при получении токена с сервера: ${error}`);
    }
  };

  saveTokenInSessionStorage = (token) => {
    sessionStorage.setItem('TokenGuestSession', JSON.stringify(token));
  };

  getTokenFromSessionStorage = () => {
    try {
      return JSON.parse(sessionStorage.getItem('TokenGuestSession'));
    } catch (error) {
      return null;
    }
  };

  initTokenGuestSession = async () => {
    let token = this.getTokenFromSessionStorage();

    if (!token) {
      token = await this.getTokenGuestSession();
    }

    const currentTime = new Date();
    const tokenExpiresAt = new Date(token.expires_at);

    if (currentTime > tokenExpiresAt) {
      token = await this.getTokenGuestSession();
    }

    this.saveTokenInSessionStorage(token);
    return token;
  };
}

const SessionService = new Session();

export { SessionService };
