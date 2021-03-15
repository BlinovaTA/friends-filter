export default class VkApi {

  async init() {
    await this.injectScript();

    VK.init({ apiId: 7775449 });

    await this.auth();
  }

  injectScript() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://vk.com/js/api/openapi.js?168';
      document.body.appendChild(script);
      script.addEventListener('load', resolve);
    });
  }

  auth() {
    return new Promise((resolve, reject) => {
      VK.Auth.login(data => {
        if (data.session) {
          resolve();
        } else {
          reject(new Error('Не удалось авторизоваться'));
        }
      }, 2);
    });
  }

  callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.response);
        }
      });
    });
  }

  async getCurrentUserGen() {
    const [me] = await this.callAPI('users.get', { name_case: 'gen' });

    return me;
  }

  async getFriends() {
    const friends = await this.callAPI('friends.get', { fields: 'city, country, photo_100' });

    return friends.items;
  }
}