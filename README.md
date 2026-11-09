# Além da Imaginação

Um site simples para transformar uma mensagem em algo mais pessoal. A frase aparece aos poucos e dá lugar a um globo de palavras: dá para girar, escolher uma delas e ler seu significado, junto de uma mensagem opcional.

Também tem um convite para um date, com escolha de dia, cidade e lugar. No final, o site monta uma mensagem com os detalhes e o link do Google Maps para abrir no Gmail ou no WhatsApp. O envio fica por conta de quem recebe o convite.

Feito com HTML, CSS e JavaScript, sem framework ou etapa de compilação. Funciona no computador e no celular.

## Rodando

Abra o `index.html` no navegador. Não precisa instalar nada. As fontes, o Google Maps e os links de envio precisam de internet.

## Personalizando

- **Frase inicial:** altere `FRASE` em `JS/app.js`.
- **Palavras:** edite `JS/palavras.js`. Cada item tem `palavra`, `significado` e `porque`. Deixe `porque` vazio para mostrar só o significado.
- **Cor do tema:** mude os três valores de `--accent-rgb` no início de `CSS/Style.css`.
- **Assinatura e foto:** estão no `index.html`; a foto usada é `Assets/luis.jpeg`.
- **Convite:** configure `DATE_CONFIG` no início de `JS/date.js`. Preencha `EMAIL`, `WHATSAPP` e a lista `LUGARES`. O WhatsApp deve incluir o código do país e o DDD, usando apenas números.

Esta versão pública não traz o nome da destinatária, as mensagens pessoais nem os locais do convite original. As cidades, os estabelecimentos e os endereços são fictícios, só para mostrar a estrutura. Os contatos estão vazios e os botões de envio ficam desabilitados até serem preenchidos. A assinatura e a foto do autor foram mantidas.

Em cada lugar, `nome` é o que aparece na lista, `tipo` é a descrição curta e `busca` é a pesquisa enviada ao Maps. Use o nome completo do estabelecimento e seu endereço na busca para evitar resultados ambíguos.

## Publicando no GitHub Pages

1. Envie o conteúdo desta pasta para o repositório, deixando o `index.html` na raiz.
2. No GitHub, vá em **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main` (ou a que você usa), a pasta **/(root)** e salve.

O GitHub vai disponibilizar o endereço do site nessa mesma página. Como o conteúdo é público, tudo que estiver nos arquivos — inclusive contatos e fotos — também poderá ser visto por outras pessoas.

## Testes

Com Node.js 18 ou mais recente instalado, execute:

```sh
node --test tests/date-config.test.cjs
```

Os testes conferem que o convite público usa apenas os exemplos e não contém contatos reais. Se você personalizar essa versão, ajuste os testes para acompanhar suas configurações.