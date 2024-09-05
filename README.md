# Sistema de Autenticação  

Software desenvolvido com o objetivo de recriar fluxos de segurança da informação, autenticação de credenciais, assim como,
controle de acesso de novos usuários em aplicações. Funcionalidades de criação de conta, login, logout, dentre outras 
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
- Node.js 18.18.
- Sistema operacional MacOS, Windows ou Linux.

## Como Usar

1. **Clone este repositório**:
    ```bash
    git clone https://github.com/ruansantosmatos/Side-Menu.git
    ```

2. **Abra o arquivo `index.html`**:
    - Navegue até o diretório do projeto e abra o arquivo `index.html` em seu navegador.

3. **Personalize o estilo**:
    - Para modificar o design do menu, edite o arquivo `index.css` conforme necessário.

4. **Personalizar ação**:
    - Para modificar a ação de abertura, fechamento, dentre outras, edite o arquivo `index.js` conforme necessário.

## Estrutura do Projeto

```plaintext
├── src
    ├── assets
        └── icons            # Arquivo contendo icones utilizados no projeto
        └── images           # Arquivo contendo imagens utilizadas no projeto
    ├── html
        └── index.html       # Arquivo principal contendo a estrutura HTML do menu
    ├── styles
        └── index.css        # Arquivo de estilos CSS
    ├──scripts
        └── index.js         # Arquivo JavaScript que executa as ações do meu lateral
```

## Contribuições

Contribuições são bem-vindas! Se você encontrar algum problema ou tiver ideias para melhorias, sinta-se à vontade para enviar um pull request.

## Licença

Este projeto está licenciado sob a Licença MIT.