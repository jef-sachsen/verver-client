import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { I18nextProvider } from "react-i18next";

/**
 * Look here for more information on ConnectedRouter
 * (can be easily confused with the old react-router-redux)...
 * https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
 */
import { ConnectedRouter } from "react-router-redux";
import { Route } from "react-router";

import { changeLanguage, i18n } from "./i18n";
import configureStore from "./redux/createStore";

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import Login from "./components/Login";
import UserList from "./components/UserList";
import UserCreateScreen from "./components/UserCreateScreen";
import RoleCreateScreen from "./components/RoleCreateScreen";
import LandingPage from "./components/LandingPage";
import GroupCreateScreen from "./components/GroupCreateScreen";
import RoleList from "./components/RoleList";
import GroupList from "./components/GroupList";
import { ContactListScreen, ContactDetailScreen } from "./components/contact";

const { store, history, persistor } = configureStore();
const theme = createMuiTheme({
  custom: {
    drawer: {
      width: 240,
      closedWidth: 90
    }
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    //Use a fixed language in development for now
    if (process.env.NODE_ENV === "development") {
      changeLanguage("en");
      //console.log(i18n);
    }
  }

  render() {
    return (
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <MuiThemeProvider theme={theme}>
              <ConnectedRouter history={history}>
                <div>
                  <Route exact path="/" component={LandingPage} />
                  <Route exact path="/login" component={Login} />
                  <Route
                    exact
                    path="/contact/list"
                    component={ContactListScreen}
                  />
                  <Route
                    exact
                    path="/contact/:id/edit"
                    component={ContactDetailScreen}
                  />
                  <Route
                    exact
                    path="/contact/:id/detail"
                    component={ContactDetailScreen}
                  />
                  <Route
                    exact
                    path="/contact/create"
                    component={ContactDetailScreen}
                  />
                  <Route exact path="/user/list" component={UserList} />
                  <Route
                    exact
                    path="/user/edit/:id"
                    component={UserCreateScreen}
                  />
                  <Route
                    exact
                    path="/user/create"
                    component={UserCreateScreen}
                  />
                  <Route exact path="/profile" component={UserCreateScreen} />
                  <Route exact path="/role/list" component={RoleList} />
                  <Route
                    exact
                    path="/role/edit/:id"
                    component={RoleCreateScreen}
                  />
                  <Route
                    exact
                    path="/role/create"
                    component={RoleCreateScreen}
                  />
                  <Route exact path="/group/list" component={GroupList} />
                  <Route
                    exact
                    path="/group/edit/:id"
                    component={GroupCreateScreen}
                  />
                  <Route
                    exact
                    path="/group/create"
                    component={GroupCreateScreen}
                  />
                </div>
              </ConnectedRouter>
            </MuiThemeProvider>
          </I18nextProvider>
        </Provider>
      </PersistGate>
    );
  }
}

export default App;
