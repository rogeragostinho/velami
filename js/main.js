/* ================================================
   VELAMI - main.js
   Funções JavaScript do Website
   Disciplina: Interação Homem-Máquina
   ================================================ */


/* ------------------------------------------------
   1. MENU DE NAVEGAÇÃO RESPONSIVO (hambúrguer)
   ------------------------------------------------ */
function iniciarMenu() {
  var btnMenu = document.getElementById('btn-menu');
  var navPrincipal = document.getElementById('nav-principal');

  if (!btnMenu || !navPrincipal) return;

  btnMenu.addEventListener('click', function () {
    var estaAberto = navPrincipal.classList.contains('aberto');

    if (estaAberto) {
      navPrincipal.classList.remove('aberto');
      btnMenu.setAttribute('aria-expanded', 'false');
    } else {
      navPrincipal.classList.add('aberto');
      btnMenu.setAttribute('aria-expanded', 'true');
    }
  });

  // Fechar menu ao clicar num link (mobile)
  var links = navPrincipal.querySelectorAll('a');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      navPrincipal.classList.remove('aberto');
      btnMenu.setAttribute('aria-expanded', 'false');
    });
  });

  // Fechar menu ao clicar fora dele
  document.addEventListener('click', function (evento) {
    var clicouFora = !navPrincipal.contains(evento.target) && !btnMenu.contains(evento.target);
    if (clicouFora) {
      navPrincipal.classList.remove('aberto');
      btnMenu.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ------------------------------------------------
   2. BOTÃO VOLTAR AO TOPO
   ------------------------------------------------ */
function iniciarBotaoTopo() {
  // Criar o botão dinamicamente
  var botao = document.createElement('button');
  botao.id = 'btn-topo';
  botao.innerHTML = '&#8679;';
  botao.setAttribute('aria-label', 'Voltar ao topo da página');
  botao.title = 'Voltar ao topo';
  document.body.appendChild(botao);

  // Mostrar/esconder ao fazer scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      botao.classList.add('visivel');
    } else {
      botao.classList.remove('visivel');
    }
  });

  // Acção de clique — vai suavemente ao topo
  botao.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ------------------------------------------------
   3. MODO ESCURO (DARK MODE)
   ------------------------------------------------ */
function iniciarDarkMode() {
  var botao = document.getElementById('btn-dark-mode');
  if (!botao) return;

  // Ler preferência guardada
  var modoGuardado = localStorage.getItem('velami-dark-mode');
  if (modoGuardado === 'ativo') {
    document.body.classList.add('dark-mode');
    botao.innerHTML = '&#9728;'; // ícone sol
    botao.title = 'Modo claro';
  }

  // Alternar ao clicar
  botao.addEventListener('click', function () {
    var ativo = document.body.classList.toggle('dark-mode');

    if (ativo) {
      localStorage.setItem('velami-dark-mode', 'ativo');
      botao.innerHTML = '&#9728;';
      botao.title = 'Modo claro';
    } else {
      localStorage.setItem('velami-dark-mode', 'inativo');
      botao.innerHTML = '&#9790;';
      botao.title = 'Modo escuro';
    }
  });
}


/* ------------------------------------------------
   4. VALIDAÇÃO DE FORMULÁRIO (funções próprias)
   ------------------------------------------------ */
function validarEmail(email) {
  // Verificar se contém @ e ponto depois do @
  var partes = email.split('@');
  if (partes.length !== 2) return false;
  if (partes[0].length === 0) return false;
  if (partes[1].indexOf('.') === -1) return false;
  return true;
}

function validarTelefone(telefone) {
  // Aceitar formato angolano: +244 9XX XXX XXX ou 9XX XXX XXX
  var apenasNumeros = telefone.replace(/[\s\-\+]/g, '');
  if (apenasNumeros.length < 9) return false;
  return true;
}

function validarCampo(campo) {
  return campo.value.trim().length > 0;
}

function mostrarErro(idCampo, mensagem) {
  var campo = document.getElementById(idCampo);
  if (!campo) return;

  // Remover erro anterior
  var erroAnterior = campo.parentNode.querySelector('.msg-erro');
  if (erroAnterior) erroAnterior.remove();

  // Adicionar classe de erro
  campo.classList.add('campo-erro');

  // Criar elemento de mensagem
  var msg = document.createElement('span');
  msg.className = 'msg-erro';
  msg.textContent = mensagem;
  campo.parentNode.appendChild(msg);
}

function limparErro(idCampo) {
  var campo = document.getElementById(idCampo);
  if (!campo) return;
  campo.classList.remove('campo-erro');
  var erro = campo.parentNode.querySelector('.msg-erro');
  if (erro) erro.remove();
}

function mostrarSucesso(formulario) {
  var mensagem = document.getElementById('msg-sucesso');
  if (mensagem) {
    mensagem.style.display = 'block';
    // Esconder após 5 segundos
    setTimeout(function () {
      mensagem.style.display = 'none';
    }, 5000);
  }
  formulario.reset();
}

function iniciarValidacaoFormulario() {
  var btnEnviar = document.getElementById('btn-enviar');
  if (!btnEnviar) return;

  // Limpar erros ao digitar
  var campos = ['nome', 'email', 'telefone', 'mensagem'];
  campos.forEach(function (id) {
    var campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', function () {
        limparErro(id);
      });
    }
  });

  // Validar ao submeter
  btnEnviar.addEventListener('click', function () {
    var temErro = false;

    // Validar nome
    var nome = document.getElementById('nome');
    if (!nome || !validarCampo(nome)) {
      mostrarErro('nome', 'Por favor, introduza o seu nome.');
      temErro = true;
    } else {
      limparErro('nome');
    }

    // Validar email
    var emailVal = document.getElementById('email');
    if (!emailVal || !validarCampo(emailVal)) {
      mostrarErro('email', 'Por favor, introduza o seu email.');
      temErro = true;
    } else if (!validarEmail(emailVal.value.trim())) {
      mostrarErro('email', 'Por favor, introduza um email válido.');
      temErro = true;
    } else {
      limparErro('email');
    }

    // Validar telefone (opcional mas se preenchido deve ser válido)
    var telVal = document.getElementById('telefone');
    if (telVal && telVal.value.trim().length > 0) {
      if (!validarTelefone(telVal.value.trim())) {
        mostrarErro('telefone', 'Número de telefone inválido.');
        temErro = true;
      } else {
        limparErro('telefone');
      }
    }

    // Validar mensagem
    var msg = document.getElementById('mensagem');
    if (!msg || !validarCampo(msg)) {
      mostrarErro('mensagem', 'Por favor, escreva a sua mensagem.');
      temErro = true;
    } else if (msg.value.trim().length < 10) {
      mostrarErro('mensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
      temErro = true;
    } else {
      limparErro('mensagem');
    }

    // Se não há erros, mostrar sucesso
    if (!temErro) {
      var formulario = document.getElementById('form-contacto');
      mostrarSucesso(formulario);
    }
  });
}


