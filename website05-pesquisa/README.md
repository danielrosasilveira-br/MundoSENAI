# MUNDO SENAI – DIAGNÓSTICO DE CONEXÃO COM A TECNOLOGIA

Aplicação web interativa, moderna e responsiva desenvolvida para o evento **Mundo SENAI**. O sistema realiza o diagnóstico da maturidade digital dos visitantes (escala de 0 a 27 pontos com 4 classificações) e mapeia o interesse profissional pelas 9 áreas de formação do SENAI, sincronizando os dados em tempo real através do **Firebase Realtime Database** e apresentando métricas avançadas em um **Dashboard de Business Intelligence com Chart.js**.

---

## 🎨 Identidade Visual – Campanha Mundo SENAI

O projeto segue estritamente a identidade estética da campanha oficial Mundo SENAI:
- **Paleta de Cores Futurista**: Roxo Profundo (`#31005F`), Roxo Tecnológico (`#51008A`), Azul Elétrico (`#0759D9`), Azul Neon (`#00A9FF`), Azul Escuro (`#061C54`), Rosa Magenta (`#E83E87`), Rosa Destaque (`#FF397D`), Ciano Neon (`#38D9FF`), Branco (`#FFFFFF`) e Fundo Escuro Espacial (`#080D2C`).
- **Efeitos Visuais**: Painéis translúcidos em *Glassmorphism*, iluminação neon, grade digital em perspectiva tridimensional, circuitos sutis e animações de celebração com confetes neon.
- **Tipografia**: Poppins (títulos, pontuações e destaques em ExtraBold) e Inter (textos, formulários, tabelas e indicadores).
- **Logomarca**: Logomarca oficial do SENAI preservada em proporções e transparência.

---

## 📁 Estrutura de Arquivos do Projeto

```text
website05-pesquisa/
│
├── index.html                  # Página pública do questionário (Wizard de 10 passos)
├── dashboard.html              # Painel administrativo de BI protegido por autenticação
│
├── css/
│   ├── style.css               # Estilos principais, grid em perspectiva e tela de resultado
│   └── dashboard.css           # Estilos do painel de BI, gráficos neon, filtros e tabelas
│
├── js/
│   ├── firebase-config.js      # Configuração modular do Firebase (projeto mundosenai-5638)
│   ├── firebase-service.js     # Gravação (push), leitura e escuta em tempo real (onValue)
│   ├── questionario.js         # Lógica do questionário, validação obrigatória e troféu
│   ├── dashboard.js            # Lógica dos 6 gráficos Chart.js, KPIs, filtros e ordenação
│   └── auth.js                 # Autenticação com Firebase Auth (e-mail e senha)
│
├── assets/
│   ├── logo-senai.png          # Logomarca oficial do SENAI
│   ├── logo-senai.svg          # Logomarca vetorial em alta resolução
│   ├── trofeu.png              # Troféu dourado futurista para tela de resultado
│   └── referencia-mundo-senai.jpg # Imagem oficial da campanha Mundo SENAI
│
├── database.rules.json         # Regras de segurança e validação do Realtime Database
├── database-schema.json        # Estrutura JSON com registros demonstrativos para importação
└── README.md                   # Manual completo de instalação, uso e publicação
```

---

## ⚙️ 1. Configuração do Firebase

O projeto foi projetado para integrar-se ao projeto Firebase existente:
- **Project ID**: `mundosenai-5638`
- **Banco de Dados**: Firebase Realtime Database
- **Autenticação**: Firebase Authentication (Email/Password)

### Passo a Passo no Firebase Console:

1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Abra o projeto **mundosenai-5638**.
3. No menu lateral, acesse **Build > Realtime Database**:
   - Se ainda não tiver criado a base, clique em **Create Database**.
   - Escolha a localização (ex: `us-central1`).
4. No menu lateral, acesse **Build > Authentication**:
   - Clique em **Get Started** (se for a primeira vez).
   - Na aba **Sign-in method**, ative o provedor **Email/Password**.

---

## 🔑 2. Inserção das Credenciais

Abra o arquivo `js/firebase-config.js` e substitua os valores de exemplo pelas credenciais geradas para sua aplicação web no Firebase Console:

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSy...", // Sua API Key real gerada no Firebase
  authDomain: "mundosenai-5638.firebaseapp.com",
  databaseURL: "https://mundosenai-5638-default-rtdb.firebaseio.com",
  projectId: "mundosenai-5638",
  storageBucket: "mundosenai-5638.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

