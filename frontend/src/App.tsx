import React from 'react';
import logo from './logo.svg';
import './App.css';
import SanctionsScreeningForm from './components/SanctionsScreeningForm';

function App() {
  return (
    <main className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <SanctionsScreeningForm />
      </header>
    </main>
  );
}

export default App;
