import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import JiraBacklog from './pages/JiraBacklog';
import SPAWorkflow from './pages/SPAWorkflow';
import More from './pages/More';

function App() {
  return (
    <Router>
      
      <div className="App">
        <header className="App-header">
          <nav className="App-menu">
            <ul style={{ display: 'flex', listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              <li style={{ margin: '0 1rem' }}><NavLink className="App-link" to="/jira-backlog">Jira backlog</NavLink></li>
              <li style={{ margin: '0 1rem' }}><NavLink className="App-link" to="/spa-workflow">SPA workflow</NavLink></li>
              <li style={{ margin: '0 1rem' }}><NavLink className="App-link" to="/more">Weather App</NavLink></li>
            </ul>
          </nav> 
        </header> 
        <h1>Demo for Opswat.com</h1>  
        
        <Routes>
          <Route path="/jira-backlog" element={<JiraBacklog />} />
          <Route path="/spa-workflow" element={<SPAWorkflow />} />
          <Route path="/more" element={<More />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
