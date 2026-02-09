window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingTimer = loadingOverlay ? loadingOverlay.querySelector('.loading-timer') : null;
    const loadingMessage = loadingOverlay ? loadingOverlay.querySelector('.loading-message') : null;
    const loadingBar = loadingOverlay ? loadingOverlay.querySelector('.loading-bar') : null;
    const plant = loadingOverlay ? loadingOverlay.querySelector('.plant') : null;
    const stem = loadingOverlay ? loadingOverlay.querySelector('.stem') : null;
    const leafLeft = loadingOverlay ? loadingOverlay.querySelector('.leaf-left') : null;
    const leafRight = loadingOverlay ? loadingOverlay.querySelector('.leaf-right') : null;
    const leafTop = loadingOverlay ? loadingOverlay.querySelector('.leaf-top') : null;
    if (!loadingOverlay) return;
    const funnyMessages = [
        "Loading 10,000,000 words of eco-wisdom...",
        "Growing sustainable thoughts...",
        "Photosynthesizing your request...",
        "Planting seeds of change...",
        "Composting old habits...",
        "Recycling your patience...",
        "Cultivating green energy...",
        "Sprouting eco-friendly vibes...",
        "Watering your curiosity...",
        "Nurturing the planet..."
    ];
    let pendingAction = null;
    function showLoading(callback, duration =3 ) {
        pendingAction = callback;
        const plantContainer = loadingOverlay.querySelector('.plant-container');
        if (plantContainer) {
            const plantHTML = plantContainer.innerHTML;
            plantContainer.innerHTML = '';
            plantContainer.innerHTML = plantHTML;
            const newPlant = loadingOverlay.querySelector('.plant');
            const newStem = loadingOverlay.querySelector('.stem');
            const newLeafLeft = loadingOverlay.querySelector('.leaf-left');
            const newLeafRight = loadingOverlay.querySelector('.leaf-right');
            const newLeafTop = loadingOverlay.querySelector('.leaf-top');
            if (newPlant) newPlant.style.animation = `plantGrow ${duration}s ease-out forwards, plantSway 3s ease-in-out infinite`;
            if (newStem) newStem.style.animation = `stemGrow ${duration}s ease-out forwards`;
            if (newLeafLeft) {
                newLeafLeft.style.animation = `leafGrowLeft ${duration}s ease-out forwards`;
                newLeafLeft.style.animationDelay = `${duration * 0.2}s`;
            }
            if (newLeafRight) {
                newLeafRight.style.animation = `leafGrowRight ${duration}s ease-out forwards`;
                newLeafRight.style.animationDelay = `${duration * 0.4}s`;
            }
            if (newLeafTop) {
                newLeafTop.style.animation = `leafGrowTop ${duration}s ease-out forwards`;
                newLeafTop.style.animationDelay = `${duration * 0.6}s`;
            }
        }
        if (loadingBar) {
            loadingBar.style.animation = 'none';
            loadingBar.offsetHeight; 
            loadingBar.style.animation = `loadingProgress ${duration}s linear forwards, shimmer 1.5s infinite`;
        }
        loadingOverlay.classList.remove('hidden', 'fade-out');
        document.body.style.overflow = 'hidden';
        if (loadingTimer) loadingTimer.textContent = duration;
        let msgIndex = 0;
        if (loadingMessage) {
            loadingMessage.textContent = funnyMessages[msgIndex];
        }
        hideLoading();
    }
    function hideLoading() {
        loadingOverlay.classList.add('fade-out');
        loadingOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        if (pendingAction && typeof pendingAction === 'function') {
            pendingAction();
            pendingAction = null;
        }
    }
    window.showLoadingAnimation = showLoading;
    document.querySelectorAll('.delayed-action').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            playClickSound();
            const href = this.getAttribute('href');
            const target = this.getAttribute('target');
            const isLink = href && href !== '#' && !href.startsWith('javascript:');
            const action = () => {
                if (isLink) {
                    if (target === '_blank') {
                        window.open(href, '_blank', 'noopener,noreferrer');
                    } else {
                        window.location.href = href;
                    }
                }
            };
            showLoading(action, 8); 
        });
    });
    const chatbotToggle = document.getElementById('chatbot-toggle');
    if (chatbotToggle && !chatbotToggle.classList.contains('delayed-action-attached')) {
        chatbotToggle.classList.add('delayed-action-attached');
        chatbotToggle.addEventListener('click', function(e) {
            const chatbotWindow = document.getElementById('chatbot-window');
            if (chatbotWindow && !chatbotWindow.classList.contains('hidden')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            playClickSound();
            showLoading(() => {
                const chatbotWindow = document.getElementById('chatbot-window');
                if (chatbotWindow) {
                    chatbotWindow.classList.remove('hidden');
                    chatbotToggle.classList.add('active');
                    const chatbotInput = document.getElementById('chatbot-input');
                    if (chatbotInput) chatbotInput.focus();
                }
            }, 8); 
        }, true); 
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const bagsInput = document.getElementById('bags-per-week');
    const bagsSlider = document.getElementById('bags-slider');
    const costInput = document.getElementById('bag-cost');
    const costSlider = document.getElementById('cost-slider');
    const yearsInput = document.getElementById('usage-years');
    const yearsSlider = document.getElementById('years-slider');
    if (!bagsInput || !bagsSlider) return;
    const totalBagsEl = document.getElementById('total-bags');
    const weeklyUsageEl = document.getElementById('weekly-usage');
    const annualUsageEl = document.getElementById('annual-usage');
    const totalCostEl = document.getElementById('total-cost');
    const decomposeTimeEl = document.getElementById('decompose-time');
    const D = 1000; 
    function syncInputAndSlider(input, slider, min, max) {
        input.addEventListener('input', function() {
            let value = parseFloat(this.value);
            if (value < min) value = min;
            if (value > max) value = max;
            slider.value = value;
            calculateImpact();
        });
        input.addEventListener('blur', function() {
            let value = parseFloat(this.value);
            if (isNaN(value) || value < min) {
                this.value = min;
                slider.value = min;
            } else if (value > max) {
                this.value = max;
                slider.value = max;
            }
            calculateImpact();
        });
        slider.addEventListener('input', function() {
            input.value = this.value;
            calculateImpact();
        });
    }
    syncInputAndSlider(bagsInput, bagsSlider, 0, 100);
    syncInputAndSlider(costInput, costSlider, 0, 1);
    syncInputAndSlider(yearsInput, yearsSlider, 1, 50);
    function calculateImpact() {
        const B = parseFloat(bagsInput.value) || 0;  
        const C = parseFloat(costInput.value) || 0;   
        const Y = parseFloat(yearsInput.value) || 1;  
        if (B < 0 || C < 0 || Y <= 0) {
            showError();
            return;
        }
        const weeklyUsage = Math.round(B);
        const A = B * 52;
        const annualUsage = Math.round(A);
        const T = A * Y;
        const totalUsage = Math.round(T);
        const totalCost = T * C;
        const DecTotal = T * D;
        weeklyUsageEl.textContent = formatInteger(weeklyUsage) + ' bags';
        annualUsageEl.textContent = formatInteger(annualUsage) + ' bags';
        totalBagsEl.textContent = formatInteger(totalUsage);
        totalCostEl.textContent = 'SGD ' + formatCurrency(totalCost);
        decomposeTimeEl.textContent = formatLargeYears(DecTotal);
    }
    function formatInteger(num) {
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function formatCurrency(num) {
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function formatLargeYears(years) {
        if (years >= 1000000000) {
            return (years / 1000000000).toFixed(1) + 'B years';
        } else if (years >= 1000000) {
            return (years / 1000000).toFixed(1) + 'M years';
        } else if (years >= 1000) {
            return (years / 1000).toFixed(1) + 'k years';
        } else {
            return formatInteger(years) + ' years';
        }
    }
    function showError() {
        weeklyUsageEl.textContent = '—';
        annualUsageEl.textContent = '—';
        totalBagsEl.textContent = '—';
        totalCostEl.textContent = '—';
        decomposeTimeEl.textContent = '—';
    }
    calculateImpact();
});
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
document.querySelectorAll('.stat-card, .cause-item, .action-item').forEach(el => {
    observer.observe(el);
});
function animateCounter(element) {
    const raw = element.getAttribute('data-target');
    const target = parseFloat(raw);
    if (Number.isNaN(target)) return;
    element.textContent = target % 1 === 0 ? Math.floor(target) : target.toFixed(2);
}
const statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            if (entry.target.hasAttribute('data-target')) {
                animateCounter(entry.target);
            }
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => {
    statObserver.observe(el);
});
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});
function playCheckSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const fundamental = audioContext.createOscillator();
        const harmonic2 = audioContext.createOscillator();
        const harmonic3 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const gain2 = audioContext.createGain();
        const gain3 = audioContext.createGain();
        fundamental.connect(gainNode);
        harmonic2.connect(gain2);
        harmonic3.connect(gain3);
        gainNode.connect(audioContext.destination);
        gain2.connect(audioContext.destination);
        gain3.connect(audioContext.destination);
        const baseFreq = 523.25; 
        fundamental.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
        harmonic2.frequency.setValueAtTime(baseFreq * 2.76, audioContext.currentTime); 
        harmonic3.frequency.setValueAtTime(baseFreq * 5.04, audioContext.currentTime); 
        fundamental.type = 'sine';
        harmonic2.type = 'sine';
        harmonic3.type = 'sine';
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);
        gain2.gain.setValueAtTime(0, audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
        gain3.gain.setValueAtTime(0, audioContext.currentTime);
        gain3.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.01);
        gain3.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        const startTime = audioContext.currentTime;
        fundamental.start(startTime);
        harmonic2.start(startTime);
        harmonic3.start(startTime);
        fundamental.stop(startTime + 1.2);
        harmonic2.stop(startTime + 0.8);
        harmonic3.stop(startTime + 0.5);
    } catch (error) {
        console.log('Audio context not available, using fallback');
    }
}
function takePledge() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfciBkfSP4fRUVURv80zTUKPXbbHg5AO-qxpYMEy0YB3B3GVQ/viewform?pli=1', '_blank', 'noopener,noreferrer');
}
function downloadInfo() {
    window.open('singapore_plastic_waste_infographic_v2.pdf', '_blank', 'noopener,noreferrer');
}
function startCampaign() {
    alert('Start Your School Campaign! 🎓\n\nGreat initiative! Contact your school administration to get started with your plastic bag reduction campaign.');
}
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
document.addEventListener('DOMContentLoaded', function() {
    const expandableCards = document.querySelectorAll('.expandable-card');
    expandableCards.forEach(card => {
        card.addEventListener('click', function(e) {
            playClickSound();
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            const isExpanded = this.classList.contains('expanded');
            const section = this.closest('.stats-grid') || this.closest('.causes-grid');
            if (section && section.classList.contains('stats-grid')) {
                if (isExpanded) {
                    this.classList.remove('expanded');
                } else {
                    this.classList.add('expanded');
                }
                return;
            }
            if (section && section.classList.contains('causes-grid')) {
                if (isExpanded) {
                    this.classList.remove('expanded');
                    return;
                }
                const allCardsInSection = section.querySelectorAll('.expandable-card');
                allCardsInSection.forEach(otherCard => {
                    if (otherCard !== this && otherCard.classList.contains('expanded')) {
                        otherCard.classList.remove('expanded');
                    }
                });
                this.classList.add('expanded');
                return;
            }
            if (isExpanded) {
                this.classList.remove('expanded');
            } else {
                this.classList.add('expanded');
            }
        });
    });
    expandableCards.forEach(card => {
        card.classList.remove('expanded');
    });
    const policyItems = document.querySelectorAll('.expandable-policy');
    let currentlyExpandedPolicy = null;
    policyItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            const isExpanded = this.classList.contains('expanded');
            if (isExpanded) {
                this.classList.remove('expanded');
                currentlyExpandedPolicy = null;
                return;
            }
            policyItems.forEach(otherItem => {
                if (otherItem !== this && otherItem.classList.contains('expanded')) {
                    otherItem.classList.remove('expanded');
                }
            });
            this.classList.add('expanded');
            currentlyExpandedPolicy = this;
            playCheckSound();
        });
    });
    document.addEventListener('click', function(e) {
        if (currentlyExpandedPolicy && !currentlyExpandedPolicy.contains(e.target)) {
            const clickedPolicy = e.target.closest('.expandable-policy');
            if (!clickedPolicy || clickedPolicy !== currentlyExpandedPolicy) {
                currentlyExpandedPolicy.classList.remove('expanded');
                currentlyExpandedPolicy = null;
            }
        }
    });
    policyItems.forEach(item => {
        item.classList.remove('expanded');
    });
});
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.03, audioContext.sampleRate); 
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.4;
        }
        const noise = audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, now);
        filter.Q.setValueAtTime(0.7, now);
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.0, now);
        gainNode.gain.linearRampToValueAtTime(0.05, now + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        noise.start(now);
        noise.stop(now + 0.06);
        if (navigator && typeof navigator.vibrate === 'function') {
            navigator.vibrate(15);
        }
    } catch (error) {
        console.log('Click sound not available');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const ambientToggle = document.getElementById('ambient-audio-toggle');
    const ambientContainer = document.getElementById('ambient-audio-container');
    if (!ambientToggle || !ambientContainer) return;
    let ambientOn = false;
    let ambientPlayer = null;
    let ambientDesired = true; 
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = function() {
    };
    function createAmbientPlayer() {
        ambientContainer.innerHTML = '<div id="ambient-youtube-player"></div>';
        if (typeof YT !== 'undefined' && YT.Player) {
            ambientPlayer = new YT.Player('ambient-youtube-player', {
                height: '0',
                width: '0',
                videoId: '1xIgpAKTans',
                playerVars: {
                    'autoplay': 1,
                    'loop': 1,
                    'playlist': '1xIgpAKTans', 
                    'controls': 0,
                    'showinfo': 0,
                    'modestbranding': 1,
                    'rel': 0,
                    'enablejsapi': 1,
                    'origin': window.location.origin
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        } else {
            const iframe = document.createElement('iframe');
            iframe.width = '0';
            iframe.height = '0';
            iframe.setAttribute('allow', 'autoplay');
            iframe.setAttribute('title', 'Ambient background sound');
            iframe.src = 'https://www.youtube.com/embed/1xIgpAKTans?autoplay=1&loop=1&playlist=1xIgpAKTans&controls=0&modestbranding=1&rel=0&enablejsapi=1';
            ambientContainer.innerHTML = '';
            ambientContainer.appendChild(iframe);
        }
    }
    function onPlayerReady(event) {
        event.target.setVolume(50); 
        event.target.playVideo();
    }
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            event.target.seekTo(0);
            event.target.playVideo();
        }
    }
    function startAmbientIfNeeded() {
        if (!ambientOn) {
            createAmbientPlayer();
            ambientOn = true;
            ambientToggle.classList.add('active');
            ambientToggle.querySelector('.ambient-audio-icon').textContent = '🔊';
        }
    }
    function stopAmbient() {
        if (ambientPlayer && typeof ambientPlayer.destroy === 'function') {
            ambientPlayer.destroy();
        }
        ambientContainer.innerHTML = '';
        ambientPlayer = null;
        ambientOn = false;
        ambientToggle.classList.remove('active');
        ambientToggle.querySelector('.ambient-audio-icon').textContent = '🔈';
    }
    ambientToggle.addEventListener('click', function() {
        if (!ambientOn) {
            startAmbientIfNeeded();
        } else {
            stopAmbient();
        }
    });
    const experienceOverlay = document.getElementById('experience-overlay');
    const experienceStartBtn = document.getElementById('experience-start-btn');
    const heroSection = document.querySelector('.hero-section');
    const body = document.body;
    if (experienceOverlay && experienceStartBtn) {
        if (heroSection && !experienceOverlay.classList.contains('hidden')) {
            heroSection.classList.add('hidden-initially');
            body.style.overflow = 'hidden'; 
        }
        experienceStartBtn.addEventListener('click', function() {
            playClickSound();
            experienceOverlay.classList.add('fading-out');
            experienceOverlay.classList.add('hidden');
            if (typeof window.showLoadingAnimation === 'function') {
                window.showLoadingAnimation(function() {
                    startAmbientIfNeeded();
                    if (heroSection) {
                        heroSection.classList.remove('hidden-initially');
                    }
                    body.style.overflow = '';
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 5);
            } else {
                startAmbientIfNeeded();
                if (heroSection) {
                    heroSection.classList.remove('hidden-initially');
                }
                body.style.overflow = '';
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const clickableElements = document.querySelectorAll('button, .btn, .btn-primary, .btn-secondary, .btn-cta, .social-btn, .feedback-button, .join-us-button');
    clickableElements.forEach(element => {
        if (element.id === 'ambient-audio-toggle') return;
        element.addEventListener('click', playClickSound);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const narratorToggle = document.getElementById('narrator-toggle');
    const narratorPanel = document.getElementById('narrator-panel');
    const readPageBtn = document.getElementById('narrator-read-page');
    const stopBtn = document.getElementById('narrator-stop');
    if (!narratorToggle || !narratorPanel || !readPageBtn || !stopBtn) return;
    let isNarratorOpen = false;
    let isReading = false;
    function getNarrationText() {
        const parts = [];
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroTitle) parts.push(heroTitle.textContent.trim());
        if (heroSubtitle) parts.push(heroSubtitle.textContent.trim());
        document.querySelectorAll('.section').forEach(section => {
            const title = section.querySelector('.section-title');
            if (title) parts.push(title.textContent.trim());
            section.querySelectorAll('p, li').forEach(node => {
                const text = node.textContent.replace(/\s+/g, ' ').trim();
                if (text.length > 0) parts.push(text);
            });
        });
        return parts.join('. ');
    }
    function speakText(text) {
        if (!('speechSynthesis' in window)) {
            alert('Narrator is not supported in this browser.');
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-SG';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => {
            isReading = false;
        };
        window.speechSynthesis.speak(utterance);
        isReading = true;
    }
    narratorToggle.addEventListener('click', () => {
        playClickSound();
        isNarratorOpen = !isNarratorOpen;
        narratorToggle.classList.toggle('active', isNarratorOpen);
        narratorPanel.classList.toggle('hidden', !isNarratorOpen);
    });
    readPageBtn.addEventListener('click', () => {
        playClickSound();
        const text = getNarrationText();
        if (text && text.length > 0) {
            speakText(text);
        }
    });
    stopBtn.addEventListener('click', () => {
        playClickSound();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        isReading = false;
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');
    let isOpen = false;
    const responses = {
        greetings: [
            "Hello! 🌱 I'm here to help you learn about reducing plastic waste in Singapore!",
            "Hi there! 🌿 Ready to make Singapore greener? Ask me anything!",
            "Welcome! 🌊 Let's work together to reduce plastic pollution!"
        ],
        statistics: [
            "📊 Here are key facts: Singapore generates 957,000 tonnes of plastic waste yearly, but only 5% gets recycled! The 5-cent bag charge reduced usage by 80%.",
            "🔢 Singapore produces 6.86 million tonnes of waste annually, with plastic being a major component. Our recycling rate is only 11%!",
            "📈 Since July 2023, the plastic bag charge has dramatically reduced usage by 80% - showing small changes make big impacts!"
        ],
        reduce: [
            "💡 Great ways to reduce: Use reusable bags, say no to unnecessary packaging, bring your own containers for takeaway, and choose products with less plastic!",
            "🛍️ Top tips: Always carry a reusable bag, buy in bulk to reduce packaging, choose glass/metal containers, and support businesses with eco-friendly practices!",
            "🌱 Simple steps: Bring reusable bags everywhere, refuse single-use items, choose package-free products, and inspire friends to do the same!"
        ],
        recycling: [
            "♻️ Recycling tips: Clean containers before recycling, separate materials properly, check recycling symbols, and remember - thin plastic bags often can't be recycled!",
            "🗂️ Proper recycling: Remove food residue, sort by material type, check with your local recycling center for guidelines, and focus on reducing first!",
            "📋 Recycling guide: Clean items, separate plastics by number, avoid contamination, and remember the 3 R's: Reduce, Reuse, then Recycle!"
        ],
        singapore: [
            "🇸🇬 Singapore facts: We're working toward zero waste by 2030! The Green Plan includes reducing daily waste and increasing recycling rates significantly.",
            "🏝️ In Singapore: Semakau Landfill is filling up fast, so waste reduction is critical. The government is implementing Extended Producer Responsibility policies!",
            "🌆 Singapore's efforts: The Resource Sustainability Act, carrier bag charges, and upcoming deposit-return schemes are helping reduce waste!"
        ],
        default: [
            "🤔 I'm still learning! Could you provide your feedback on what you'd like to know? This helps me improve my responses about plastic waste reduction.",
            "💭 I want to help better! Please provide your feedback - what specific information about plastic waste or recycling would be most useful?",
            "🌟 I'm learning from every conversation! Could you provide your feedback on how I can better assist with plastic waste topics?"
        ],
        feedback: [
            "📝 Thank you for your feedback! I'm learning from our conversation to better help with plastic waste questions. Is there anything specific about Singapore's plastic policies you'd like to know?",
            "🙏 I appreciate your feedback! This helps me improve. Let me try to help with plastic bag reduction, recycling tips, or Singapore's green initiatives.",
            "💚 Your feedback is valuable! I'm getting better at helping with environmental topics. What would you like to learn about plastic waste reduction?"
        ],
        error: [
            "😅 Oops! I encountered an issue. Please provide your feedback on what went wrong so I can learn and improve!",
            "🔧 Something didn't work as expected. Could you provide your feedback? This helps me learn to serve you better!",
            "⚠️ I'm having trouble with that request. Please provide your feedback so I can learn and give you better information about plastic waste!"
        ]
    };
    chatbotToggle.addEventListener('click', function() {
        playClickSound();
        if (isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });
    chatbotClose.addEventListener('click', function() {
        playClickSound();
        closeChatbot();
    });
    function openChatbot() {
        chatbotWindow.classList.remove('hidden');
        chatbotToggle.classList.add('active');
        isOpen = true;
        chatbotInput.focus();
    }
    function closeChatbot() {
        chatbotWindow.classList.add('hidden');
        chatbotToggle.classList.remove('active');
        isOpen = false;
    }
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            playClickSound();
            addMessage(message, 'user');
            chatbotInput.value = '';
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }
    }
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            playClickSound();
            const question = this.getAttribute('data-question');
            addMessage(question, 'user');
            const response = generateResponse(question);
            addMessage(response, 'bot');
        });
    });
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">🌱</div>
                <div class="message-content">${text}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${text}</div>
                <div class="message-avatar">👤</div>
            `;
        }
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    let userInteractions = [];
    let feedbackCount = 0;
    function generateResponse(message) {
        const msg = message.toLowerCase();
        userInteractions.push({
            message: message,
            timestamp: new Date().toISOString(),
            understood: false
        });
        try {
            if (msg.includes('feedback') || msg.includes('improve') || msg.includes('better') || msg.includes('learn')) {
                feedbackCount++;
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('feedback') + (feedbackCount > 2 ? " I'm getting smarter with each conversation! 🧠" : "");
            }
            else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good morning') || msg.includes('good afternoon')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('greetings');
            }
            else if (msg.includes('statistic') || msg.includes('data') || msg.includes('number') || msg.includes('fact') || msg.includes('percent') || msg.includes('%')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('statistics');
            }
            else if (msg.includes('reduce') || msg.includes('less') || msg.includes('tip') || msg.includes('how') || msg.includes('ways') || msg.includes('help')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('reduce');
            }
            else if (msg.includes('recycle') || msg.includes('recycling') || msg.includes('bin') || msg.includes('waste') || msg.includes('disposal')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('recycling');
            }
            else if (msg.includes('singapore') || msg.includes('policy') || msg.includes('government') || msg.includes('semakau') || msg.includes('nea')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('singapore');
            }
            else if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return "🌟 You're welcome! I'm here to help make Singapore greener. Feel free to ask more questions or provide feedback!";
            }
            else {
                userInteractions[userInteractions.length - 1].understood = false;
                return getRandomResponse('default');
            }
        } catch (error) {
            console.log('Chatbot error:', error);
            return getRandomResponse('error');
        }
    }
    function getRandomResponse(category) {
        const responseArray = responses[category];
        const baseResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
        if (category === 'default') {
            const ununderstoodCount = userInteractions.filter(i => !i.understood).length;
            if (ununderstoodCount > 3) {
                return baseResponse + " I notice I'm having trouble understanding some questions - your feedback helps me learn! 🤖📚";
            }
        }
        return baseResponse;
    }
});