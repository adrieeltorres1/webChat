import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../chat/chatSlice'; 
const Chat = () => {
    const dispatch = useDispatch();
    const { nickname, socket, messages } = useSelector((state) => state.chat); 
    
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const [message, setMessage] = useState(''); 

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (socket) {
            socket.off('receive_message'); 
            socket.on('receive_message', (data) => {
                dispatch(addMessage(data)); 
            });
            return () => {
                socket.off('receive_message');
            };
        }
    }, [socket, dispatch]);

    const handleBack = () => {
        if (socket) {
            socket.disconnect();
        }
        navigate('/');
    }

    const handleSend = () => {
        if (!socket || message.trim() === '') {
            return;
        }

        const messageData = {
            author: nickname,
            message: message.trim(), 
        };

        socket.emit('send_message', messageData);
        setMessage(''); 
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-[#2a2a2a]'>
            <div className='text-white flex flex-col gap-4 p-6 rounded-lg shadow-2xl bg-[#1e1e1e] w-full max-w-lg h-[80vh]'>
                <h1 className='text-3xl font-bold border-b border-gray-700 pb-2 flex justify-between items-center'>
                    Sala
                    <span className='text-sm font-normal text-[#1DB954]'>Olá, {nickname || 'Convidado'}!</span>
                </h1>
                
                <div 
                    ref={chatContainerRef}
                    className='grow overflow-y-auto space-y-3 p-2 bg-[#2a2a2a] rounded-lg border border-gray-700'
                >
                    {messages.length === 0 ? (
                        <p className='text-gray-500 text-center mt-4'>Comece a conversar!</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.author === nickname ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs p-3 rounded-xl shadow-md ${msg.author === nickname 
                                    ? 'bg-[#1DB954] text-white rounded-br-none' 
                                    : 'bg-gray-700 text-white rounded-tl-none'}`}>
                                    <p className='text-xs font-bold mb-1'>{msg.author}</p>
                                    <p className='text-sm'>{msg.message}</p> 
                                    <span className='text-[10px] text-right block mt-1 opacity-70'>{msg.timestamp}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className='flex gap-2 items-center'>
                    <input 
                        type="text" 
                        placeholder='Digite sua mensagem...' 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className='p-3 grow rounded-md bg-[#2a2a2a] 
                            text-white placeholder-gray-500 focus:outline-none 
                            focus:ring-2 focus:ring-[#1DB954]'
                    />
                    
                    <button
                        onClick={handleSend}
                        className='font-semibold h-10 px-4 text-white text-[16px] 
                            bg-[#1DB954] hover:bg-[#1ed760] rounded-full 
                            transition duration-300 shrink-0'
                    >
                        Enviar
                    </button>
                </div>

                <button
                    onClick={handleBack}
                    className='text-sm text-gray-400 hover:text-[#1ed760] transition duration-300 mt-2'
                >
                    Voltar para Login
                </button>
            </div>
        </div>
    );
}

export default Chat;