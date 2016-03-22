import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  users: 'live.connectedUsers',
  controllingUser: 'live.controllingUser'
})
class LiveUsers extends React.Component {
  constructor(props) {
    super(props);
    this.renderUser = this.renderUser.bind(this);
  }
  renderUser(userName, index) {
    const isActive = userName === this.props.controllingUser || (!this.props.controllingUser && index === 0);
    return (
      <div
        key={index}
        className={isActive ? styles.activeUser : styles.user}
        onClick={() => this.props.signals.live.userClicked({name: userName})}>
        {userName}
      </div>
    );
  }
  render() {
    return (
      <div className={styles.wrapper}>
        {['You', ...this.props.users].map(this.renderUser)}
      </div>
    );
  }
}

 export default LiveUsers;
