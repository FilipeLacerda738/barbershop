#  Barbershop - Sistema de Agendamento & ERP Financeir

O **Barbershop** é uma plataforma completa para a gestão de barbearias e salões de beleza. O sistema evoluiu de um simples agregador de agendamentos para um **ERP de gestão empresarial de alto nível**, permitindo o controle completo de equipes, taxas de comissão dinâmicas, proteção de dados históricos e um painel de fluxo de caixa em tempo real.

---

##  Funcionalidades Principais

###  Visão do Cliente
* **Agendamento Prático:** Interface fluida para o cliente escolher o profissional, o serviço desejado, a data e o horário disponível.
* **Histórico de Agendamentos:** Painel para o cliente acompanhar as suas reservas passadas, status atuais (pendente, confirmado, concluído, faltou) ou realizar cancelamentos.

## Ferramentas Administrativas & do Dono 
* **Paradoxo do Dono-Barbeiro:** O usuário com cargo de dono (`owner`) pode ativar a sua própria agenda para receber marcações de clientes, acumulando funções administrativas e operacionais perfeitamente.
* **Gestão Dinâmica de Equipe:** Painel exclusivo para o dono contratar novos barbeiros, demitir, alterar cargos (`admin`, `owner`, `client`) e configurar a porcentagem (%) de comissão individual de cada um.
* **Motor Financeiro Imutável:** Quando um agendamento é marcado como "Concluído", a API grava uma "fotografia" imutável do preço do serviço e da comissão do profissional naquele instante, protegendo o caixa contra alterações futuras de preço.
* **Dashboard de Fluxo de Caixa (`/finances`):** Painel financeiro em tempo real que exibe:
  * **Faturamento Bruto:** Todo o dinheiro movimentado na barbearia.
  * **Comissões da Equipe:** O total a ser repassado aos profissionais.
  * **Lucro Líquido:** O valor real que sobra no caixa da empresa.
  * **Tabela de Desempenho:** Relatório individual detalhando quantos cortes cada barbeiro fez e quanto acumulou de comissão no mês.

---

## Tecnologias Utilizadas

### Backend (API)
* **Node.js** & **Express** - Estrutura base da API de alta performance.
* **MongoDB** & **Mongoose** - Banco de dados NoSQL para persistência dos dados e modelagem de Schemas.
* **Zod** - Validação rigorosa e segura de esquemas de dados nas requisições.
* **BcryptJS** & **JWT (JsonWebToken)** - Encriptação de senhas e autenticação de rotas por tokens.
* **Date-fns** - Manipulação precisa de fusos horários, datas e cálculo de agendas e meses financeiros.

### Frontend (Web)
* **React** & **Vite** - Framework moderno e build ultra-rápido para a interface.
* **Tailwind CSS** - Estilização responsiva e otimizada.
* **React Router Dom** - Gestão de rotas e navegação dinâmica.
* **React Hot Toast** - Notificações visuais elegantes para o usuário.

---

## Arquitetura de Segurança

* **Rate Limiting:** Proteção contra ataques de força bruta no backend limitando requisições repetidas por IP.
* **Middlewares de Bloqueio:** Rotas de finanças e gestão de profissionais blindadas com `verifyToken` e `verifyOwner`, impedindo acessos externos maliciosos (via Postman/Insomnia) ou de usuários comuns.
* **Validação de Inputs:** O Zod barra na raiz da API qualquer tentativa de injetar comissões inválidas.

