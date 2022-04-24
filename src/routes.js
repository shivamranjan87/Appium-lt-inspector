import React, { Suspense } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import App from './containers/App';
// import SessionPage from './containers/SessionPage';
import InspectorPage from './containers/InspectorPage';
import Spinner from './gui-common/components/Spinner/Spinner';
import Inspector from './components/Inspector/Inspector';
import { useSearchParams } from 'react-router-dom';

// import { ipcRenderer } from './polyfills';
//import i18n from './configs/i18next.config.renderer';

// ipcRenderer.on('appium-language-changed', (event, message) => {
//   if (i18n.language !== message.language) {
//     i18n.changeLanguage(message.language);
//   }
// });

export default () => (
  <Suspense fallback={<Spinner />}>
    <Router>
    <App>
      <Switch>
        <Route path="/:id/:cord" component={InspectorPage} exact />
        <Route component={() => <div>Test ID not valid{console.log("path",window.location.pathname)}</div>} />
        {/* <Route path="/" component={InspectorPage} />  */}
      </Switch>
    </App>
    </Router>
  </Suspense>
);
