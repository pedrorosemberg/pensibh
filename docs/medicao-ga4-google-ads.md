# Medição da PENSI+

## Identificadores

| Destino | Identificador |
| --- | --- |
| Google Tag Manager | `GTM-WZ75JWVK` |
| GA4 | Propriedade `431949249`, medição `G-RRH6VX6G3D` |
| Google Ads | Conta Bruno Montoni, `253-607-1327`, tag `AW-428944447` |
| Conversão de WhatsApp no Ads | `AW-428944447/ech4CJzShKYZEL_YxMwB` |

## UTMs

Use nomes estáveis, em minúsculas, com os separadores já publicados. Ao editar anúncios ativos, valide a URL final e o sufixo antes de salvar. Preserve a marcação automática do Ads e evite acrescentar UTMs a links internos.

A atribuição detalhada do WhatsApp em `scripts/gtm.mjs` reconhece estas combinações:

| Campo | Demand Gen | Vídeo |
| --- | --- | --- |
| `utm_source` | `google` | `google` |
| `utm_medium` | `paid_demand_gen` | `paid_video` |
| `utm_campaign` | `bf26_demand_gen` | `bf26_video` |
| `utm_term` | `black_friday` | `black_friday` |
| `utm_content` | `cefet`, `enem` ou `cesec` | `cefet`, `enem` ou `cesec` |

Parâmetros opcionais: `utm_id={campaignid}&adgroup_id={adgroupid}&ad_id={creative}`. O código aceita apenas IDs numéricos com até 20 dígitos. Quando a combinação é reconhecida, o evento recebe `ads_campaign`, `ads_ad_group`, `ads_course` e os IDs válidos. O GA4 trata as UTMs normalmente nas dimensões de aquisição. O mapa de atribuição detalhada acima cobre Demand Gen e Vídeo. Para Pesquisa, preserve o sufixo em uso no Google Ads e teste qualquer extensão do mapa como alteração independente.

## Eventos

Os cinco eventos de interação são enviados ao GA4 após o aceite da categoria Análise. O WhatsApp usa o fluxo de contato existente do Consent Mode v2.

| Evento | Disparo | Destino |
| --- | --- | --- |
| `click_whatsapp` | Clique em link `https://wa.me/` | GA4 |
| `conversion` | Mesmo clique, com o rótulo Ads acima | Google Ads, ação primária Whatsapp, contagem Uma |
| `view_course` | Metade de um card entra na área visível, uma vez por card | GA4, `course` |
| `view_pricing` | Metade do cabeçalho da seção de preços entra na área visível, uma vez por página | GA4, `content_section` |
| `select_plan` | Troca da aba de curso por clique ou teclado | GA4, `course` |
| `click_phone` | Clique em link `tel:` | GA4, `contact_method` e `contact_section` |
| `navigation_click` | Clique em âncora interna da página | GA4, `destination_section` e `navigation_section` |

O bootstrap em `scripts/gtm.mjs` controla o Consent Mode v2 e envia o clique ao GA4 e ao Ads. O `dataLayer` também recebe `whatsapp_contact`. Mantenha um único disparo da ação Ads por clique. Evite uma segunda tag de conversão disparada por `whatsapp_contact` e uma segunda ação primária importada do GA4 para o mesmo clique. Clique em WhatsApp mede intenção de contato. Matrícula e conversa iniciada requerem evidência própria.

## Validação e publicação

1. Execute `npm ci --prefix site-v2`, `node scripts/build.mjs` e `git diff --check`.
2. Abra o preview no Tag Assistant e compare consentimento padrão e consentimento após a escolha. Confira os destinos e conte um disparo da ação Ads por clique. Use sessão de teste sem identificador de anúncio real.
3. No DebugView da propriedade BRUNO, confira cada evento GA4 e seus parâmetros. Em Admin → Events, confira o registro recebido e o estado de evento principal que estiver aprovado. Os cinco eventos de interação são analíticos.
4. Em Google Ads → Goals → Conversions, confira origem, estado, contagem e classificação da ação Whatsapp. Inspecione a versão publicada do contêiner e confirme que as metas usadas pelas campanhas permanecem válidas.
5. Se falhar a validação, mantenha a configuração de produção das tags e das campanhas e publique apenas as alterações independentes já verificadas. Registre URL, versão, ambiente e evidência do teste.
