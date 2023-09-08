# ivip-rest (Em Desenvolvimento)

**ivip-rest** é uma biblioteca Node.js em desenvolvimento para simplificar o gerenciamento de requisições e respostas de API em aplicações web.

Este projeto ainda está em desenvolvimento ativo e não está pronto para uso em produção. Estamos trabalhando duro para trazer recursos incríveis e torná-lo uma ferramenta poderosa para sua aplicação.

## Recursos Planejados

- Configuração Simplificada de Servidores Express
- Cliente de API Flexível
- Requisições HTTP Intuitivas
- Gerenciamento de Respostas
- Personalização Avançada
- Facilidade de Uso

## Índice

- [ivip-rest (Em Desenvolvimento)](#ivip-rest-em-desenvolvimento)
  - [Recursos Planejados](#recursos-planejados)
  - [Índice](#índice)
  - [Como Começar](#como-começar)
  - [Cliente de API (Client)](#cliente-de-api-client)
    - [Importação](#importação)
    - [Construtor](#construtor)
      - [`new Client(config: Partial<ClientConfig>)`](#new-clientconfig-partialclientconfig)
    - [Propriedades](#propriedades)
      - [`app`](#app)
    - [Métodos](#métodos)
      - [`fetch(route: string, config?: Partial<ClientFetchConfig>): Promise<FetchResponse>`](#fetchroute-string-config-partialclientfetchconfig-promisefetchresponse)
    - [Configuração](#configuração)
      - [`ClientConfig`](#clientconfig)
    - [Uso](#uso)
      - [Configuração Inicial](#configuração-inicial)
      - [Realização de Solicitações](#realização-de-solicitações)
    - [Cache Interno](#cache-interno)
    - [Exemplo Completo](#exemplo-completo)
  - [Função `api`](#função-api)
    - [Assinatura](#assinatura)
    - [Parâmetros](#parâmetros)
    - [Retorno](#retorno)
    - [Uso](#uso-1)
  - [Função `fetch`](#função-fetch)
    - [Assinatura](#assinatura-1)
    - [Parâmetros](#parâmetros-1)
    - [Retorno](#retorno-1)
    - [Uso](#uso-2)
  - [Contribuições](#contribuições)
  - [Licença](#licença)

## Como Começar

Para começar a usar a biblioteca `ivip-rest`, siga estas etapas:

1. Instale a biblioteca via npm ou yarn:

   ```bash
   npm install ivip-rest
   # ou
   yarn add ivip-rest
   ```

2. Importe os módulos necessários em seu código:

   ```typescript
   import fetch, { Client, api } from 'ivip-rest';
   ```

## Cliente de API (Client)

O Cliente de API (`Client`) é uma parte fundamental da biblioteca `ivip-rest`. Ele permite configurar e realizar solicitações HTTP a partir de seu aplicativo para um servidor remoto ou local. Você pode personalizar as configurações do cliente para atender às necessidades específicas de sua aplicação.

### Importação

```javascript
import { Client } from 'ivip-rest';
```

### Construtor

#### `new Client(config: Partial<ClientConfig>)`

- `config` (objeto): Um objeto de configuração que controla o comportamento do cliente.

### Propriedades

#### `app`

- O objeto `IvipRestApp` associado ao cliente. Fornece informações sobre o aplicativo e configurações gerais.

### Métodos

#### `fetch(route: string, config?: Partial<ClientFetchConfig>): Promise<FetchResponse>`

- `route` (string): O caminho da URL para a solicitação.
- `config` (objeto opcional): Um objeto de configuração que permite substituir temporariamente as configurações do cliente para uma solicitação específica.

Realiza uma solicitação HTTP ao servidor especificado pela rota fornecida. Esta função retorna uma promessa (`Promise`) que resolve em um objeto de resposta (`FetchResponse`), que contém informações sobre a resposta da solicitação.

### Configuração

#### `ClientConfig`

O objeto de configuração do cliente é usado para personalizar o comportamento do cliente de API. Aqui estão as propriedades aceitáveis no objeto `ClientConfig`:

- `name` (string, opcional): O nome do cliente. Pode ser usado para identificar e recuperar o cliente mais tarde usando a função `api`. Útil quando você deseja configurar vários clientes com diferentes configurações. O nome padrão é `'default'`.

- `protocol` (string, opcional): O protocolo usado para a comunicação com o servidor, geralmente `'http'` ou `'https'`. O padrão é `'http'`.

- `host` (string, obrigatório): O host do servidor, por exemplo, `'api.example.com'`.

- `port` (number, opcional): A porta usada para a comunicação com o servidor. Se não for especificado, será determinado automaticamente com base no protocolo (80 para HTTP, 443 para HTTPS).

- `path` (string, opcional): O caminho base usado para todas as solicitações. Útil quando seu servidor API está em um subdiretório. O padrão é `''` (caminho raiz).

- `params` (string ou objeto, opcional): Parâmetros de consulta que serão anexados a todas as solicitações. Pode ser uma string no formato `'param1=value1&param2=value2'` ou um objeto `{ param1: 'value1', param2: 'value2' }`. O padrão é `''` (nenhum parâmetro).

- `headers` (objeto, opcional): Cabeçalhos HTTP personalizados que serão enviados com todas as solicitações. O padrão é `{}` (nenhum cabeçalho personalizado).

### Uso

#### Configuração Inicial

Para começar a usar o Cliente de API, primeiro você deve criar uma instância do cliente com as configurações desejadas. Aqui está um exemplo:

```javascript
import { Client } from 'ivip-rest';

const myClient = new Client({
  //name: 'myApi',           // Nome personalizado para o cliente
  protocol: 'https',         // Protocolo HTTPS
  host: 'api.example.com',   // Host do servidor
  port: 443,                 // Porta HTTPS padrão
  path: '/v1',               // Caminho base para todas as solicitações
  params: {                  // Parâmetros de consulta padrão
    api_key: 'my-api-key',
    locale: 'en_US',
  },
  headers: {                 // Cabeçalhos HTTP personalizados
    'Authorization': 'Bearer my-auth-token',
  },
});
```

#### Realização de Solicitações

Com o cliente configurado, você pode realizar solicitações HTTP usando o método `fetch`. Aqui estão alguns exemplos:

```javascript
import fetch from 'ivip-rest';

// Realizar uma solicitação GET simples
const response = await fetch('/resource');

// Realizar uma solicitação POST com corpo de dados
const requestData = { name: 'John', age: 30 };
const response = await fetch('/create', requestData, { method: 'post' });
```

O objeto `response` retornado contém informações sobre a resposta da solicitação, incluindo o status HTTP, os dados da resposta e os cabeçalhos.

### Cache Interno

O cliente de API possui um cache interno para armazenar respostas de solicitações com base em seus argumentos. Isso pode ajudar a reduzir as solicitações repetidas ao mesmo recurso. O cache é usado automaticamente, e você não precisa interagir diretamente com ele.

### Exemplo Completo

Aqui está um exemplo completo de como usar o Cliente de API `ivip-rest`:

```javascript
import fetch, { Client } from 'ivip-rest';

// Configurar o cliente
const myClient = new Client({
  //name: 'myApi',
  protocol: 'https',
  host: 'api.example.com',
  port: 443,
  path: '/v1',
  params: {
    api_key: 'my-api-key',
    locale: 'en_US',
  },
  headers: {
    'Authorization': 'Bearer my-auth-token',
  },
});

// Realizar uma solicitação GET
const response = await fetch('/resource');

// Verificar a resposta
if (response.status === 200) {
  console.log('Dados da resposta:', response.data);
} else {
  console.error('Erro na solicitação:', response.error);
}
```

Lembre-se de configurar seu cliente `Client` conforme necessário para atender às necessidades específicas de sua aplicação.

## Função `api`

A função `api` é usada para obter um objeto de API configurado a partir de um cliente `Client` pré-configurado, exemplo básico:

```typescript
import { api } from 'ivip-rest';

// Crie um objeto de API personalizado usando o nome pré-configurado em Client
const myApi = api('myApi');

// Use o objeto de API para fazer solicitações
myApi.fetch('/endpoint')
  .then(response => {
    console.log('Resposta:', response.data);
  })
  .catch(error => {
    console.error('Erro:', error);
  });
```

### Assinatura

```typescript
function api(name: string): {
    fetch: typeof fetch;
};
```

### Parâmetros

- `name` (string): O nome do cliente `Client` pré-configurado a ser usado. Este nome deve corresponder a um cliente configurado e armazenado em cache usando o método `initializeApp`.

### Retorno

- Um objeto que contém uma função `fetch` para fazer solicitações HTTP usando o cliente `Client` configurado associado ao nome fornecido.

### Uso

A função `api` é útil quando você já configurou um cliente `Client` e deseja usá-lo para fazer solicitações HTTP. Ela permite que você obtenha um objeto de API com uma função `fetch` que usa o cliente configurado. Aqui está um exemplo de uso:

```javascript
import { api } from 'ivip-rest';

// Obtém um objeto de API configurado a partir do cliente 'myApi'
const myApi = api('myApi');

// Agora você pode usar myApi para fazer solicitações HTTP
const response = await myApi.fetch('/api/data');
```

Certifique-se de configurar seu cliente `Client` corretamente usando `initializeApp` antes de usar a função `api`.

## Função `fetch`

A função `fetch` é usada para fazer solicitações HTTP a um servidor usando o cliente `Client` configurado e retornar uma `Promise` que resolve em um objeto `FetchResponse`, exemplo básico:

```typescript
import fetch from 'ivip-rest';

// Faça uma solicitação POST com dados de corpo
fetch('/data', {
  method: 'POST',
  body: {
    key: 'value',
  },
})
  .then(response => {
    console.log('Resposta:', response.data);
  })
  .catch(error => {
    console.error('Erro:', error);
  });
```

### Assinatura

```typescript
fetch(this: any, route: string): Fetch;
fetch(this: any, route: string, body: FetchBody): Fetch;
fetch(this: any, route: string, body: FetchBody, config: FetchConfig): Fetch;
fetch(this: any, route: string, config: FetchConfig): Fetch;
```

### Parâmetros

- `route` (string): O caminho da rota da API que você deseja acessar.
- `body` (opcional): O corpo da solicitação que pode conter dados como JSON ou outros formatos de dados.
- `config` (opcional): Um objeto de configuração que permite especificar opções adicionais para a solicitação, como cabeçalhos personalizados.

### Retorno

- Uma `Promise` que resolve em um objeto `FetchResponse` contendo informações sobre a resposta da solicitação HTTP.

### Uso

A função `fetch` tem várias sobrecargas para acomodar diferentes casos de uso:

1. **Solicitação GET simples**:

   ```javascript
   const response = await fetch('/api/data');
   ```

2. **Solicitação POST com corpo**:

   ```javascript
   const data = { name: 'John', age: 30 };
   const response = await fetch('/api/user', data);
   ```

3. **Solicitação POST com corpo e configuração personalizada**:

   ```javascript
   const data = { name: 'John', age: 30 };
   const config = {
     method: 'post',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer <token>',
     },
   };
   const response = await fetch('/api/user', data, config);
   ```

4. **Solicitação com configuração personalizada**:

   ```javascript
   const config = {
     method: 'get',
     headers: {
       'Authorization': 'Bearer <token>',
     },
   };
   const response = await fetch('/api/data', config);
   ```

Lembre-se de que a função `fetch` usa o cliente `Client` configurado para fazer a solicitação. Certifique-se de ter configurado o cliente corretamente antes de usar a função `fetch`.

## Contribuições

Aceitamos contribuições! Sinta-se à vontade para enviar problemas (issues) e pull requests para nos ajudar a melhorar este projeto.

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.