/* ------------------------------------------------
   5. CARROSSEL / SLIDER (testemunhos)
   ------------------------------------------------ */
function iniciarCarrossel() {
  var carrossel = document.getElementById('carrossel-testemunhos');
  if (!carrossel) return;

  var slides = carrossel.querySelectorAll('.slide');
  var totalSlides = slides.length;
  if (totalSlides === 0) return;

  var indiceActual = 0;
  var intervalo = null;

  // Mostrar slide por índice
  function mostrarSlide(indice) {
    slides.forEach(function (slide, i) {
      slide.classList.remove('activo');
      if (i === indice) slide.classList.add('activo');
    });

    // Actualizar indicadores
    var indicadores = document.querySelectorAll('.indicador');
    indicadores.forEach(function (ind, i) {
      ind.classList.toggle('activo', i === indice);
    });
  }

  // Avançar slide
  function avancar() {
    indiceActual = (indiceActual + 1) % totalSlides;
    mostrarSlide(indiceActual);
  }

  // Recuar slide
  function recuar() {
    indiceActual = (indiceActual - 1 + totalSlides) % totalSlides;
    mostrarSlide(indiceActual);
  }

  // Iniciar rotação automática
  function iniciarAutomatico() {
    intervalo = setInterval(avancar, 5000);
  }

  function pararAutomatico() {
    clearInterval(intervalo);
  }

  // Botões de controlo
  var btnAnterior = document.getElementById('slide-anterior');
  var btnProximo = document.getElementById('slide-proximo');

  if (btnAnterior) {
    btnAnterior.addEventListener('click', function () {
      pararAutomatico();
      recuar();
      iniciarAutomatico();
    });
  }

  if (btnProximo) {
    btnProximo.addEventListener('click', function () {
      pararAutomatico();
      avancar();
      iniciarAutomatico();
    });
  }

  // Indicadores clicáveis
  var indicadores = document.querySelectorAll('.indicador');
  indicadores.forEach(function (ind, i) {
    ind.addEventListener('click', function () {
      pararAutomatico();
      indiceActual = i;
      mostrarSlide(indiceActual);
      iniciarAutomatico();
    });
  });

  // Parar ao passar o rato
  carrossel.addEventListener('mouseenter', pararAutomatico);
  carrossel.addEventListener('mouseleave', iniciarAutomatico);

  // Iniciar
  mostrarSlide(0);
  iniciarAutomatico();
}


/* ------------------------------------------------
   6. GOOGLE ANALYTICS (rastreamento)
   ------------------------------------------------ */
function iniciarAnalytics() {
  // Código de rastreamento Google Analytics (GA4)
  // Substituir 'G-XXXXXXXXXX' pelo ID real quando disponível
  var GA_ID = 'G-JPQL8826CS';

  var script1 = document.createElement('script');
  script1.async = true;
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_ID);
}


/* ------------------------------------------------
   7. PARTILHA NAS REDES SOCIAIS
   ------------------------------------------------ */
function iniciarPartilhaRedes() {
  var botoes = document.querySelectorAll('[data-partilhar]');

  botoes.forEach(function (botao) {
    botao.addEventListener('click', function () {
      var rede = botao.getAttribute('data-partilhar');
      var url = encodeURIComponent(window.location.href);
      var titulo = encodeURIComponent(document.title);
      var destino = '';

      if (rede === 'facebook') {
        destino = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
      } else if (rede === 'whatsapp') {
        destino = 'https://api.whatsapp.com/send?text=' + titulo + '%20' + url;
      } else if (rede === 'linkedin') {
        destino = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
      }

      if (destino) {
        window.open(destino, '_blank', 'width=600,height=400');
      }
    });
  });
}


/* ------------------------------------------------
   8. INICIAR TUDO quando a página carregar
   ------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function () {
  iniciarMenu();
  iniciarBotaoTopo();
  iniciarDarkMode();
  iniciarValidacaoFormulario();
  iniciarCarrossel();
  iniciarPartilhaRedes();
  // iniciarAnalytics(); // Descomentar quando tiver ID real do GA
});
