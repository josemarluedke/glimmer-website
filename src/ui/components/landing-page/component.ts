import Component from '@glimmer/component';

export default class LandingPage extends Component {
  didInsertElement() {
    document.body.classList.add('index');
  }
};
