# XV Anos — Site do Evento (Convite Digital Premium)

Versão avançada do convite: em vez de uma imagem única, o convidado navega por
um **site de evento em 3 etapas** (estilo Stories/Wizard), com transições em
slide + fade, contador regressivo em tempo real, atalhos para mapa e Google
Agenda, confirmação de presença via WhatsApp e chave PIX copiável.

## Estrutura

```
index.html   → estrutura das 3 etapas + splash do envelope
style.css    → identidade visual (verde-oliva + dourado), animações e wizard
script.js    → toda a configuração do evento + lógica (edite só aqui)
assets/      → imagens e música (mesmos arquivos do convite anterior)
```

## Como editar para um novo evento

Abra **`script.js`** e edite apenas o objeto `config` no topo do arquivo:

- `music`, `mapsLink`, `whatsappNumber`, `whatsappMessage`
- `pix.key`, `pix.keyType`, `pix.ownerName`
- `event.nome`, `tituloAniversario`, `subtitulo`, `diaSemana`, `dia`, `mes`,
  `ano`, `hora` → textos que aparecem **sobre a arte** da Etapa 1
- `event.dataISO` → data/hora reais do evento (usadas no contador regressivo
  e no botão "Salvar no Google Agenda"). Formato: `AAAA-MM-DDTHH:MM:SS-03:00`
- `event.dataLabel`, `horaLabel`, `local`, `endereco`, `traje` → aparecem na
  Etapa 2 (detalhes)

Sempre que substituir algum arquivo em `/assets`, mude `CACHE_VERSION` (ex.:
para a data de hoje) para forçar o celular a baixar a versão nova.

## As 3 etapas

1. **Apresentação** — a arte original do convite (`assets/convite.jpg`), com
   nome, data e hora sobrepostos via CSS, personagem com respiração sutil,
   borboletas, sapinho interativo e brilho na coroa.
2. **Detalhes & Experiência** — contador regressivo, local, traje, botões de
   mapa e Google Agenda.
3. **Confirmação & Presentes** — botão de RSVP via WhatsApp e modal de PIX
   com botão de copiar.

Navegação: pelos botões do rodapé, pelos pontinhos de progresso, ou por swipe
(arrastar o dedo) entre as etapas.

## Publicar no GitHub Pages

Suba a pasta inteira (mantendo os nomes de arquivo) para o repositório e
ative o GitHub Pages apontando para a raiz — igual ao projeto anterior.
