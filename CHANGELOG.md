# 🚀 Release v2.0.0: Motor Financeiro e Gestão Avançada de Equipe

Esta é a maior atualização estrutural do sistema até o momento. A versão 2.0 transforma a plataforma de um simples sistema de agendamentos para um **ERP completo de gestão de barbearias**, introduzindo controle de comissões, um fluxo de caixa detalhado e um novo modelo de permissões descentralizadas.

## Novas Funcionalidades (Added)

* **Dashboard Financeiro (`/finances`):** Novo painel de inteligência de negócios em tempo real. Calcula automaticamente o faturamento bruto, o repasse de comissões da equipe e o lucro líquido do mês atual.
* **Gestão de Comissões:** Implementação de um motor financeiro que registra uma "fotografia" do valor do serviço e da taxa de comissão no exato momento da conclusão do agendamento, garantindo a integridade do histórico do caixa contra alterações futuras.
* **O "Paradoxo do Dono-Barbeiro":** Desacoplamento da hierarquia de sistema e prestação de serviço. Donos (`owner`) e Administradores (`admin`) agora podem receber uma flag `isProvider`, permitindo que apareçam na lista do aplicativo e recebam agendamentos de clientes normalmente.
* **Gestão Dinâmica de Equipe:** Nova interface interativa para contratação e demissão de profissionais. Inclui um modo de edição *inline* para alterar cargos, habilitar/desabilitar a agenda do barbeiro e ajustar a porcentagem (%) de comissão.

## Mudanças e Melhorias (Changed)

* **Refatoração do Frontend (React/Tailwind):** O componente `ManageProfessionals` foi reescrito para suportar o novo fluxo de gestão. A tela inicial de agendamentos para clientes foi atualizada para consumir dinamicamente a nova regra de profissionais ativos.
* **Evolução do Schema no MongoDB:**
  * `User`: Adicionados os campos `isProvider` (Boolean) e `commissionRate` (Number).
  * `Appointment`: Adicionados os campos financeiros `price`, `commissionRateSnapshot`, `commissionAmount` e `paymentStatus`.
* **Otimização de Consultas (API):** A rota `GET /providers` foi atualizada para buscar profissionais com base na flag funcional (`isProvider: true`) em vez de se limitar a cargos administrativos estáticos.

## Segurança e Validação (Security)

* **Blindagem de Rotas Financeiras:** Implementação rigorosa de middlewares para garantir que dados de fluxo de caixa e gestão de equipe sejam estritamente limitados ao Dono da barbearia.
* **Travas de Integridade com Zod:** Nova camada de proteção no `ProfessionalController` bloqueando requisições com comissões negativas.
* **Proteção de Cargos Críticos:** Lógica adicionada para impedir que o usuário `owner` rebaixe acidentalmente o próprio cargo ou delete a própria conta durante a gestão da equipe.
