import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  introductionVideoEmbedUrl: 'bin.introductionVideoEmbedUrl'
})
class Welcome extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <h1>Welcome to WebpackBin</h1>
          <div className={styles.button} onClick={() => this.props.signals.bin.welcomeBinClicked()}>
            Load the welcome BIN
          </div>
        </div>
        <div className={styles.column}>
          <iframe width="250" height="147" src={this.props.introductionVideoEmbedUrl} frameBorder="0" allowFullScreen></iframe>
        </div>
      </div>
    );
  }
}

 export default Welcome;
