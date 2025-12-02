import React, { useState, useEffect, useRef } from 'react';
import { IoChatbubblesSharp } from "react-icons/io5";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, clearMessages, setOnlineUsers } from '../chat/chatSlice';


const availableRooms = [
    { id: 'geral', name: 'Geral' },
    { id: 'jogos', name: 'Jogos' },
    { id: 'musica', name: 'Música' },
    { id: 'dev', name: 'Programação' },
    { id: 'animes', name: 'Animes' },
];

const Chat = () => {
    const dispatch = useDispatch();
    const { nickname, socket, messages, onlineUsers } = useSelector((state) => state.chat);

    const { roomName } = useParams();
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);

    // Estados locais
    const [message, setMessage] = useState('');
    const [privateTarget, setPrivateTarget] = useState(null); // Alvo do sussurro

    const currentRoom = availableRooms.find(r => r.id === roomName) || { name: roomName, icon: '#' };

    // --- EFEITOS ---

    // 1. Scroll Automático
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // 2. Conexão Socket e Eventos
    useEffect(() => {
        // Limpa mensagens e lista de usuários ao trocar de sala
        dispatch(clearMessages());
        dispatch(setOnlineUsers([]));
        setPrivateTarget(null);

        if (socket) {
            // Entrar na sala
            socket.emit('join_room', roomName);

            // Ouvir mensagens
            socket.off('receive_message');
            socket.on('receive_message', (data) => {
                dispatch(addMessage(data));
            });

            // Ouvir lista de usuários online (Vindo do backend)
            socket.off('room_users');
            socket.on('room_users', (users) => {
                dispatch(setOnlineUsers(users));
            });

            return () => {
                socket.off('receive_message');
                socket.off('room_users');
            };
        } else {
            navigate('/'); // Se não tiver socket, volta pro login
        }
    }, [socket, dispatch, roomName, navigate]);


    // --- AÇÕES ---

    const handleSend = () => {
        if (!socket || message.trim() === '') return;

        if (privateTarget) {
            // Lógica de Sussurro (Privado)
            socket.emit('send_private_message', {
                targetSocketId: privateTarget.socketId,
                targetName: privateTarget.username,
                message: message.trim()
            });
        } else {
            // Lógica Normal (Público)
            const messageData = {
                author: nickname,
                message: message.trim(),
                room: roomName
            };
            socket.emit('send_message', messageData);
        }
        setMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
        if (e.key === 'Backspace' && message === '' && privateTarget) {
            setPrivateTarget(null);
        }
    };

    const selectUserForWhisper = (user) => {
        if (user.username !== nickname) {
            setPrivateTarget(user);
        }
    };


    return (
        <div className='flex h-screen bg-[#121212] text-gray-100 font-sans overflow-hidden'>
            <div className='w-64 bg-[#1e1e1e] flex flex-col border-r border-gray-800'>
                <div className='p-4  flex items-center justify-center text-6xl text-[#1DB954]'>
                    <IoChatbubblesSharp className='flex items-center '/>
                </div>
                <div className='flex-1 overflow-y-auto p-3 space-y-1'>
                    <p className='text-xs font-semibold text-gray-500 mb-2 uppercase px-2 tracking-wider'>Salas Disponíveis</p>
                    {availableRooms.map(room => (
                        <Link
                            key={room.id}
                            to={`/chat/${room.id}`}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                                ${roomName === room.id
                                    ? 'bg-[#1DB954] text-white font-medium shadow-lg shadow-green-900/20'
                                    : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'}
                            `}
                        >
                            <span className='text-lg w-6 text-center'>{room.icon}</span>
                            <span>{room.name}</span>
                        </Link>
                    ))}
                </div>

                <div className='p-4 bg-[#181818] flex items-center gap-3 border-t border-gray-800'>
                    <div className='w-9 h-9 rounded-full bg-linear-to-tr from-[#1DB954] to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-md'>
                        {nickname ? nickname[0].toUpperCase() : '?'}
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-sm font-semibold truncate text-white'>{nickname}</p>
                        <p className='text-[10px] text-green-500 font-medium uppercase tracking-wide flex items-center gap-1'>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                        </p>
                    </div>
                </div>
            </div>

            <div className='flex-1 flex flex-col bg-[#252525] relative min-w-0'>
                <div className='h-16 border-b border-gray-700 flex items-center px-6 bg-[#252525] shadow-sm z-10 justify-between'>
                    <div className="flex items-center gap-2">
                        <span className='text-2xl text-gray-500'>{currentRoom.icon}</span>
                        <div>
                            <h2 className='font-bold text-lg text-white leading-tight'>{currentRoom.name}</h2>
                            <p className="text-xs text-gray-400">Canal público de conversas</p>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-[#1e1e1e] px-3 py-1 rounded-full border border-gray-700">
                        {onlineUsers.length} online
                    </div>
                </div>

                <div ref={chatContainerRef} className='flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent'>
                    {messages.map((msg, index) => {
                        const isMe = msg.author === nickname;
                        const isSystem = msg.author === 'Sistema';
                        const isPrivate = msg.isPrivate;

                        // Mensagem do Sistema
                        if (isSystem) {
                            return (
                                <div key={index} className="flex justify-center my-4 opacity-75">
                                    <span className="text-xs text-gray-400 bg-[#1e1e1e] border border-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                                        {msg.message}
                                    </span>
                                </div>
                            );
                        }

                        // Mensagem de Usuário
                        return (
                            <div key={index} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''} group`}>
                                {/* Avatar da Mensagem */}
                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold text-white shadow-md mt-1
                                    ${isPrivate
                                        ? 'bg-linear-to-br from-purple-500 to-indigo-600'
                                        : (isMe ? 'bg-linear-to-br from-[#1DB954] to-green-700' : 'bg-linear-to-br from-gray-600 to-gray-700')}`}>
                                    {msg.author[0].toUpperCase()}
                                </div>

                                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <span className={`text-xs font-bold ${isMe ? 'text-[#1DB954]' : 'text-gray-300'}`}>
                                            {msg.author}
                                        </span>
                                        <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                                        {isPrivate && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 rounded border border-purple-500/30">Privado</span>}
                                    </div>

                                    <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] leading-relaxed wrap-break-words
                                        ${isPrivate
                                            ? 'bg-purple-900/40 border border-purple-500/30 text-purple-100 rounded-tl-none'
                                            : (isMe
                                                ? 'bg-[#1DB954] text-white rounded-tr-none'
                                                : 'bg-[#353535] text-gray-200 rounded-tl-none border border-gray-700')}
                                    `}>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Área de Input */}
                <div className='p-5 bg-[#252525]'>
                    <div className={`relative bg-[#333] rounded-xl p-1.5 flex items-center shadow-lg border transition-colors
                        ${privateTarget ? 'border-purple-500/50' : 'border-gray-700 focus-within:border-[#1DB954]'}`}>

                        {/* Indicador de Sussurro */}
                        {privateTarget && (
                            <div className="flex items-center gap-2 bg-purple-600/20 text-purple-300 pl-3 pr-2 py-1.5 rounded-lg mr-2 border border-purple-500/30 animate-in fade-in slide-in-from-left-2 duration-200">
                                <span className="text-xs font-semibold">@{privateTarget.username}</span>
                                <button onClick={() => setPrivateTarget(null)} className="hover:bg-purple-500/30 rounded p-0.5 text-purple-400 hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder={privateTarget ? `Sussurrando para ${privateTarget.username}...` : `Conversar em #${currentRoom.name}`}
                            className='flex-1 bg-transparent border-none focus:ring-0 text-white px-3 py-2 text-sm placeholder-gray-500'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />

                        <button
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className='p-2.5 bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


            {/*USUÁRIOS ONLINE (DIREITA) */}
            <div className='w-72 bg-[#1e1e1e] border-l border-gray-800 hidden xl:flex flex-col'>
                <div className='p-5 border-b border-gray-800'>
                    <h3 className='font-bold text-gray-400 text-xs uppercase tracking-widest'>Usuários Online — {onlineUsers.length}</h3>
                </div>
                <div className='flex-1 overflow-y-auto p-4 space-y-2'>
                    {onlineUsers.map(user => {
                        const isMe = user.username === nickname;
                        return (
                            <div
                                key={user.socketId}
                                onClick={() => !isMe && selectUserForWhisper(user)}
                                className={`group flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 border border-transparent
                                    ${isMe
                                        ? 'bg-[#252525] border-gray-700 opacity-80 cursor-default'
                                        : 'cursor-pointer hover:bg-[#2a2a2a] hover:border-gray-700 hover:shadow-md active:scale-98'}
                                `}
                            >
                                <div className='relative'>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm
                                        ${isMe ? 'bg-gray-600' : 'bg-linear-to-tr from-[#1DB954] to-emerald-600'}`}>
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-[#1e1e1e] rounded-full
                                        ${isMe ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm font-medium truncate ${isMe ? 'text-gray-400' : 'text-gray-200 group-hover:text-white'}`}>
                                            {user.username}
                                        </p>
                                        {isMe && <span className="text-[10px] text-gray-500 bg-black/20 px-1.5 py-0.5 rounded">Você</span>}
                                    </div>
                                    <p className='text-xs text-gray-500 truncate group-hover:text-[#1DB954] transition-colors'>
                                        {!isMe ? 'Clique para sussurrar' : 'Status: Online'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default Chat;