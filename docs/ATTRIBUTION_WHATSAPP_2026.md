# Atribuição PENSI+ — implementação experimental (não publicar sem validação)

## Escopo
- Branch: `feat/attribution-whatsapp-2026`.
- Primeiro e último toque, até 30 toques e 80 eventos recentes; expiração deslizante em 180 dias.
- Captura UTMs externas e identificadores de clique (gclid/gbraid/wbraid/fbclid) após consentimento.
- Navegação interna NÃO cria novas UTMs nem substitui a origem.
- Mensagem do WhatsApp recebe código `P26-XXXXXXXXXX` quando houver consentimento. O código NÃO confirma envio de mensagem.
- Eventos: `view_course`, `select_plan`, `navigation_click`, `click_whatsapp`.
- `click_whatsapp` NÃO é `generate_lead`, matrícula ou conversão principal. A integração Google Ads direta para clique foi desativada neste módulo; revisar GTM para impedir duplicidade.
- Sem armazenamento de dados pessoais, telefone ou valor de matrícula no navegador.

## Processo manual de matrícula
Usar controle privado (não hospedado no front-end público) com colunas:
`attendance_code, course, enrollment_date, contracted_value_brl, status, notes_internal, consent_evidence, click_id_type, click_id, click_timestamp, conversion_upload_status`.
O código identifica a jornada apenas se houver um processo seguro para associá-lo à origem. **O código sozinho não permite recuperar identificadores de clique do navegador após a conversa**. Para importação offline confiável, será necessário backend seguro com registro do código e atribuição, consentimento, controle de acesso, retenção e exportação. Não exportar dados diretamente do navegador público nem colocar identificadores de clique na mensagem WhatsApp.

## Checklist obrigatório antes de produção
1. Rodar `cd site-v2 && npm ci && npm run build`.
2. Verificar navegação sem consentimento: nenhum histórico novo em localStorage.
3. Consentir; acessar URL com UTMs e gclid de teste; verificar primeiro e último toque.
4. Navegar internamente; verificar que a origem NÃO muda.
5. Trocar de curso/plano e verificar eventos.
6. Abrir botão WhatsApp e confirmar texto com código único; repetir e verificar ausência de duplicação.
7. Revogar consentimento e confirmar limpeza do armazenamento.
8. Auditar GTM/GA4/Meta para garantir que `click_whatsapp` não seja contado como matrícula.
9. Validar `gclid`/consentimento, deduplicação, segurança do armazenamento servidor e importação offline em ambiente de testes.
10. Testar navegadores, bloqueadores, navegação privada, expiração e links externos.
11. Só depois abrir PR e avaliar deploy; **não promover automaticamente para produção**.

## Limitações
- Não há integração com WhatsApp Business API; clique não confirma mensagem.
- Não existe ainda backend para recuperar atribuição por código e registrar matrículas; conversões offline não são enviadas.
- Não foi executado build/teste end-to-end nesta alteração via conector GitHub.
- Revisar Consent Mode v2 no GTM para evitar tags diretas e do contêiner disparando duplicadas.
