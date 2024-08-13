document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Hover effect
    const hoverElements = document.querySelectorAll('.hover-effect');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05)';
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    });

    // Existing code
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Formulário enviado com sucesso!');
            contactForm.reset();
        });
    }

    // Cookie Consent
    const cookieConsent = {
        init: function() {
            this.showPopup();
            this.bindEvents();
        },
        showPopup: function() {
            let popup = document.getElementById('cookie-consent');
            if (!popup) {
                popup = document.createElement('div');
                popup.id = 'cookie-consent';
                popup.innerHTML = `
                    <div class="cc-content">
                        <button id="cc-close" class="cc-close">&times;</button>
                        <p>Usamos cookies e softwares de terceiros em nosso site para ver como você interage com ele. Ao aceitar, você concorda com o uso. Para saber mais, confira nossos termos.</p>
                        <a href="#" id="cc-more">Saiba mais</a>
                        <div class="cc-buttons">
                            <button id="cc-deny">Negar</button>
                            <button id="cc-accept">Aceito</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(popup);
                this.bindEvents();
            }
            popup.style.display = 'block';
        },
        bindEvents: function() {
            const acceptBtn = document.getElementById('cc-accept');
            const denyBtn = document.getElementById('cc-deny');
            const moreLink = document.getElementById('cc-more');
            const floatingBtn = document.querySelector('.cc-floating');
            const closeBtn = document.getElementById('cc-close');

            if (acceptBtn) acceptBtn.addEventListener('click', () => this.accept());
            if (denyBtn) denyBtn.addEventListener('click', () => this.deny());
            if (moreLink) moreLink.addEventListener('click', (e) => this.more(e));
            if (floatingBtn) floatingBtn.addEventListener('click', () => this.showPopup());
            if (closeBtn) closeBtn.addEventListener('click', () => this.hidePopup());
        },
        accept: function() {
            this.setCookie('cookieconsent', 'accepted', 365);
            this.hidePopup();
        },
        deny: function() {
            this.setCookie('cookieconsent', 'denied', 365);
            this.hidePopup();
        },
        more: function(e) {
            e.preventDefault();
            // Adicione aqui o link para sua política de privacidade
            window.open('#', '_blank');
        },
        hidePopup: function() {
            const popup = document.getElementById('cookie-consent');
            if (popup) {
                popup.style.display = 'none';
            }
        },
        setCookie: function(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        },
        getCookie: function(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
    };

    cookieConsent.init();
});

// Tailwind configuration
window.tailwind.config = {
    darkMode: ['class'],
    theme: {
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                'pensi-red': '#FF0000',
                'pensi-green': '#00FF00'
            },
        }
    }
}