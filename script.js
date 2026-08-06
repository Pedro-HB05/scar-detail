"use strict";

function iniciarSite() {
    const cabecalho = document.querySelector("#cabecalho");
    const menu = document.querySelector("#menu");
    const menuBotao = document.querySelector("#menuBotao");

    const formulario = document.querySelector("#formularioOrcamento");
    const formularioStatus = document.querySelector("#formularioStatus");
    const campoTelefone = document.querySelector("#telefone");

    const linksMenu = document.querySelectorAll("#menu a");
    const linksWhatsapp = document.querySelectorAll(".js-whatsapp-link");

    const numeroPadrao = "5541984356345";

    const whatsappNumero = (
        document.body.dataset.whatsappNumber ||
        numeroPadrao
    ).replace(/\D/g, "");

    // =========================
    // VALIDAÇÃO DO WHATSAPP
    // =========================

    function whatsappValido(numero) {
        return /^55\d{10,11}$/.test(numero);
    }

    // =========================
    // CABEÇALHO
    // =========================

    function atualizarCabecalho() {
        if (!cabecalho) return;

        cabecalho.classList.toggle(
            "rolagem",
            window.scrollY > 40
        );
    }

    // =========================
    // MENU MOBILE
    // =========================

    function definirEstadoMenu(aberto) {
        if (!menu || !menuBotao) return;

        menu.classList.toggle("ativo", aberto);

        cabecalho?.classList.toggle(
            "menu-visivel",
            aberto
        );

        document.body.classList.toggle(
            "menu-aberto",
            aberto
        );

        menuBotao.setAttribute(
            "aria-expanded",
            String(aberto)
        );

        menuBotao.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

        const icone = menuBotao.querySelector("i");

        if (icone) {
            icone.classList.toggle(
                "fa-bars",
                !aberto
            );

            icone.classList.toggle(
                "fa-xmark",
                aberto
            );
        }
    }

    function configurarMenu() {
        if (!menu || !menuBotao) return;

        menuBotao.addEventListener("click", () => {
            const menuAberto =
                menu.classList.contains("ativo");

            definirEstadoMenu(!menuAberto);
        });

        linksMenu.forEach((link) => {
            link.addEventListener("click", () => {
                definirEstadoMenu(false);
            });
        });

        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") {
                definirEstadoMenu(false);
            }
        });

        document.addEventListener("click", (evento) => {
            const elementoClicado = evento.target;

            if (!(elementoClicado instanceof Node)) {
                return;
            }

            const clicouNoMenu =
                menu.contains(elementoClicado);

            const clicouNoBotao =
                menuBotao.contains(elementoClicado);

            if (!clicouNoMenu && !clicouNoBotao) {
                definirEstadoMenu(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                definirEstadoMenu(false);
            }
        });
    }

    // =========================
    // ROLAGEM SUAVE
    // =========================

    function configurarRolagemSuave() {
        const linksInternos =
            document.querySelectorAll('a[href^="#"]');

        linksInternos.forEach((link) => {
            link.addEventListener("click", (evento) => {
                const seletor =
                    link.getAttribute("href");

                if (!seletor || seletor === "#") {
                    return;
                }

                const destino =
                    document.querySelector(seletor);

                if (!destino) {
                    return;
                }

                evento.preventDefault();

                destino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        });
    }

    // =========================
    // ANIMAÇÕES
    // =========================

    function configurarAnimacoes() {
        const elementos =
            document.querySelectorAll(".revelar");

        if (elementos.length === 0) {
            return;
        }

        if (!("IntersectionObserver" in window)) {
            elementos.forEach((elemento) => {
                elemento.classList.add("visivel");
            });

            return;
        }

        const observador = new IntersectionObserver(
            (entradas, observer) => {
                entradas.forEach((entrada) => {
                    if (!entrada.isIntersecting) {
                        return;
                    }

                    entrada.target.classList.add(
                        "visivel"
                    );

                    observer.unobserve(
                        entrada.target
                    );
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        elementos.forEach((elemento) => {
            observador.observe(elemento);
        });
    }

    // =========================
    // LINKS DO WHATSAPP
    // =========================

    function configurarWhatsapp() {
        if (!whatsappValido(whatsappNumero)) {
            console.error(
                "Número do WhatsApp inválido:",
                whatsappNumero
            );

            return;
        }

        linksWhatsapp.forEach((link) => {
            link.setAttribute(
                "href",
                `https://wa.me/${whatsappNumero}`
            );

            link.setAttribute(
                "target",
                "_blank"
            );

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );
        });
    }

    // =========================
    // MÁSCARA DO TELEFONE
    // =========================

    function formatarTelefone(valor) {
        const numeros = valor
            .replace(/\D/g, "")
            .slice(0, 11);

        if (numeros.length <= 2) {
            return numeros;
        }

        if (numeros.length <= 6) {
            return numeros.replace(
                /^(\d{2})(\d+)/,
                "($1) $2"
            );
        }

        if (numeros.length <= 10) {
            return numeros.replace(
                /^(\d{2})(\d{4})(\d+)/,
                "($1) $2-$3"
            );
        }

        return numeros.replace(
            /^(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );
    }

    function configurarMascaraTelefone() {
        if (!campoTelefone) return;

        campoTelefone.addEventListener(
            "input",
            () => {
                campoTelefone.value =
                    formatarTelefone(
                        campoTelefone.value
                    );
            }
        );
    }

    // =========================
    // STATUS DO FORMULÁRIO
    // =========================

    function mostrarStatus(mensagem, tipo = "") {
        if (!formularioStatus) return;

        formularioStatus.textContent = mensagem;

        formularioStatus.classList.remove(
            "sucesso",
            "erro"
        );

        if (tipo) {
            formularioStatus.classList.add(tipo);
        }
    }

    // =========================
    // FORMULÁRIO
    // =========================

    function configurarFormulario() {
        if (!formulario) {
            console.error(
                "Formulário #formularioOrcamento não encontrado."
            );

            return;
        }

        formulario.addEventListener(
            "submit",
            (evento) => {
                evento.preventDefault();

                mostrarStatus("");

                if (!formulario.reportValidity()) {
                    return;
                }

                if (!whatsappValido(whatsappNumero)) {
                    mostrarStatus(
                        "O número do WhatsApp está inválido.",
                        "erro"
                    );

                    return;
                }

                const dados =
                    new FormData(formulario);

                const nome = String(
                    dados.get("nome") || ""
                ).trim();

                const telefone = String(
                    dados.get("telefone") || ""
                ).trim();

                const servico = String(
                    dados.get("servico") || ""
                ).trim();

                if (!nome || !telefone || !servico) {
                    mostrarStatus(
                        "Preencha todos os campos.",
                        "erro"
                    );

                    return;
                }

                const mensagem = [
                    "Olá! Gostaria de solicitar um orçamento.",
                    "",
                    `Nome: ${nome}`,
                    `Telefone: ${telefone}`,
                    `Serviço desejado: ${servico}`
                ].join("\n");

                const urlWhatsapp =
                    `https://wa.me/${whatsappNumero}` +
                    `?text=${encodeURIComponent(mensagem)}`;

                mostrarStatus(
                    "Abrindo o WhatsApp...",
                    "sucesso"
                );

                /*
                 * Primeiro tenta abrir em uma nova aba.
                 * Caso o navegador bloqueie, abre na aba atual.
                 */
                const novaAba = window.open(
                    urlWhatsapp,
                    "_blank"
                );

                if (novaAba) {
                    novaAba.opener = null;

                    formulario.reset();

                    mostrarStatus(
                        "WhatsApp aberto com sucesso.",
                        "sucesso"
                    );

                    return;
                }

                window.location.assign(urlWhatsapp);
            }
        );
    }

    // =========================
    // ANO AUTOMÁTICO
    // =========================

    function configurarAnoAtual() {
        const copy =
            document.querySelector("#copy");

        if (!copy) return;

        copy.textContent =
            `© ${new Date().getFullYear()} ` +
            "SCAR Detail. Todos os direitos reservados.";
    }

    // =========================
    // SEÇÃO ATIVA NO MENU
    // =========================

    function configurarSecaoAtiva() {
        const secoes =
            document.querySelectorAll("main section[id]");

        if (
            secoes.length === 0 ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        const observador = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (!entrada.isIntersecting) {
                        return;
                    }

                    const secaoId =
                        entrada.target.id;

                    linksMenu.forEach((link) => {
                        const linkAtivo =
                            link.getAttribute("href") ===
                            `#${secaoId}`;

                        link.classList.toggle(
                            "ativo",
                            linkAtivo
                        );
                    });
                });
            },
            {
                rootMargin:
                    "-40% 0px -50% 0px",
                threshold: 0
            }
        );

        secoes.forEach((secao) => {
            observador.observe(secao);
        });
    }

    // =========================
    // INICIALIZAÇÃO
    // =========================

    atualizarCabecalho();
    configurarMenu();
    configurarRolagemSuave();
    configurarAnimacoes();
    configurarWhatsapp();
    configurarMascaraTelefone();
    configurarFormulario();
    configurarAnoAtual();
    configurarSecaoAtiva();

    window.addEventListener(
        "scroll",
        atualizarCabecalho,
        {
            passive: true
        }
    );
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarSite
    );
} else {
    iniciarSite();
}