import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  userName: 'live.userName',
  controllingUser: 'live.controllingUser'
})
class LiveUser extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div
          className={this.props.controllingUser === this.props.userName ? styles.activeUser : styles.user}>
            {this.props.userName}
        </div>
      </div>
    );
  }
}

 export default LiveUser;
