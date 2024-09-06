# Sistema de Autenticação  

Software desenvolvido com o objetivo de recriar fluxos de segurança da informação, autenticação de credenciais, assim como,
controle de acesso de novos usuários em aplicações. Funcionalidades de criação de conta, login, logout, dentre outras, 
seram apresentadas no projeto.

## Visão Geral

O projeto tem como objetivo, recriar funcionalidades de autenticação do usuário atráves de crendiciais de acesso.
Comumente utlizado em aplicações web, mobile, desktops, dentre outras. Como caratéricas principais da aplicação,
pode ser detacado: Utilização do protocolo de segurança OAuth2, permitindo que os usuários façam login utilizando contas de terceiros, 
como Google, Facebook, ou outros provedores de identidade, geração de token de acesso, criação de novas contas, redefinição de senha, 
autenticação com código OTP, login e logout. Todas as caraterísticas supracitadas, são necessidades basilares para a identificação, 
proteção de dados e controle de acesso.

## Conceitos Aplicados no Projeto:

- OAuth2
- OTP
- Login
- Logout
- Criptografia de informações
- Redefinição/Recuperação de senha
- Responsividade
- UI/UX
- Integração de API

## Funcionalidades

- Permite o usuário efetuar login.
- Permite o usuário efetuar logout
- Permite a criação de uma novo perfil do usuário.
- Redefinição/Recuperação de senha
- Autenticação de conta utilizando-se código OTP

## Tecnologias Utilizadas:

- Next.Js
- Typescript
- Tailwind CSS
- Sadcn UI
- Yup
- Axios
- JWT

## Requisitos

Para visualizar e modificar o projeto, você precisará de:

- Um navegador web moderno (Chrome, Firefox, Edge, etc.).
- Um editor de texto ou IDE para edição de código (VSCode, Sublime Text, etc.).
- Sistema operacional MacOS, Windows ou Linux.
- Node.js 18.18 ou maior.

## Como Usar

1. **Inicie um projeto Next**:
    ```bash
    npx create-next-app@latest <NameApp>
    ```

2. **Clone este repositório**:
    ```bash
    git clone https://github.com/ruansantosmatos/AuthSystem.git
    ```

3. **Inicie o prompt de comando no diretório do projeto e execute**:
    ```bash
    npm run dev
    ```

4. **API AuthSystem**:
    - Torna-se necessário a utilização da API backend, desenvolvida para garantir a interação
    com o cliente, assim como maninupulação das informações e interações da aplicação. Para mais detalhes
    a cerca da documentação e endpoints, acesse:

5. **Personalize o estilo**:
    - Para aplicar modificações de estilo global, edite o arquivo `styles/globals.css` conforme necessário.
    Nas modificações de componentes, páginas, dentre outros, torna-se necessário a utilização do Tailwind CSS

## Estrutura do Projeto

```plaintext
├── public                   # Diretório que possui utilitários gerais (icones, imagens, dentre outros).

├── src
    ├── api                  # Diretório responsável por definir os endpoints da API para consumo.
        └── config           # Arquivo contendo as configurações da API.
        └── models           # Tipagem estrutural das entendidades da base de dados.
    
    ├── app                  # Diretório principal contendo todas as rotas e páginas da aplicação.
    
    ├── components           # Diretório contendo componentes globais e de bibliotecas.
        └── ui               # Diretório gerado para componentes tailwind CSS da biblioteca Sadcn UI.
    ├── lib                  # Diretório que possui componente base para a utilização do Sadcn UI.
    
    ├── services             # Diretório responsável por conter funções que podem ser utilizadas de maneiras gerais.
    
    ├── styles               # Diretório que possui os arquivos de estilos gerais da aplicação.

```

## Demonstração das Funcionalidades

### Login/Logout
https://github.com/user-attachments/assets/0ae13b46-1598-4ab3-987f-f368d5ceb6f4

### Criação de Conta
https://github.com/user-attachments/assets/c0d11adc-ef6d-4316-a2e9-1aa3f704dd8c

## Contribuições
Contribuições são bem-vindas! Se você encontrar algum problema ou tiver ideias para melhorias, sinta-se à vontade para enviar um pull request.

## Licença

Este projeto está licenciado sob a Licença MIT.
