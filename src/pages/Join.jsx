import React, { useState } from 'react';
import FormBtn from '../components/FormBtn';
import { useNavigate } from 'react-router-dom'; 
import { Alert } from 'antd'; 
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setConnection } from '../chat/chatSlice'; // Assume-se que esta ação foi criada

const Join = () => {
    const navigate = useNavigate();
    
    // A chamada do hook deve estar correta
    const dispatch = useDispatch(); 
    
    const [nickname, setNicknameLocal] = useState(''); 
    const [showAlert, setShowAlert] = useState(false);

    const handleJoin = async () => {
        setShowAlert(false);

        if (nickname.trim() === '') {
            setShowAlert(true);
            return;
        }
        
        // 1. Conectar ao Socket.IO
        const socket = io.connect('http://localhost:5001');
        
        // 2. Emitir o nickname
        socket.emit('set_username', nickname);
        
        // 3. Salvar no estado global do Redux
        // ATENÇÃO: Verifique se 'setConnection' está importado de onde você espera.
        dispatch(setConnection({ nickname, socket })); 
        
        // 4. Navegar para o chat
        navigate('/chat');
    }

    return (
        <div className='flex items-center justify-center min-h-screen'>
            
            <div className='text-white flex flex-col items-center gap-6 p-8 rounded-lg shadow-2xl bg-[#1e1e1e] w-80 sm:w-96'>
                <h1 className='text-4xl font-bold mb-4'>Entrar no Chat</h1>
                
                {/* 💡 AJUSTE DE LAYOUT: O Alerta vem antes do Input */}
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
                    focus:ring-[#1DB954]'
                />

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