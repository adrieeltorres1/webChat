import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'antd';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setConnection } from '../chat/chatSlice';

const Join = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (username.trim() === '' || password.trim() === '') {
            setError('Usuário e senha são obrigatórios.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha no login');
            }

            const socket = io.connect('http://localhost:5001');
            socket.emit('set_username', data.username);
            dispatch(setConnection({ nickname: data.username, socket }));
            navigate('/chat');

        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen'>
            {/* 9. Use <form> e onSubmit para o login */}
            <form onSubmit={handleLogin} className='text-white flex flex-col items-center gap-6 p-8 rounded-lg shadow-2xl bg-[#1e1e1e] w-80 sm:w-96'>
                <h1 className='text-4xl font-bold mb-4'>Entrar no Chat</h1>

                <input
                    type="text"
                    placeholder='Insira seu usuário'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='p-3 w-full rounded-md bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DB954]'
                />
                <input
                    type="password"
                    placeholder='Digite sua senha'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='p-3 w-full rounded-md bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DB954]'
                />

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setError(null)}
                        className="w-full"
                    />
                )}

                <nav className='list-none'>
                    <li>
                        <p className='flex items-center gap-1'>
                            Novo por aqui?
                            <Link to='/criarusers' className='hover:text-[#1DB954] cursor-pointer'>
                                Crie seu acesso
                            </Link>
                        </p>
                    </li>
                </nav>

                <button
                    type="submit"
                    className='w-full p-3 rounded-md bg-[#1DB954] text-white font-bold hover:bg-[#1ed760] transition-colors'
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}

export default Join;