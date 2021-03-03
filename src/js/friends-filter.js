import VkApi from './vk-api';
import Friends from './friends';

export default class FriendsFilter {
  constructor() {
    this.VkApi = new VkApi();

    this.init();
  }

  async init() {
    await this.VkApi.init();
    this.setTitle();

    let friends = await this.VkApi.getFriends();
    let bestFriends = this.getData();

    if (bestFriends.length > 0) {
      friends = friends.filter(friend => bestFriends.filter(best => friend.id === best.id).length === 0);
    }

    this.friendsContainer = new Friends('friends', friends);
    this.bestFriendsContainer = new Friends('best-friends', bestFriends);

    this.addListeners();
  }

  async setTitle() {
    const me = await this.VkApi.getCurrentUserGen();

    let title = document.querySelector('.header__title');
    title.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;
  }

  addListeners() {
    this.friendsInput = document.querySelector('.friends__input');
    this.bestFriendsInput = document.querySelector('.best-friends__input');

    this.friendsInput.addEventListener('keyup', this.friendsInputHandler.bind(this));
    this.bestFriendsInput.addEventListener('keyup', this.bestFriendsInputHandler.bind(this));

    document.addEventListener('click', this.moveClick.bind(this));
    document.addEventListener('dragstart', (e) => e.dataTransfer.setData('text', e.target.id));
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', this.drop.bind(this));
    window.addEventListener('beforeunload', this.setBestFriendsToStorage.bind(this));
  }

  drop(e) {
    e.preventDefault();

    const { target } = e;

    if (this.getItemByClassName(target, 'friends__container')) {
      const id = e.dataTransfer.getData("text");
      const item = document.getElementById(id);

      if (this.contains(item, 'friends') === this.contains(target, 'friends')) {
        return;
      }

      this.move(item.querySelector('.to-other-list'), id);
    }
  }

  moveClick(e) {
    const { target } = e;

    if (target.classList.contains('to-other-list')) {
      const parent = this.getItemByClassName(target, 'friend');

      this.move(target, parent.id);
    }
  }

  move(item, id) {
    if (item.classList.contains('to-best-friends')) {
      const finded = this.friendsContainer.findById(id);
      this.bestFriendsContainer.addItem(finded);
      this.friendsContainer.addToOther('best-friends', id);

      if (this.bestFriendsInput.value !== '') {
        this.bestFriendsContainer.filterFriends(this.bestFriendsInput.value);
      }
    } else if (item.classList.contains('to-friends')) {
      const finded = this.bestFriendsContainer.findById(id);
      this.friendsContainer.addItem(finded);
      this.bestFriendsContainer.addToOther('friends', id);

      if (this.friendsInput.value !== '') {
        this.friendsContainer.filterFriends(this.friendsInput.value);
      }
    }
  }

  getItemByClassName(from, name) {
    do {
      if (from.classList.contains(name)) {
        return from;
      }
    } while (from = from.parentElement);

    return null;
  }

  contains(item, name) {
    const parent = this.getItemByClassName(item, 'area-friends');

    return parent.classList.contains(name);
  }

  getData() {
    if (!localStorage.getItem('best-friends')) {
      this.createStorage();
    }

    return JSON.parse(localStorage.getItem('best-friends'));
  }

  setData(newData) {
    localStorage.setItem('best-friends', JSON.stringify(newData));
  }

  createStorage() {
    localStorage.setItem('best-friends', '[]');
  }

  setBestFriendsToStorage() {
    this.setData(this.bestFriendsContainer.getItems());
  }

  friendsInputHandler(e) {
    this.friendsContainer.filterFriends(e.target.value);
  }

  bestFriendsInputHandler(e) {
    this.bestFriendsContainer.filterFriends(e.target.value);
  }
}