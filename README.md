# `spark-generators-lib`

## Descrição
Spark Lib

Este projeto é uma biblioteca de geradores de código para várias linguagens de programação e padrões arquitetônicos. Ele visa agilizar o processo de desenvolvimento, gerando código boilerplate para diferentes camadas de aplicação.

## Sumário

* [Desenvolvimento Local](#desenvolvimento-local)
    * [Pré-requisitos](#pré-requisitos)
    * [Instalação](#instalação)
    * [Construindo a Biblioteca](#construindo-a-biblioteca)
    * [Executando Testes](#executando-testes)
    * [Commitando Alterações](#commitando-alterações)
* [Deploy (CI/CD)](#deploy-cicd)
    * [Incremento de Versão e Publicação](#incremento-de-versão-e-publicação)
    * [Verificações de Pull Request](#verificações-de-pull-request)

## Desenvolvimento Local

### Pré-requisitos

* Node.js (versão 20.x recomendada)
* npm (Node Package Manager)

### Instalação

1.  **Clone o repositório**:
    ```bash
    git clone [https://github.com/caiochiabai/leds-tools-spark-lib.git](https://github.com/caiochiabai/leds-tools-spark-lib.git)
    cd leds-tools-spark-lib
    ```

2.  **Instale as dependências**:
    ```bash
    npm ci
    ```
    Este comando instala todas as dependências do projeto conforme especificado em `package-lock.json`.

### Construindo a Biblioteca

Para compilar o código-fonte TypeScript para JavaScript, execute:
```bash
npm run build
```


### Executando Testes 

Para executar o conjunto de testes:
```bash
npm run test
```

### Commitando Alterações
Este projeto usa Commitizen para mensagens de commit padronizadas. Para commitar suas alterações, execute:
```bash
npm run commit
```

# Deploy (CI/CD)

O projeto utiliza **GitHub Actions** para integração e deploy contínuos. Os workflows estão definidos no diretório `.github/workflows`.

## Incremento de Versão e Publicação

O workflow **Bump Version and Publish** (`dump.yml`) é acionado em *pushes* para o branch `develop`. Este workflow automatiza os seguintes passos:

- **Checkout do Código**: Busca o histórico do repositório.
- **Configurar Node.js**: Configura o Node.js `20.x` e o registro npm.
- **Configurar Git**: Define as informações de usuário do Git para operações de commit.
- **Instalar Dependências**: Executa `npm ci` para instalar as dependências do projeto.
- **Construir Projeto**: Compila o projeto com `npm run build` e `npx tsc`.
- **Análise com SonarCloud**: Realiza uma análise de qualidade e segurança do código usando `SonarSource/sonarcloud-github-action@v2`.
- **Incrementar Versão (minor)**: Incrementa a versão *minor* do pacote e cria uma nova tag, com a versão acessível via `steps.package_version.outputs.version`.
- **Publicar no NPM**: Publica o pacote no registro npm usando `NPM_TOKEN` para autenticação.
- **Fazer Push da Tag e Versionamento para o GitHub**: Envia a nova tag e a versão atualizada para o branch `main`.
- **Apagar Tags Antigas**: Remove todas as tags Git, exceto a mais recente.
- **Definir Timestamp**: Registra o timestamp UTC da execução do workflow.
- **Enviar E-mail de Notificação**: Envia um e-mail para os destinatários configurados após a publicação bem-sucedida, incluindo:
  - Repositório
  - Versão
  - Autor e commit
  - Links para o pacote NPM e logs do GitHub Actions

## Verificações de Pull Request

O workflow **PR Checks** (`pr-checks.yml`) é acionado em *pull requests* direcionados ao branch `develop`. Ele garante a qualidade e correção do código antes da fusão:

- **Checkout do Código**: Busca o histórico do repositório.
- **Configurar Node.js**: Configura o Node.js `20.x`.
- **Instalar Dependências**: Executa `npm ci` para instalar as dependências.
- **Executar Testes**: Executa os testes do projeto com `npm run test`.
- **Análise com SonarCloud**: Realiza análise com `SonarSource/sonarcloud-github-action@v2`.
- **Definir Timestamp**: Registra o timestamp UTC da execução do workflow.
- **Enviar E-mail de Sucesso/Falha**: Envia notificação por e-mail indicando o resultado das verificações, incluindo:
  - Repositório
  - Branch
  - Commit
  - Autor
  - Link para os logs do GitHub Actions