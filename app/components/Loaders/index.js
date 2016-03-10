import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

import BabelConfig from './BabelConfig';
import CssConfig from './CssConfig';
import TypescriptConfig from './TypescriptConfig';
import CoffeescriptConfig from './CoffeescriptConfig';
import RawConfig from './RawConfig';
import JsonConfig from './JsonConfig';
import JadeConfig from './JadeConfig';
import HandlebarsConfig from './HandlebarsConfig';

const loaders = {
  babel: BabelConfig,
  css: CssConfig,
  typescript: TypescriptConfig,
  coffeescript: CoffeescriptConfig,
  raw: RawConfig,
  json: JsonConfig,
  jade: JadeConfig,
  handlebars: HandlebarsConfig
};

@Cerebral({
  currentLoaders: 'bin.currentBin.loaders',
  currentLoader: 'bin.currentLoader'
})
class Loaders extends React.Component {
  onLoaderToggle(e, name) {
    e.stopPropagation();
    this.props.signals.bin.loaderToggled({name});
  }
  onLoaderClick(name) {
    this.props.signals.bin.loaderClicked({name});
  }
  render() {
    const CurrentConfig = loaders[this.props.currentLoader];
    const {currentLoader, currentLoaders} = this.props;

    return (
      <div className={styles.wrapper}>
        <div className={styles.loadersList}>
          {Object.keys(loaders).map((loaderName, index) => {
            return (
              <div
                key={index}
                className={currentLoader === loaderName ? styles.activeLoader : styles.loader}
                onClick={() => this.onLoaderClick(loaderName)}>
                <input
                  type="checkbox"
                  onChange={(e) => this.onLoaderToggle(e, loaderName)}
                  checked={loaderName in currentLoaders}/>
                {loaderName}
              </div>
            );
          })}
        </div>
        <div className={styles.loaderConfig}>
          <CurrentConfig/>
        </div>
      </div>
    );
  }
}

 export default Loaders;
