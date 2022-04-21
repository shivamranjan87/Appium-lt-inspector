import i18n from 'i18next';
import { i18NextBackend, i18NextBackendOptions } from '../renderer/polyfills';
import config from './app.config';
import settings from '../shared/settings';
import { getI18NextOptions } from '../../gui-common/configs/app.config.default';

const i18nextOptions = getI18NextOptions(settings, config, i18NextBackendOptions);

console.log("i18nextOptions",i18nextOptions)


if (!i18n.isInitialized) {
  console.log("i18n initialize")
  i18n
    .use(i18NextBackend)
    .init(i18nextOptions);
}

export default i18n;
