(() => {
    const API_URL = 'http://localhost:3000';
    const MAX_IMAGENS = 5;
    const TAMANHO_MAXIMO = 10 * 1024 * 1024;

    window.criarGaleriaImagens = ({ recurso, input, galeria, contador, aoErro }) => {
        let entidadeId = null;
        let imagensAtuais = [];
        let imagensSelecionadas = [];
        let urlsPreview = [];
        let houveRemocao = false;

        async function requisitar(url, options = {}) {
            const token = localStorage.getItem('token');
            const resposta = await fetch(`${API_URL}${url}`, {
                ...options,
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...(options.headers || {}),
                },
            });

            if (!resposta.ok) {
                let detalhe = '';
                try {
                    const erro = await resposta.json();
                    detalhe = Array.isArray(erro.message)
                        ? erro.message.join(', ')
                        : erro.message || '';
                } catch {
                    detalhe = await resposta.text().catch(() => '');
                }
                throw new Error(detalhe || `Erro ${resposta.status}`);
            }

            if (resposta.status === 204) return null;
            const texto = await resposta.text();
            return texto ? JSON.parse(texto) : null;
        }

        async function carregarArquivo(url) {
            const token = localStorage.getItem('token');
            const resposta = await fetch(`${API_URL}${url}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!resposta.ok) {
                throw new Error(`Erro ${resposta.status} ao carregar a imagem`);
            }
            return resposta.blob();
        }

        function atualizarControles() {
            const total = imagensAtuais.length + imagensSelecionadas.length;
            contador.textContent = `${total}/${MAX_IMAGENS} imagens`;
            input.disabled = total >= MAX_IMAGENS;
        }

        function limparPreviews() {
            urlsPreview.forEach((url) => URL.revokeObjectURL(url));
            urlsPreview = [];
        }

        function renderizar() {
            limparPreviews();
            galeria.replaceChildren();

            imagensAtuais.forEach((imagem) => {
                const cartao = document.createElement('div');
                cartao.className = 'card';
                cartao.style.width = '150px';

                const img = document.createElement('img');
                img.className = 'card-img-top';
                img.alt = imagem.nome;
                img.style.height = '110px';
                img.style.objectFit = 'cover';
                cartao.appendChild(img);

                const corpo = document.createElement('div');
                corpo.className = 'card-body p-2';
                const nome = document.createElement('div');
                nome.className = 'small text-truncate mb-2';
                nome.textContent = imagem.nome;
                corpo.appendChild(nome);

                const excluir = document.createElement('button');
                excluir.type = 'button';
                excluir.className = 'btn btn-sm btn-outline-danger';
                excluir.textContent = 'Remover';
                excluir.addEventListener('click', async () => {
                    excluir.disabled = true;
                    try {
                        await requisitar(
                            `/${recurso}/${encodeURIComponent(entidadeId)}/imagens/${encodeURIComponent(imagem.id)}`,
                            { method: 'DELETE' },
                        );
                        imagensAtuais = imagensAtuais.filter((item) => item.id !== imagem.id);
                        houveRemocao = true;
                        renderizar();
                    } catch (error) {
                        excluir.disabled = false;
                        aoErro(error.message);
                    }
                });
                corpo.appendChild(excluir);
                cartao.appendChild(corpo);
                galeria.appendChild(cartao);

                carregarArquivo(
                    `/${recurso}/${encodeURIComponent(entidadeId)}/imagens/${encodeURIComponent(imagem.id)}`,
                )
                    .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        if (!img.isConnected) {
                            URL.revokeObjectURL(url);
                            return;
                        }
                        urlsPreview.push(url);
                        img.src = url;
                    })
                    .catch((error) => aoErro(`Não foi possível carregar "${imagem.nome}": ${error.message}`));
            });

            imagensSelecionadas.forEach((arquivo, indice) => {
                const cartao = document.createElement('div');
                cartao.className = 'card';
                cartao.style.width = '150px';

                const img = document.createElement('img');
                img.className = 'card-img-top';
                img.alt = arquivo.name;
                img.style.height = '110px';
                img.style.objectFit = 'cover';
                const url = URL.createObjectURL(arquivo);
                urlsPreview.push(url);
                img.src = url;
                cartao.appendChild(img);

                const corpo = document.createElement('div');
                corpo.className = 'card-body p-2';
                const nome = document.createElement('div');
                nome.className = 'small text-truncate mb-2';
                nome.textContent = arquivo.name;
                corpo.appendChild(nome);

                const remover = document.createElement('button');
                remover.type = 'button';
                remover.className = 'btn btn-sm btn-outline-secondary';
                remover.textContent = 'Cancelar';
                remover.addEventListener('click', () => {
                    imagensSelecionadas.splice(indice, 1);
                    renderizar();
                });
                corpo.appendChild(remover);
                cartao.appendChild(corpo);
                galeria.appendChild(cartao);
            });

            atualizarControles();
        }

        input.addEventListener('change', () => {
            const escolhidas = Array.from(input.files || []);
            input.value = '';

            const duplicadas = new Set(
                imagensSelecionadas.map((arquivo) =>
                    `${arquivo.name}:${arquivo.size}:${arquivo.lastModified}`,
                ),
            );
            const novas = escolhidas.filter((arquivo) => {
                const chave = `${arquivo.name}:${arquivo.size}:${arquivo.lastModified}`;
                if (duplicadas.has(chave)) return false;
                duplicadas.add(chave);
                return true;
            });

            if (imagensAtuais.length + imagensSelecionadas.length + novas.length > MAX_IMAGENS) {
                aoErro(`Selecione no máximo ${MAX_IMAGENS - imagensAtuais.length - imagensSelecionadas.length} imagem(ns) adicional(is).`);
                return;
            }

            const invalida = novas.find((arquivo) =>
                !arquivo.type.startsWith('image/') || arquivo.size > TAMANHO_MAXIMO,
            );
            if (invalida) {
                aoErro(invalida.size > TAMANHO_MAXIMO
                    ? `"${invalida.name}" excede o limite de 10 MB.`
                    : `"${invalida.name}" não é um arquivo de imagem.`);
                return;
            }

            imagensSelecionadas.push(...novas);
            renderizar();
        });

        return {
            get selecionadas() {
                return imagensSelecionadas;
            },
            get houveRemocao() {
                return houveRemocao;
            },
            async carregar(id) {
                entidadeId = id;
                imagensAtuais = await requisitar(
                    `/${recurso}/${encodeURIComponent(id)}/imagens`,
                ) || [];
                renderizar();
            },
            async enviar(id) {
                if (imagensSelecionadas.length === 0) return;

                const formData = new FormData();
                imagensSelecionadas.forEach((arquivo) => formData.append('imagens', arquivo));
                const token = localStorage.getItem('token');
                const resposta = await fetch(
                    `${API_URL}/${recurso}/${encodeURIComponent(id)}/imagens`,
                    {
                        method: 'POST',
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                        body: formData,
                    },
                );

                if (!resposta.ok) {
                    let detalhe = '';
                    try {
                        const erro = await resposta.json();
                        detalhe = Array.isArray(erro.message)
                            ? erro.message.join(', ')
                            : erro.message || '';
                    } catch {
                        detalhe = await resposta.text().catch(() => '');
                    }
                    throw new Error(detalhe || `Erro ${resposta.status}`);
                }

                imagensSelecionadas = [];
                await this.carregar(id);
            },
        };
    };
})();
