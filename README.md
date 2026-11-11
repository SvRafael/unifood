# Campus Crave Market

Crie uma aplicação web moderna, responsiva e interativa chamada "Unifood", um marketplace universitário que conecta alunos a microempreendedores universitários (estudantes que vendem bolos, doces, salgados, marmitas e lanches no campus). 

### 1. Identidade Visual e Estilo (Design System)

- Paleta de cores principal: Azul (#1E40AF / #2563EB), Laranja (#F97316 / #EA580C) e Branco (#FFFFFF), com tons neutros de cinza suave para fundos e bordas.

- Estilo: Moderno, jovial, limpo, mobile-friendly (priorizar excelente visualização tanto em smartphones quanto em telas de computador).

- Componentes UI: Usar Tailwind CSS com Lucide Icons e shadcn/ui.

### 2. Controle de Perfis e Simulação de Usuários (Mocked State)

Inclua uma barra de alternância rápida no topo (ou tela de login simulada) para que a banca examinadora do TCC possa testar os dois papéis instantaneamente:

- Papel "Aluno / Comprador": Pode navegar, favoritar, adicionar ao carrinho, aplicar cupom e finalizar pedidos.

- Papel "Aluno Empreendedor / Vendedor": Acesso ao painel gerencial de vendas e cadastro de catálogo.

### 3. Funcionalidades para o Aluno (Comprador)

- **Autenticação:** Telas/modais de Login e Cadastro (com campo opcional de Curso/Semestre/RA para contexto acadêmico).

- **Vitrine Principal & Busca:**

  - Barra de pesquisa em tempo real por nome do item ou vendedor.

  - Filtros por categoria (Bolos, Doces, Salgados, Bebidas, Saudável, Vegano) e ordenação (menor preço, mais vendidos).

  - Cards de produto com imagem demonstrativa (Unsplash), preço em R$, botão de favoritar (coração interativo) e botão rápido de "Adicionar à Sacola".

- **Lista de Favoritos:** Aba ou modal dedicada para visualizar os itens salvos pelo aluno.

- **Carrinho & Checkout Simulado:**

  - Visualização de itens com ajuste de quantidade (+ / -) e remoção.

  - Seletor de Modalidade: "Retirar no Campus" (com seleção de ponto de encontro, ex: Bloco A, Cantina Central, Estacionamento) ou "Receber na Sala/Prédio".

  - Campo de Cupom de Desconto funcional (ex: permitir testar "UNICALOURO10" aplicando 10% de desconto real no subtotal).

  - Simulação de Pagamento: Opções de PIX (gerando um QR Code mock com botão de copiar chave), Cartão de Crédito/Débito simulado ou Pagamento na Entrega.

  - Modal de Confirmação com status do pedido ("Aguardando vendedor", "Preparando", "Pronto para retirada").

### 4. Funcionalidades para o Aluno Vendedor

- **Dashboard de Vendas:**

  - Métricas resumo: Total faturado hoje/semana, quantidade de pedidos e ticket médio.

  - Tabela/lista de pedidos recentes com badges de status ("Pendente", "Em preparo", "Concluído").

- **Cadastro de Novos Produtos (Formulário Funcional em tela/modal):**

  - Campos: Nome do produto, Categoria, Preço (R$), Descrição detalhada e seletor/upload de imagem (com preview).

  - Ao salvar, o produto deve ser injetado diretamente no catálogo geral da vitrine para teste imediato.

### 5. Dados Iniciais de Demonstração (Mock Data)

Inclua previamente ao menos 6 produtos realistas de microempreendedores acadêmicos (ex: "Bolo de Pote Ninho com Nutella", "Coxinha de Frango com Catupiry", "Brownie Artesanal 70%", "Empada de Palmito", "Palha Italiana") já vinculados a fotos gastronômicas do Unsplash e avaliações demonstrativas.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ff13ccc9-743c-5c82-b1d4-741d584b95c8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
