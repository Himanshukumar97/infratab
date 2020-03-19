import React from 'react';
import logo from './logo.svg';
import BankDetails from './BankDetails/BankHome'
import innerBankDetails from './BankDetails/innerBankDetails'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">



        <BrowserRouter>
          <Switch>
            <Route path={`/`} exact component={BankDetails} />
            <Route path={`/bank/:index/:bankID`} exact component={innerBankDetails} />

          </Switch>
        </BrowserRouter>

      </header>
    </div>
  );
}

export default App;
