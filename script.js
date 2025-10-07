lucide.createIcons();

const projects = [
    {
        id: 1,
        title: 'Sistema de Integração de Vendas com ERP Protheus',
        shortDescription: 'Microsserviço para integrar dados de vendas do PDV com o ERP TOTVS Protheus.',
        fullDescription: `Este projeto foi desenvolvido para o Grupo Madero com o objetivo de substituir um sistema legado de integração de vendas, modernizando e otimizando o fluxo de informações entre os pontos de venda (PDV) e o ERP TOTVS Protheus. Como resultado, o tempo para uma venda ser registrada no ERP foi drasticamente reduzido, passando da madrugada do dia seguinte para um máximo de 40 minutos após a emissão.
<br /><br />Atuei como peça-chave na concepção e desenvolvimento da nova solução, baseada em microsserviços em .NET. Fui responsável por provisionar e gerenciar toda a infraestrutura na nuvem utilizando Terraform, incluindo a criação de recursos essenciais como Azure Functions e Azure Service Bus.
<br /><br />No desenvolvimento da aplicação, minhas contribuições incluíram a modelagem do banco de dados em SQL Server para persistir os dados de vendas. O núcleo da solução é a integração direta com o Protheus, para a qual construí um serviço que realiza uma série de validações cruciais (consistência de itens, valores, dados fiscais). Para garantir a integridade dos dados, implementei uma robusta administração de rollback para pedidos de venda e documentos de saída. Adicionalmente, desenvolvi rotas específicas na API, incluindo uma para o cancelamento de vendas e outras para consultas em tempo real de Inventário e Calendário Contábil diretamente no Protheus.
<br /><br />A nova arquitetura não só trouxe a performance mencionada, mas também otimizou o fechamento de caixa e a gestão de estoque, reduzindo inconsistências e trabalho manual.`,
        images: ['./assets/projects/sales/fluxo_integracao.png', './assets/projects/sales/ciclo_de_vida.png', './assets/projects/sales/banco_de_dados.jpeg']
    },
    {
        id: 2,
        title: 'Sistema de Monitoramento Logístico com Notificações',
        shortDescription: 'Aplicação para gerenciar viagens e monitorar entregas.',
        fullDescription: 'Desenvolvimento do back-end completo de um sistema que realiza o controle e monitoramento de caminhões de uma empresa que realiza entregas em todo o Brasil. O sistema conta com controle de entregas, viagens, notificações via Telegram e monitoramento dos veículos integrado com o sistema terceiro responsável pelo rastreamento dos veículos.',
        images: ['./assets/projects/logistics/telegram.png']
    },
    {
        id: 3,
        title: 'Plataforma de Pesquisa de Clima Organizacional Anônima e Segura',
        shortDescription: 'Aplicação para pesquisas de clima, garantindo anonimato e controle de acesso para mais de 8.000 colaboradores.',
        fullDescription: `Este projeto foi concebido para executar uma pesquisa de clima organizacional em uma empresa de grande porte (+8.000 colaboradores), com dois requisitos críticos e conflitantes: garantir que cada colaborador pudesse responder apenas uma vez e, ao mesmo tempo, assegurar o completo anonimato de suas respostas.
<br /><br />A solução implementada consiste em um portal web onde o colaborador inicia o processo validando sua identidade com o CPF. O sistema então dispara um token de acesso único e de curta duração via SMS para o número de telefone cadastrado. Para aumentar a segurança e o controle, a geração de um novo token invalida automaticamente todos os anteriores associados àquele CPF.
<br /><br />O ponto-chave da arquitetura é a dissociação total entre os dados de controle e os dados da pesquisa. Enquanto uma tabela de controle registra quais colaboradores já participaram (para evitar duplicidade), as respostas são armazenadas em uma tabela separada, sem qualquer chave estrangeira ou vínculo que permita identificar o respondente.
<br /><br />Ao final, a plataforma consolida os dados de forma anônima e os segmenta por área e nível de gestão, permitindo que o RH e a liderança extraiam insights estratégicos valiosos para a tomada de decisão, com a confiança de que a privacidade dos colaboradores foi integralmente preservada.`,
        images: ['./assets/projects/survey/banco_de_dados.png']
    },
    {
        id: 4,
        title: 'Processamento Assíncrono de Batidas de Ponto',
        shortDescription: 'Aplicação para gerenciar batidas de ponto de funcionários.',
        fullDescription: `Este projeto foi desenvolvido para resolver o desafio de integrar e processar de forma confiável um alto volume de batidas de ponto geradas pela plataforma PontoMais. A solução implementa uma arquitetura orientada a eventos, garantindo escalabilidade e desacoplamento entre os serviços.
<br /><br />O fluxo se inicia com o recebimento das batidas em tempo real através de um webhook. Para garantir que nenhuma informação seja perdida, mesmo em momentos de pico ou instabilidade dos sistemas, cada batida é imediatamente enfileirada em uma fila de mensagens (Message Queue).
<br /><br />Um serviço consumidor assíncrono, atuando de forma independente, processa as mensagens da fila. Sua responsabilidade é enriquecer os dados recebidos: ele utiliza o CPF do colaborador para consultar a API do sistema TOTVS RM e obter a matrícula correspondente.
<br /><br />Após a validação e o enriquecimento dos dados, o registro de ponto completo é finalmente persistido em uma base de dados centralizada, servindo como uma fonte unificada e confiável para a área de Recursos Humanos. Essa abordagem assíncrona eliminou a necessidade de processos manuais, reduziu a latência e aumentou drasticamente a confiabilidade da operação.`,
        images: ['./assets/projects/timetracking/service_bus.png', './assets/projects/timetracking/banco_de_dados.png']
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projects-grid');
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const galleryControls = document.getElementById('modal-gallery-controls');
    const prevBtn = document.getElementById('prev-image-btn');
    const nextBtn = document.getElementById('next-image-btn');

    const fullscreenModal = document.getElementById('fullscreen-modal');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const closeFullscreenBtn = document.getElementById('close-fullscreen-btn');

    let currentProjectImages = [];
    let currentImageIndex = 0;

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card p-6 rounded-lg cursor-pointer group';
        card.dataset.projectId = project.id;
        card.innerHTML = `
                    <div class="flex justify-between items-center mb-4">
                        <i data-lucide="folder" class="w-10 h-10 text-slate-400 group-hover:accent-color transition-colors"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-200 group-hover:accent-color transition-colors mb-2">${project.title}</h3>
                    <p class="text-slate-400 text-sm">${project.shortDescription}</p>
                `;
        projectsGrid.appendChild(card);
    });
    lucide.createIcons();

    projectsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;

        const projectId = parseInt(card.dataset.projectId);
        const project = projects.find(p => p.id === projectId);

        if (project) {
            modalTitle.textContent = project.title;
            modalDescription.innerHTML = project.fullDescription;
            currentProjectImages = project.images;
            currentImageIndex = 0;
            updateModalImage();

            if (currentProjectImages.length > 1) {
                galleryControls.classList.remove('hidden');
                galleryControls.classList.add('flex');
            } else {
                galleryControls.classList.add('hidden');
                galleryControls.classList.remove('flex');
            }

            modal.classList.remove('modal-hidden');
            document.body.style.overflow = 'hidden';
        }
    });

    function updateModalImage() {
        modalImage.src = currentProjectImages[currentImageIndex];
    }

    function closeModal() {
        modal.classList.add('modal-hidden');
        document.body.style.overflow = 'auto';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
        updateModalImage();
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
        updateModalImage();
    });

    function openFullscreenModal() {
        if (modalImage.src) {
            fullscreenImage.src = modalImage.src;
            fullscreenModal.classList.remove('modal-hidden');
        }
    }

    function closeFullscreenModal() {
        fullscreenModal.classList.add('modal-hidden');
    }

    modalImage.addEventListener('click', openFullscreenModal);
    closeFullscreenBtn.addEventListener('click', closeFullscreenModal);
    fullscreenModal.addEventListener('click', (e) => {
        if (e.target === fullscreenModal) {
            closeFullscreenModal();
        }
    });


    const gradient = document.getElementById('cursor-gradient');
    window.addEventListener('mousemove', e => {
        gradient.style.setProperty('--x', e.clientX + 'px');
        gradient.style.setProperty('--y', e.clientY + 'px');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    let lastScrollY = window.scrollY;
    const nav = document.getElementById('header-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
    });
});