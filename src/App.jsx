
import React from 'react';
import Join from './pages/Join'
import Chat from './pages/Chat'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Provider } from 'react-redux';
import { store } from './store/store';
import CriarUsers from './pages/CriarUsers';
import Rooms from './pages/Rooms';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Join />} />
          <Route path='/chat/:roomName' element={<Chat />} />
          <Route path='/rooms' element={<Rooms />} />
          <Route path='/criarusers' element={<CriarUsers />} />
          <Route path='*' element={<h1>Rota não encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
