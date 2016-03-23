import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  isInitialized: 'bin.isInitialized',
  currentBin: 'bin.currentBin',
  introductionVideoEmbedUrl: 'bin.introductionVideoEmbedUrl'
})
class Bin extends React.Component {
  componentDidMount() {
    if (this.props.isInitialized) {
      document.querySelector('#loader').style.display = 'none';
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isInitialized && this.props.isInitialized) {
      document.querySelector('#loader').style.display = 'none';
    }
  }
  renderBinOpened() {
    return (
      <div>
        <h3>To look at the BIN you need to flip your phone into landscape</h3>
      </div>
    );
  }
  renderWelcome() {
    return (
      <div>
        <h3>To start using WebpackBin you need to flip your phone into landscape</h3>
        <div>
          <iframe width="250" height="147" src={this.props.introductionVideoEmbedUrl} frameBorder="0" allowFullScreen></iframe>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <h1>Welcome to WebpackBin</h1>
        {
          this.props.currentBin.id ?
            this.renderBinOpened()
          :
            this.renderWelcome()
        }
      </div>
    );
  }
}

 export default Bin;
