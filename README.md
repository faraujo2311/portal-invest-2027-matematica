# Portal INVEST 2027 — Matemática

Portal de revisão do 9º ano, em português brasileiro, adaptado do material fornecido Modulo_2_Matematica_INVEST_Edicao_Premium_2026.docx. O material de preparação é independente e não é uma prova oficial do INVEST.

## Conteúdo preservado

- Oito temas: equações do 1º grau, inequações, sistemas, situações-problema, equações do 2º grau incompletas e completas, classificação de ângulos e operações em graus, minutos e segundos.
- Um roteiro inicial e um simulado final de 16 questões.
- 136 questões objetivas com correção e explicação, 24 discursivas com espaço de resposta e resolução para autocorreção, 24 exemplos resolvidos e 29 ilustrações da apostila.
- Playlist de vários vídeos por bloco, checklist, histórico de tentativas, importação/exportação de conteúdo e progresso.

As referências e sugestões de busca de vídeos da apostila foram preservadas. Ela não forneceu URLs de vídeos específicos: nenhuma aula de outra disciplina foi cadastrada. Os números originais das questões aparecem no portal para permitir consultar a apostila.

## Estudar e editar

No portal, escolha o tema. O botão **Editar conteúdo** pede apenas a senha compartilhada já definida para este projeto, sem login em outras contas. O editor permite alterar textos, títulos, fontes, formatação, imagens, vídeos, questões, gabaritos, fontes bibliográficas e blocos.

O rascunho fica no navegador até clicar em **Salvar alterações**. O salvamento atualiza o conteúdo para todos. Quem souber a senha poderá editar. A senha é validada no servidor e não aparece no código público. Sessões protegidas duram até oito horas; há limite de tentativas e proteção contra gravações simultâneas e solicitações de outra origem.

O progresso individual é guardado neste navegador, com chaves próprias de Matemática. Ele não interfere no de Português e não sincroniza entre dispositivos. Use Baixar progresso para guardar uma cópia. As discursivas não recebem nota automática; a estudante confere as etapas e o resultado na resolução comentada.

## Executar localmente

Com Node.js 22 ou superior: npm start. Abra http://127.0.0.1:8775. Não há dependências para o portal estático. No computador local, Editar conteúdo abre as ferramentas locais e as alterações são guardadas no navegador.

Verificação: npm test. Compilação do Pages: npm run build. Prévia do pacote público: npm run preview, em http://127.0.0.1:8776. O build usa caminhos relativos e exclui o editor e o servidor do pacote público.

## Publicação

Repositório previsto: faraujo2311/portal-invest-2027-matematica. A fonte é versionada no GitHub. O workflow .github/workflows/pages.yml executa os testes e publica dist/ no GitHub Pages.

O Pages hospeda a área de estudos. O serviço em admin-service/ protege a senha e guarda as alterações compartilhadas no D1, com cópias das versões anteriores. O portal busca GET /api/published ao abrir; se o serviço estiver indisponível, usa a cópia de contingência data.js. Os salvamentos de conteúdo não geram commits no GitHub. Para atualizar a contingência, exporte o conteúdo JSON, use node scripts/import-content.mjs caminho-do-backup.json e publique a alteração de data.js.

O editor usa um projeto Sites exclusivo de Matemática, com seu próprio banco, sessões e segredos. A hospedagem não depende da sessão pessoal do GitHub do visitante. A senha e a chave de criptografia ficam nas variáveis secretas de produção, nunca no repositório.

## Estrutura

index.html, data.js, app.js, core.js e styles.css compõem a aplicação. editor.js contém as ferramentas de edição; published.js busca o conteúdo compartilhado; assets/ preserva as ilustrações. content-manifest.json registra as quantidades importadas. O guia do servidor está em admin-service/ADMIN-README.md.