> **Nota de Resiliência**: Caso o arquivo permaneça com as credenciais padrão de exemplo, a aplicação entra automaticamente no **Modo de Demonstração Local**, permitindo testar toda a navegação, cálculos, gravação e painéis gráficos sem quebras de execução.

---

## 📥 3. Importação da Estrutura Inicial (JSON)

Para popular o banco com dados de exemplo iniciais:

1. Acesse o **Firebase Console > Realtime Database > aba Dados (Data)**.
2. Clique no menu de três pontos verticais (⋮) no canto superior direito do painel de dados.
3. Selecione **Importar JSON (Import JSON)**.
4. Selecione o arquivo `database-schema.json` presente na raiz do projeto.
5. Confirme a importação. O nó `/avaliacoes` será criado com registros de amostra.

---

## 🛡️ 4. Configuração das Regras de Segurança

Para garantir que tanto o questionário público quanto o Dashboard público tenham acesso livre para gravação e leitura em tempo real, sem necessidade de login:

1. Acesse **Firebase Console > Realtime Database > aba Regras (Rules)**.
2. Copie o conteúdo do arquivo `database.rules.json` deste projeto.
3. Cole no editor de regras e clique em **Publicar (Publish)**.

As regras aplicadas garantem:
- **Leitura Pública (`.read: true`)**: Qualquer visitante pode carregar e visualizar o Dashboard de Business Intelligence e seus gráficos sem precisar se autenticar.
- **Gravação Controlada**: Visitantes podem registrar novos diagnósticos (`!data.exists() && newData.exists()`) com validação de campos obrigatórios, notas entre 0 e 27 e formato correto.
- **Proteção contra Alteração/Exclusão**: Impede que avaliações já registradas sejam sobrescritas ou apagadas.

---

## 👥 5. Acesso ao Dashboard (Livre e Público)

O Dashboard agora possui **acesso direto e desimpedido** para qualquer visitante ou usuário. Não é necessária nenhuma tela de login ou autenticação prévia: basta acessar diretamente a página `dashboard.html`.

---

## 💻 6. Execução Local

Como o projeto utiliza ES Modules nativos do JavaScript (`import` / `export`), é necessário executar a aplicação através de um servidor HTTP local.

### Opção A: Com Node.js / npx (Recomendado)
Execute no terminal dentro da pasta do projeto:
```bash
npx serve .
# ou
npx http-server -p 8080 .
```

### Opção B: Com Python 3
```bash
python -m http.server 8080
```

### Opção C: Com a extensão Live Server (VS Code)
Abra a pasta no VS Code, clique com o botão direito sobre o `index.html` e selecione **Open with Live Server**.

Acesse:
- **Questionário**: `http://localhost:8080/index.html`
- **Dashboard Administrativo**: `http://localhost:8080/dashboard.html`

---

## ☁️ 7. Publicação em Hospedagem Estática

### No Firebase Hosting:
1. Instale o Firebase CLI: `npm install -g firebase-tools`
2. Faça login: `firebase login`
3. Inicialize no projeto: `firebase init hosting`
   - Escolha o projeto `mundosenai-5638`.
   - Indique o diretório atual `.` como diretório público.
   - Configure como SPA se desejar ou deixe como página padrão.
4. Publique: `firebase deploy --only hosting`

### No GitHub Pages, Vercel ou Netlify:
Basta apontar para o repositório ou pasta do projeto. Nenhum processo de build ou compilação é necessário (Vanilla JS puro).

---

## 📊 Regras de Negócio e Pontuação

- **Perguntas 1 a 9**: Pontuadas de 0 a 3 pontos.
  - Alternativa A: 0 pontos
  - Alternativa B: 1 ponto
  - Alternativa C: 2 pontos
  - Alternativa D: 3 pontos
- **Pergunta 10**: Escolha de 1 entre 9 cursos do SENAI (Alimentos, Construção Civil, Eletroeletrônica, Faculdade SENAI, Gestão, Máquinas Agrícolas e Veículos Pesados, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação). **Não interfere na pontuação**.
- **Pontuação Máxima**: 27 pontos.
- **Faixas de Classificação**:
  - `0 a 6 pontos`: **Explorador Digital Inicial**
  - `7 a 13 pontos`: **Usuário Digital em Desenvolvimento**
  - `14 a 20 pontos`: **Usuário Digital Conectado**
  - `21 a 27 pontos`: **Protagonista Digital**

