## 🌐 WebChat Frontend

Este repositório contém o código do cliente web (front-end) da aplicação de chat em tempo real. O objetivo do projeto é fornecer uma interface de usuário funcional onde **múltiplos usuários podem se conectar a uma sala de chat única e trocar mensagens instantaneamente.**

---

### ⚙️ Tecnologias Utilizadas

| Tecnologia | Função |
| :--- | :--- |
| **React** | Biblioteca JavaScript principal para a construção da interface do usuário (UI). |
| **Redux Toolkit (RTK)** | Utilizado para o **gerenciamento de estado global**, controlando o `nickname`, a conexão `Socket.IO` e a lista de `messages`. |
| **Socket.IO Client** | Biblioteca essencial para estabelecer a comunicação bidirecional e em tempo real com o servidor back-end. |
| **React Router DOM** | Gerenciamento de rotas da aplicação (ex: `/` para Login e `/chat` para a Sala de Chat). |
| **Tailwind CSS** | Framework utilitário de CSS para estilização rápida, responsividade e design. |
| **Ant Design** | Usado especificamente para o componente `Alert` na tela de Login/Entrada. |

---

### 🚀 Estrutura do Projeto

O projeto segue uma estrutura modular e clara, com foco na separação das preocupações da UI e do gerenciamento de estado:

* `src/pages/`: Contém os componentes principais que representam as páginas da aplicação (`Join.jsx`, `Chat.jsx`).
* `src/features/chat/chatSlice.js`: O *Slice* do Redux. É o coração do estado da aplicação, responsável por definir as ações (`setConnection`, `addMessage`, etc.) e o estado central (`nickname`, `socket`, `messages`).
* `src/app/store.js`: Configuração da *Store* central do Redux, onde todos os *Slices* são combinados.

---

### 📦 Instalação

Siga os passos abaixo para preparar o ambiente:

1.  **Clone o repositório** (se aplicável, ou navegue até a pasta do projeto front-end).
2.  **Instale as dependências** na pasta raiz do front-end:

```bash
npm install