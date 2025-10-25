// Carrinho de compras
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        this.loadCart();
        this.bindEvents();
        this.updateCartDisplay();
    }

    bindEvents() {
        // Botões de adicionar ao carrinho
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productData = JSON.parse(e.target.getAttribute('data-product'));
                this.addItem(productData);
            });
        });

        // Carrinho flutuante
        const cartFloat = document.getElementById('cart-float');
        const cartModal = document.getElementById('cart-modal');
        const closeCart = document.querySelector('.close-cart');

        cartFloat.addEventListener('click', () => {
            cartModal.classList.add('active');
        });

        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        // Fechar modal clicando fora
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });

        // Checkout WhatsApp
        document.getElementById('checkout-whatsapp').addEventListener('click', () => {
            this.checkoutWhatsApp();
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartAnimation();
    }

    addMultipleItems(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartAnimation();
        
        // Mostrar notificação de sucesso
        this.showNotification(`${quantity}x ${product.name} adicionado(s) ao carrinho!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.total;
    }

    updateCartDisplay() {
        this.calculateTotal();
        
        // Atualizar contador do carrinho flutuante
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Atualizar modal do carrinho
        this.renderCartItems();
        
        // Atualizar total
        document.getElementById('cart-total').textContent = this.total.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    renderCartItems() {
        const cartItems = document.getElementById('cart-items');
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #cccccc; padding: 2rem;">Carrinho vazio</p>';
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="${item.image}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})} cada</div>
                    <div class="cart-item-total">Total: R$ ${(item.price * item.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item" onclick="cart.removeItem(${item.id})" title="Remover item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    showAddToCartAnimation() {
        // Criar elemento de animação
        const animation = document.createElement('div');
        animation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #25d366;
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            z-index: 3000;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
            animation: slideInOut 2s ease-in-out;
        `;
        animation.textContent = 'Produto adicionado ao carrinho!';
        
        // Adicionar CSS da animação
        if (!document.getElementById('cart-animation-style')) {
            const style = document.createElement('style');
            style.id = 'cart-animation-style';
            style.textContent = `
                @keyframes slideInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(animation);
        
        // Remover após animação
        setTimeout(() => {
            document.body.removeChild(animation);
        }, 2000);
    }

    showNotification(message) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        // Adicionar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    checkoutWhatsApp() {
        if (this.items.length === 0) {
            alert('Carrinho vazio! Adicione produtos antes de finalizar.');
            return;
        }

        // Formatar mensagem para WhatsApp
        let message = '🛒 *PEDIDO - MANUTENCELL OURO BRANCO*\n\n';
        message += 'Olá! Gostaria de finalizar a compra dos seguintes produtos:\n\n';
        
        this.items.forEach(item => {
            message += `📱 *${item.name}*\n`;
            message += `💰 Preço: R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
            message += `🔢 Quantidade: ${item.quantity}\n`;
            message += `💵 Subtotal: R$ ${(item.price * item.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\n`;
        });
        
        message += `💳 *TOTAL: R$ ${this.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}*\n\n`;
        message += 'Por favor, confirme os dados e me informe sobre a forma de pagamento e entrega.\n\n';
        message += 'Obrigado pela preferência! 🙏';

        // Número do WhatsApp da Manutencell
        const whatsappNumber = '5531982155571'; // Formato: 55 + DDD + número
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Fechar modal do carrinho
        document.getElementById('cart-modal').classList.remove('active');
    }

    saveCart() {
        localStorage.setItem('manutencell_cart', JSON.stringify(this.items));
    }

    loadCart() {
        const savedCart = localStorage.getItem('manutencell_cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }
}

// Navegação suave
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Menu mobile
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Animações de entrada
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.servico-card, .produto-card, .contato-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Formulário de contato
function initContactForm() {
    const form = document.querySelector('.contato-form form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const phone = form.querySelector('input[type="tel"]').value;
            const message = form.querySelector('textarea').value;
            
            // Formatar mensagem para WhatsApp
            let whatsappMessage = `📞 *CONTATO - MANUTENCELL OURO BRANCO*\n\n`;
            whatsappMessage += `👤 *Nome:* ${name}\n`;
            whatsappMessage += `📧 *Email:* ${email}\n`;
            whatsappMessage += `📱 *Telefone:* ${phone}\n\n`;
            whatsappMessage += `💬 *Mensagem:*\n${message}\n\n`;
            whatsappMessage += `Obrigado pelo contato! Retornaremos em breve. 🙏`;
            
            // Número do WhatsApp da Manutencell
            const whatsappNumber = '5531982155571';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Abrir WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Limpar formulário
            form.reset();
            
            // Mostrar mensagem de sucesso
            showNotification('Mensagem enviada! Redirecionando para o WhatsApp...', 'success');
        });
    }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#25d366' : '#3a7fc2'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 3000;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    // Adicionar CSS da animação se não existir
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Efeito parallax no hero
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Carrossel de celulares
function initPhoneCarousel() {
    const slides = document.querySelectorAll('.phone-slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i === index) {
                slide.classList.add('active');
            } else if (i === (index - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Iniciar carrossel
    showSlide(0);
    setInterval(nextSlide, 6000); // Muda a cada 6 segundos (mais tempo para apreciar cada celular)
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carrinho
    window.cart = new ShoppingCart();
    
    // Inicializar outras funcionalidades
    initSmoothScrolling();
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initParallax();
    initPhoneCarousel();
    
    // Adicionar CSS para menu mobile
    const mobileMenuCSS = `
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 2rem;
                transition: left 0.3s ease;
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-menu li {
                margin: 1rem 0;
            }
            
            .nav-menu a {
                font-size: 1.2rem;
                padding: 0.5rem 1rem;
            }
            
            .nav-toggle.active span:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }
            
            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .nav-toggle.active span:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = mobileMenuCSS;
    document.head.appendChild(style);
    
    console.log('Manutencell - Landing Page carregada com sucesso!');
});
