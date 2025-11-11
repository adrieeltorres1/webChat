import React, { useState } from 'react';
import FormBtn from '../components/FormBtn';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'antd';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setConnection } from '../chat/chatSlice';

const Join = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [nickname, setNicknameLocal] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleJoin = async () => {
        setShowAlert(false);

        if (nickname.trim() === '') {
            setShowAlert(true);
            return;
        }
        const socket = io.connect('http://localhost:5001');

        socket.emit('set_username', nickname);

        dispatch(setConnection({ nickname, socket }));
        navigate('/chat');
    }

    return (
        <div className='flex items-center justify-center min-h-screen'>

            <div className='text-white flex flex-col items-center gap-6 p-8 rounded-lg shadow-2xl bg-[#1e1e1e] w-80 sm:w-96'>
                <h1 className='text-4xl font-bold mb-4'>Entrar no Chat</h1>

                <input
                    type="text"
                    placeholder='Insira seu nickname'
                    value={nickname}
                    onChange={(e) => setNicknameLocal(e.target.value)}
                    className='p-3 w-full 
                    rounded-md bg-[#2a2a2a] 
                    text-white placeholder-gray-500 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-[#1DB954] required:'
                />
                <input
                    type="password"
                    placeholder='Digite sua senha'
                    
                    className='p-3 w-full 
                    rounded-md bg-[#2a2a2a] 
                    text-white placeholder-gray-500 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-[#1DB954] invalid:border-red-600'
                    required
                />

                 {showAlert && (
                    <Alert
                        message="Por favor, insira um nome de usuário."
                        type="error"
                        showIcon
                        closable
                        onClose={() => setShowAlert(false)}
                        className="w-full mb-4"
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

                <FormBtn
                    onClick={handleJoin}
                >
                    Entrar
                </FormBtn>
            </div>
        </div>
    );
}

export default Join;