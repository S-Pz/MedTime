# 🏥 Med-Time
Sistema de gerenciamento de consultas médicas, pacientes e funcionários, desenvolvido com **Prisma ORM** e **PostgreSQL**.

Este projeto tem como objetivo ilustrar a modelagem de dados de um sistema de agendamento médico, incluindo herança entre tipos de usuários e relacionamento entre unidades, médicos e pacientes.

## 📦 Tecnologias utilizadas

- **Node.js**
- **Prisma ORM**
- **PostgreSQL**
- **React**

<details>
<summary><strong>Configurações BackEnd</strong></summary>


1. [Configuração do ambiente](#ConfiguracaoDoAmbiente)
2. [Instalação e configuração do Prisma](#InstalacaoEConfiguracaoDoPrisma)

---

<a name="ConfiguracaoDoAmbiente" />

## ⚙️ Configuração do ambiente

### 🧾 Exemplo de `.env`

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/meu_projeto?schema=public"
````
**Explicação dos campos:**

| Campo | Descrição |
|-------|-----------|
|`usuario`| Usuário do banco PostgreSQL (por padrão é `postgres`)|
|`senha`| Senha configurada para o usuário do banco|
|`localhost`| Host onde o banco está rodando|
| `5432`| Porta padrão do PostgreSQL|
| `meu_projeto`| Nome do banco de dados (crie um com esse nome antes de conectar)|
| `schema`| Schema padrão do Postgres (geralmente `public`)|

---

<a name="InstalacaoEConfiguracaoDoPrisma"/>

## 🧰 Instalação e configuração do Prisma

1. **Instale as dependências:**

```bash
npm install
```

2. **Instale o Prisma CLI (caso ainda não tenha):**

```bash
npm install prisma --save-dev
```

3. **Inicialize o Prisma:**

```bash
npx prisma init
```

Isso criará:

* uma pasta `prisma/` com o arquivo `schema.prisma`
* o arquivo `.env` na raiz do projeto

4. **Teste a conexão com o banco:**

```bash
npx prisma db pull
```

Se a conexão estiver correta, não aparecerá erro.

5. **Comando para deletar as tabelas**

```bash
npx prisma migrate reset
```

6. **Crie as tabelas com o migrate:**

```bash
npx prisma migrate dev --name init
```

Isso:

* Gera o arquivo de migração em `/prisma/migrations/`
* Cria as tabelas no banco conforme seu schema

7. **Gerar o Prisma Client (para usar no código):**

```bash
npx prisma generate
```

8. **Abrir o Prisma Studio (interface web para visualizar os dados):**

```bash
npx prisma studio
```

O Prisma Studio abrirá em: [http://localhost:5555](http://localhost:5555)

## 🧱 Exemplo de schema (resumido)

```prisma
model Usuario {
id_usuario  Int   @id @default(autoincrement())
cpf         String @unique
nome        String
senha       String

paciente    Paciente?
funcionario Funcionario?
}
```

## 🧠 Exemplo de uso com Prisma Client

### Criando um paciente

```js
await prisma.usuario.create({
data: {
    nome: "João Silva",
    cpf: "12345678900",
    senha: "senha123",
    paciente: {
    create: {
        endereco: "Rua A, 123",
        telefone: "(11) 99999-9999"
    }
    }
}
});
```

## 🧪 Testando o projeto

1. **Verifique se o PostgreSQL está em execução**
2. **Execute as migrações:**

```bash
npx prisma migrate dev
```
3. **Inicie o Prisma Studio para inspecionar os dados:**

```bash
npx prisma studio
```
4. **Execute o projeto normalmente:**

```bash
npm run dev
```

# Gerador de JWT-Secret
Para gerar seu seacret do autentication JWT pode-se utilizar esse site:

[JWT-Seacret](https://jwtgenerator.com/tools/jwt-generator)
</details>