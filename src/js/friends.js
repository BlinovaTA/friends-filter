import Handlebars from 'handlebars';
import friends from '../templates/friends.hbs';

export default class Friends {
  constructor(type, items) {
    this.items = items;
    this.type = type;

    this.renderFriends(items);
  }

  init() {
    let root = document.querySelector(`.${this.type}`);
    let items = root.querySelectorAll('.to-other-list');

    items.forEach(item => {
      item.classList.add(`to-${this.type === 'friends' ? 'best-friends' : 'friends'}`);
      item.src = `./src/img/${this.type}.svg`;
    });
  }

  renderFriends(items) {
    const render = Handlebars.compile(friends);
    const html = render({ items });
    const results = document.querySelector(`.${this.type}__container`);
    results.innerHTML = html;

    this.init();
  }

  filterFriends(value) {
    const lowerCaseValue = value.toLowerCase();

    let filteredFriends;

    filteredFriends = this.items.filter(item => item.first_name.toLowerCase().indexOf(lowerCaseValue) >= 0
      || item.last_name.toLowerCase().indexOf(lowerCaseValue) >= 0
    );

    if (filteredFriends) {
      this.renderFriends(filteredFriends);
    }
  }

  addItem(item) {
    this.items.push(item);
  }

  getItems() {
    return this.items;
  }

  setItems(items) {
    this.items = items;
  }

  filterById(id) {
    return this.items.filter(item => item.id !== parseInt(id));
  }

  findById(id) {
    return this.items.find(item => item.id === parseInt(id));
  }

  addToOther(to, id) {
    const filtered = this.filterById(id);
    this.setItems(filtered);

    let friendsTo = document.querySelector(`.${to}`);
    let friendsList = friendsTo.querySelector('.friends-list');

    let item = document.getElementById(id);
    let itemButton = item.querySelector(`.to-${to}`);
    itemButton.classList.toggle('to-friends');
    itemButton.classList.toggle('to-best-friends');
    itemButton.src = `./src/img/${to}.svg`;

    friendsList.append(item);
  }
}