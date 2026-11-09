(function() {
    // Mantém as seções e os nomes usados na navegação.
    var V = ["inicio", "fundamentos", "protecao", "riscos", "teste"],
        N = {
            inicio: "Início",
            fundamentos: "Fundamentos",
            protecao: "Proteção",
            riscos: "Riscos e golpes",
            teste: "Teste-se"
        };

    function route() {
        // Mostra a seção indicada na URL e atualiza o item ativo do menu.
        var h = (location.hash || "#inicio").slice(1);
        if (V.indexOf(h) < 0) h = "inicio";
        V.forEach(function(v) {
            document.getElementById("v-" + v).classList.toggle("on", v === h)
        });
        document.querySelectorAll("#nav a").forEach(function(a) {
            a.classList.toggle("on", a.getAttribute("href") === "#" + h)
        });
        window.scrollTo(0, 0)
    }

    function mkTabs(v) {
        // Agrupa cada título e seu conteúdo em uma aba.
        var kids = Array.prototype.slice.call(v.children).filter(function(c) {
                return !c.classList.contains("ph")
            }),
            G = [],
            g = null;
        kids.forEach(function(c) {
            if (c.tagName === "H2") {
                g = {
                    t: c.getAttribute("data-t") || c.textContent,
                    e: [c]
                };
                G.push(g)
            } else if (g) g.e.push(c)
        });
        if (G.length < 2) return;
        var bar = document.createElement("div");
        bar.className = "tabs";
        var P = [],
            B = [];
        G.forEach(function(gr, i) {
            var p = document.createElement("div");
            p.className = "panel" + (i ? "" : " on");
            gr.e[0].parentNode.insertBefore(p, gr.e[0]);
            gr.e.forEach(function(x) {
                p.appendChild(x)
            });
            P.push(p);
            var b = document.createElement("button");
            b.type = "button";
            b.className = "pill" + (i ? "" : " on");
            b.textContent = gr.t;
            b.addEventListener("click", function() {
                // Ativa o painel e o botão da aba escolhida.
                P.forEach(function(q, k) {
                    q.classList.toggle("on", k === i);
                    B[k].classList.toggle("on", k === i)
                })
            });
            B.push(b);
            bar.appendChild(b)
        });
        v.querySelector(".ph").insertAdjacentElement("afterend", bar)
    }
    V.slice(1).forEach(function(n) {
        mkTabs(document.getElementById("v-" + n))
    });
    // Acrescenta botões para avançar e voltar entre as seções.
    V.forEach(function(v, i) {
        var el = document.getElementById("v-" + v),
            p = document.createElement("div");
        p.className = "pager";
        p.innerHTML = (i > 0 ? '<a href="#' + V[i - 1] + '"><button class="alt" type="button">← ' + N[V[i - 1]] + '</button></a>' : '<span></span>') + (i < V.length - 1 ? '<a href="#' + V[i + 1] + '"><button type="button">' + N[V[i + 1]] + ' →</button></a>' : '');
        el.appendChild(p)
    });
    window.addEventListener("hashchange", route);
    route();
    document.getElementById("tg").addEventListener("click", function() {
        // Alterna o tema; se ainda não houver escolha, usa a preferência do sistema.
        var r = document.documentElement,
            d = r.getAttribute("data-theme");
        if (!d) d = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
        r.setAttribute("data-theme", d === "dark" ? "light" : "dark")
    });

    function el(t, c, x) {
        // Cria um elemento e, quando informado, define sua classe e seu texto.
        var e = document.createElement(t);
        if (c) e.className = c;
        if (x != null) e.textContent = x;
        return e
    }
    /* Mostra perguntas com feedback e, opcionalmente, contabiliza as respostas. */
    function mc(root, items, withScore) {
        var done = 0,
            ok = 0,
            sc = el("p", "muted");
        items.forEach(function(q, i) {
            var d = el("div", "q");
            d.appendChild(el("p", q.msg ? "msg" : "", (q.msg ? "" : (i + 1) + ". ") + q.q));
            var fb = el("div"),
                got = false;
            q.o.forEach(function(t, k) {
                var b = el("button", "opt", t);
                b.type = "button";
                b.addEventListener("click", function() {
                    fb.className = "fb " + (k === q.a ? "good" : "bad");
                    fb.textContent = (k === q.a ? "Correto. " : "Não é essa. ") + q.e;
                    // Conta cada pergunta apenas uma vez, mesmo que a resposta mude.
                    if (!got) {
                        got = true;
                        done++;
                        if (k === q.a) ok++;
                        if (withScore) sc.textContent = "Respondidas: " + done + " de " + items.length + " · Acertos: " + ok
                    }
                });
                d.appendChild(b)
            });
            d.appendChild(fb);
            root.appendChild(d)
        });
        if (withScore) {
            root.appendChild(sc)
        }
    }
    mc(document.getElementById("quiz"), [{
        q: "Qual princípio garante que só pessoas autorizadas acessam a informação?",
        o: ["Integridade", "Confidencialidade", "Disponibilidade"],
        a: 1,
        e: "Confidencialidade. Integridade trata de alteração indevida; disponibilidade, de acesso quando necessário."
    }, {
        q: "Usar a mesma senha em várias contas é um exemplo de:",
        o: ["Ameaça", "Vulnerabilidade", "Risco"],
        a: 1,
        e: "Vulnerabilidade: é a fraqueza. A ameaça é quem tenta explorá-la; o risco é a chance de isso causar prejuízo."
    }, {
        q: "O que um sistema bem projetado guarda no lugar da sua senha?",
        o: ["A senha, em arquivo de texto", "O hash da senha", "A senha cifrada de forma reversível, para enviar por e-mail"],
        a: 1,
        e: "O hash. Ele permite comparar a senha digitada sem guardar a senha. Teste no Laboratório de senhas."
    }, {
        q: "Por que o 2FA ajuda quando a senha vaza?",
        o: ["Troca a senha automaticamente", "Exige uma segunda verificação além da senha", "Apaga a conta vazada"],
        a: 1,
        e: "Quem tem só a senha ainda precisa do segundo fator, como o código do aplicativo autenticador."
    }, {
        q: "Um “atendente do banco” pede o código que chegou por SMS. O que fazer?",
        o: ["Informar, pois ele é do banco", "Não informar e ligar para o número oficial do banco", "Informar só os três primeiros dígitos"],
        a: 1,
        e: "Códigos de verificação são confidenciais. O banco não precisa que você o leia em voz alta."
    }, {
        q: "Um cookie de terceiros é definido por:",
        o: ["O próprio site visitado", "Um domínio diferente do visitado", "O sistema operacional"],
        a: 1,
        e: "Cookies de terceiros vêm de outro domínio, como publicidade ou ferramentas incorporadas."
    }, {
        q: "Qual afirmação distingue segurança de privacidade?",
        o: ["São sinônimos", "Segurança protege os dados; privacidade trata do controle e do uso adequado das informações pessoais", "Privacidade só existe fora da internet"],
        a: 1,
        e: "São conceitos relacionados, mas diferentes."
    }, {
        q: "Na LGPD, quem é o titular?",
        o: ["Quem decide sobre o tratamento", "A pessoa a quem os dados pertencem", "A autoridade que fiscaliza"],
        a: 1,
        e: "Controlador decide sobre o tratamento; ANPD fiscaliza."
    }], true);
    // Apresenta exemplos de mensagens para identificar golpes.
    mc(document.getElementById("scam"), [{
        msg: 1,
        q: "SMS: “Sua encomenda está retida. Pague a taxa de R$ 7,90 em entrega-taxa.example/pagar para liberar.”",
        o: ["Golpe", "Parece legítima"],
        a: 0,
        e: "Smishing: cobrança inesperada com link de domínio desconhecido. Consulte o rastreio no site oficial, digitado por você."
    }, {
        msg: 1,
        q: "Ligação: “Aqui é do seu banco. Houve movimentação suspeita. Informe o código que acabou de chegar por SMS para cancelarmos.”",
        o: ["Golpe", "Parece legítima"],
        a: 0,
        e: "Vishing: código de verificação é confidencial. Encerre e ligue para o número impresso no cartão."
    }, {
        msg: 1,
        q: "Mensagem de número novo, com foto da sua prima: “Troquei de número. Pode fazer um Pix urgente? Pago amanhã.”",
        o: ["Golpe", "Parece legítima"],
        a: 0,
        e: "Falsidade de identidade: confirme por ligação ou outro contato já conhecido antes de transferir."
    }, {
        msg: 1,
        q: "Anúncio de celular novo por 70% abaixo do preço normal, com pagamento só por Pix “até hoje”.",
        o: ["Golpe", "Parece legítima"],
        a: 0,
        e: "Preço muito abaixo do normal e pressão de prazo são sinais de alerta de compra fraudulenta."
    }, {
        msg: 1,
        q: "Você pede a redefinição de senha em um site e recebe, na hora, um e-mail com o link de redefinição.",
        o: ["Golpe", "Parece legítima"],
        a: 1,
        e: "Foi você quem iniciou o pedido, então é esperado. Ainda assim, confira o domínio do link; sem pedido prévio, desconfie."
    }, {
        msg: 1,
        q: "Você abre o aplicativo do banco por conta própria e vê um aviso de novo acesso em outro aparelho. O aviso não pede dado nem dinheiro.",
        o: ["Golpe", "Parece legítima"],
        a: 1,
        e: "Baixo risco por não haver pedido de dados, mas revise os acessos e troque a senha se não reconhecer o aparelho."
    }], true);
    mc(document.getElementById("url"), [{
        q: "O endereço oficial do “Banco Exemplo” é banco-exemplo.example. Qual link leva a ele?",
        o: ["https://banco-exemplo.example/login", "https://banco-exemplo.example.seguranca-acesso.example/login", "https://banco-exemplo-seguro.example/login", "http://banco-exemp1o.example/login"],
        a: 0,
        e: "Leia o domínio da direita para a esquerda, até a primeira “/”. Na opção 2, o domínio real é seguranca-acesso.example: “banco-exemplo.example” é só um subdomínio. Na 3, o domínio é outro. Na 4, há um “1” no lugar do “l” e falta o HTTPS."
    }, {
        q: "O cadeado do navegador (HTTPS) prova que o site é legítimo?",
        o: ["Sim, sempre", "Não: indica conexão cifrada, mas qualquer site pode ter HTTPS", "Só em sites de banco"],
        a: 1,
        e: "O TLS protege o trajeto dos dados. Um site falso também pode ter certificado, por isso confira o domínio."
    }], false);
    /* Analisa uma senha fictícia localmente no navegador. */
    var pw = document.getElementById("pw");

    function sha(t) {
        // Calcula o hash SHA-256 sem enviar o texto para um servidor.
        return crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)).then(function(b) {
            return new Uint8Array(b)
        })
    }

    function hex(a) {
        // Converte os bytes do hash para uma sequência hexadecimal.
        return Array.from(a).map(function(x) {
            return x.toString(16).padStart(2, "0")
        }).join("")
    }

    function tempo(s) {
        // Exibe uma estimativa de tempo em uma unidade fácil de ler.
        if (s < 1) return "menos de 1 segundo";
        var u = [
                ["segundos", 60],
                ["minutos", 60],
                ["horas", 24],
                ["dias", 365],
                ["anos", 1e3],
                ["milhares de anos", 1e3],
                ["milhões de anos", 1e30]
            ],
            v = s;
        for (var i = 0; i < u.length; i++) {
            if (v < u[i][1]) return "cerca de " + Math.round(v).toLocaleString("pt-BR") + " " + u[i][0];
            v /= u[i][1]
        }
        return "mais de um bilhão de anos"
    }
    var seq = /(0123|1234|2345|3456|4567|5678|6789|abcd|qwer|asdf|zxcv)/i,
        comum = /(123456|password|senha|admin|qwerty|abc123|iloveyou|111111)/i;
    pw.addEventListener("input", function() {
        // Atualiza os critérios, o nível estimado e os hashes ao digitar.
        var s = pw.value,
            n = s.length,
            up = /[A-Z]/.test(s),
            lo = /[a-z]/.test(s),
            di = /[0-9]/.test(s),
            sy = /[^A-Za-z0-9]/.test(s);
        var R = [
            ["12 ou mais caracteres", n >= 12],
            ["Letra maiúscula", up],
            ["Letra minúscula", lo],
            ["Número", di],
            ["Símbolo", sy],
            ["Sem sequência óbvia (1234, qwer, abcd)", n > 0 && !seq.test(s)],
            ["Sem padrão comum (senha, 123456, admin)", n > 0 && !comum.test(s)]
        ];
        var ul = document.getElementById("rules");
        ul.innerHTML = "";
        R.forEach(function(r) {
            var li = el("li", r[1] ? "ok" : "", r[0]);
            ul.appendChild(li)
        });
        var tipos = up + lo + di + sy,
            m = document.getElementById("mt"),
            lv = document.getElementById("lv");
        if (!n) {
            m.style.width = "0";
            lv.textContent = "Aguardando entrada";
            document.getElementById("ent").textContent = "";
            document.getElementById("h1").textContent = "…";
            document.getElementById("h2").textContent = "…";
            document.getElementById("diff").textContent = "";
            return
        }
        var nivel, cor, w;
        if (n >= 12 && up && lo && di && sy && R[5][1] && R[6][1]) {
            nivel = "Forte";
            cor = "var(--ok)";
            w = 100
        } else if (n >= 8 && tipos >= 3 && R[6][1]) {
            nivel = "Média";
            cor = "var(--warn)";
            w = 60
        } else {
            nivel = "Fraca";
            cor = "var(--bad)";
            w = 25
        }
        m.style.width = w + "%";
        m.style.background = cor;
        lv.textContent = "Nível: " + nivel;
        var pool = (lo ? 26 : 0) + (up ? 26 : 0) + (di ? 10 : 0) + (sy ? 33 : 0),
            bits = n * Math.log2(pool || 1);
        // Compara o hash da senha com o de uma versão terminada em "1".
        document.getElementById("ent").textContent = "Entropia estimada (calculada): " + Math.round(bits) + " bits. Tempo médio para adivinhar por tentativas em ordem aleatória: " + tempo(Math.pow(2, bits) / 2 / 1e10) + ".";
        Promise.all([sha(s), sha(s + "1")]).then(function(r) {
            document.getElementById("h1").textContent = hex(r[0]);
            document.getElementById("h2").textContent = hex(r[1]);
            var d = 0;
            for (var i = 0; i < 32; i++) {
                var x = r[0][i] ^ r[1][i];
                while (x) {
                    d += x & 1;
                    x >>= 1
                }
            }
            document.getElementById("diff").textContent = "Os dois hashes diferem em " + d + " de 256 bits."
        }).catch(function() {
            document.getElementById("h1").textContent = "indisponível neste navegador"
        })
    });
    /* Simula códigos temporários de autenticação usados em 2FA (TOTP). */
    var enc = new TextEncoder().encode("segredo-de-demonstracao"),
        cur = "";

    function totp() {
        // Gera um código usando o segredo de demonstração e janelas de 30 segundos.
        var c = Math.floor(Date.now() / 30000),
            b = new ArrayBuffer(8);
        new DataView(b).setUint32(4, c);
        return crypto.subtle.importKey("raw", enc, {
            name: "HMAC",
            hash: "SHA-1"
        }, false, ["sign"]).then(function(k) {
            return crypto.subtle.sign("HMAC", k, b)
        }).then(function(r) {
            var h = new Uint8Array(r),
                o = h[19] & 15,
                n = ((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
            return {
                code: String(n % 1000000).padStart(6, "0"),
                c: c,
                o: o
            }
        })
    }

    function tick() {
        // Atualiza o código e o tempo restante enquanto a seção de teste está aberta.
        if (location.hash !== "#teste") return;
        totp().then(function(r) {
            cur = r.code;
            var left = 30 - Math.floor(Date.now() / 1000) % 30;
            document.getElementById("otp").textContent = r.code;
            document.getElementById("otm").style.width = (left / 30 * 100) + "%";
            document.getElementById("otd").textContent = "Contador: " + r.c + " · deslocamento (4 últimos bits do HMAC): " + r.o + " · expira em " + left + " s"
        }).catch(function() {
            document.getElementById("otd").textContent = "Web Crypto indisponível neste navegador."
        })
    }
    setInterval(tick, 1000);
    tick();
    window.addEventListener("hashchange", tick);
    document.getElementById("ob").addEventListener("click", function() {
        // Compara o código digitado com o código válido neste instante.
        var f = document.getElementById("of"),
            v = document.getElementById("oin").value.trim();
        totp().then(function(r) {
            var ok = v === r.code;
            f.className = "fb " + (ok ? "good" : "bad");
            f.textContent = ok ? "Acesso liberado: senha correta e código válido." : "Acesso negado: a senha está correta, mas o código não confere. Quem tem só a senha não entra."
        })
    })
    /* Monta o exercício de associar cada termo à sua definição. */
    var T = [
        ["Phishing", "Fraude que imita serviços conhecidos para obter dados e credenciais."],
        ["Hash", "Sequência de tamanho fixo calculada a partir de um texto, sem operação inversa viável."],
        ["Cookie", "Pequeno registro guardado pelo navegador durante a navegação."],
        ["Fingerprinting", "Identificação de um dispositivo por características do navegador e do aparelho."],
        ["2FA", "Segunda verificação de identidade além da senha."],
        ["Credential stuffing", "Tentativa automatizada de entrar em serviços com credenciais já expostas."]
    ];
    var mt = document.getElementById("match"),
        // Ordena as definições pelo tamanho do texto.
        defs = T.map(function(t) {
            return t[1]
        }).slice().sort(function(a, b) {
            return a.length - b.length
        }),
        sel = [];
    T.forEach(function(t, i) {
        var p = el("div", "pair");
        p.appendChild(el("b", null, t[0]));
        var s = el("select");
        var o0 = el("option", null, "Escolha a definição");
        o0.value = "";
        s.appendChild(o0);
        defs.forEach(function(d) {
            var o = el("option", null, d);
            o.value = d;
            s.appendChild(o)
        });
        p.appendChild(s);
        sel.push(s);
        mt.appendChild(p)
    });
    var cb = el("button", null, "Verificar");
    cb.type = "button";
    var mf = el("div");
    cb.addEventListener("click", function() {
        // Verifica todas as escolhas e destaca as respostas corretas.
        var n = 0;
        sel.forEach(function(s, i) {
            var ok = s.value === T[i][1];
            if (ok) n++;
            s.style.borderColor = s.value ? (ok ? "var(--ok)" : "var(--bad)") : "var(--line)"
        });
        mf.className = "fb " + (n === T.length ? "good" : "bad");
        mf.textContent = n + " de " + T.length + " corretos." + (n < T.length ? " Os campos em vermelho estão errados." : " Todos corretos.")
    });
    mt.appendChild(cb);
    mt.appendChild(mf);
    /* Cada exemplo reúne ícone, nome, mensagem, alertas e orientação. */
    var GP = [
        ["mail", "Phishing", "E-mail", "Sua conta será bloqueada hoje. Atualize os dados em banco-seguro.example/atualizar.", ["Ameaça de bloqueio", "Urgência", "Link fora do canal oficial"], "Abra o site ou o app do banco digitando o endereço, sem usar o link."],
        ["sms", "Smishing", "SMS", "Encomenda retida. Pague a taxa de R$ 7,90 para liberar: entrega-taxa.example/pagar", ["Cobrança inesperada", "Domínio desconhecido"], "Consulte o rastreio no site oficial da transportadora."],
        ["call", "Vishing", "Ligação", "Houve movimentação suspeita na sua conta. Informe o código que chegou por SMS.", ["Pede código de verificação", "Pressa"], "Desligue e ligue para o número oficial do banco."],
        ["mask", "Perfil falso", "Mensagem", "Oi, troquei de número! Preciso de um Pix urgente, devolvo amanhã.", ["Número novo", "Pedido de dinheiro", "Emergência"], "Confirme por ligação ou por outro contato que você já tem."],
        ["cart", "Compras", "Anúncio", "Celular novo com 70% de desconto. Só hoje!", ["Preço muito abaixo do normal", "Prazo curto", "Vendedor sem informações confiáveis"], "Pesquise a reputação do vendedor e confirme que o site é oficial."],
        ["coin", "Pix", "Mensagem", "Fiz um Pix para você por engano. Pode devolver para esta outra conta?", ["Conta diferente da origem", "Pedido de devolução"], "Confira os dados da transação e use o procedimento oficial do banco."],
        ["robot", "IA e deepfake", "Áudio", "(voz parecida com a do seu pai) Filho, estou em apuros. Faz uma transferência agora.", ["Voz conhecida, pedido incomum", "Urgência"], "Confirme por outro meio, mesmo com voz ou imagem conhecidas."]
    ];
    var gt = document.getElementById("gpt"),
        gv = document.getElementById("gpv"),
        gb = [];

    function showG(i) {
        // Exibe o exemplo selecionado e seus sinais de alerta.
        var g = GP[i];
        gb.forEach(function(b, k) {
            b.classList.toggle("on", k === i)
        });
        gv.innerHTML = "";
        gv.appendChild(el("p", "muted", "Canal: " + g[2]));
        gv.appendChild(el("div", "m", g[3]));
        var c = el("div", "chips");
        g[4].forEach(function(x) {
            c.appendChild(el("span", "chip s", x))
        });
        gv.appendChild(c);
        var f = el("div", "fb good", "O que fazer: " + g[5]);
        gv.appendChild(f)
    }
    GP.forEach(function(g, i) {
        var b = el("button", "pill");
        b.type = "button";
        b.innerHTML = '<svg class="ico s" aria-hidden="true"><use href="#i-' + g[0] + '"/></svg> ' + g[1];
        b.addEventListener("click", function() {
            showG(i)
        });
        gb.push(b);
        gt.appendChild(b)
    });
    showG(0);
    /* Explica os sinais de alerta ao selecionar partes do e-mail fictício. */
    var AN = [
        "Remetente: o domínio é parecido com o do banco, mas não é o oficial. Confira o endereço completo, não só o nome exibido.",
        "Assunto: “urgente” e “bloqueada” criam medo e pressa, e a pressa impede a verificação.",
        "Prazo: o limite de 2 horas existe para tirar o tempo de conferir. Instituições reais têm canais oficiais para consulta.",
        "Botão: passe o cursor ou segure o dedo para ver o endereço real antes de clicar. Na dúvida, abra o site digitando o endereço."
    ];
    var hs = document.querySelectorAll(".hot");
    hs.forEach(function(h) {
        h.addEventListener("click", function() {
            hs.forEach(function(x) {
                x.classList.remove("on")
            });
            h.classList.add("on");
            var a = document.getElementById("ana");
            a.className = "fb bad";
            a.textContent = AN[+h.getAttribute("data-i")]
        })
    });
})();
