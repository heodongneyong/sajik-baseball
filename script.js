// 모바일 메뉴 토글
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 메뉴 링크 클릭 시 모바일 메뉴 닫기
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// 스크롤 시 헤더 스타일 변경
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// 부드러운 스크롤
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

// 경기 카드 클릭 이벤트
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const status = card.querySelector('.status');
        if (status.classList.contains('available')) {
            showGameInfo(card);
        } else {
            alert('매진된 경기입니다.');
        }
    });
});

// 경기 정보 표시 함수
function showGameInfo(card) {
    const date = card.querySelector('.game-date');
    const teams = card.querySelector('.teams');
    const time = card.querySelector('.time');
    
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>경기 정보</h3>
            <div class="game-details">
                <p><strong>날짜:</strong> ${date.textContent}</p>
                <p><strong>경기:</strong> ${teams.textContent}</p>
                <p><strong>시간:</strong> ${time.textContent}</p>
            </div>
            <div class="ticket-options">
                <h4>좌석 선택</h4>
                <div class="ticket-buttons">
                    <button class="ticket-btn" data-seat="프리미엄">프리미엄석</button>
                    <button class="ticket-btn" data-seat="내야">내야석</button>
                    <button class="ticket-btn" data-seat="외야">외야석</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    
    const ticketBtns = modal.querySelectorAll('.ticket-btn');
    ticketBtns.forEach(btn => {
        btn.onclick = () => {
            const seatType = btn.getAttribute('data-seat');
            alert(`${seatType} 예매를 진행합니다.`);
            modal.remove();
        };
    });
}

// 애니메이션 효과
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.stat-item, .game-card, .gallery-item, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 선수단 탭 기능
function initPlayersTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const positionGroups = document.querySelectorAll('.position-group');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPosition = button.getAttribute('data-position');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            positionGroups.forEach(group => group.classList.remove('active'));
            const targetGroup = document.getElementById(targetPosition);
            if (targetGroup) targetGroup.classList.add('active');
            // 탭 표시가 DOM에 반영된 다음에 레이아웃 재계산
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.dispatchEvent(new Event('resize'));
                });
            });
        });
    });
}

// 투수 전용 캐러셀 (3장씩 보기)
function initPitcherCarousel() {
    const group = document.querySelector('#pitcher');
    if (!group) return;

    const container = group.querySelector('.players-carousel-container');
    const track = group.querySelector('.players-carousel');
    const prevBtn = group.querySelector('#pitcher-prev');
    const nextBtn = group.querySelector('#pitcher-next');
    const cards = Array.from(group.querySelectorAll('.players-carousel .player-card'));

    if (!container || !track || !prevBtn || !nextBtn || cards.length === 0) return;

    const state = { page: 0, itemsPerView: 3, totalPages: 1 };

    function computeItemsPerView() {
        return 3; // 항상 3장 고정
    }

    function layout() {
        state.itemsPerView = computeItemsPerView();
        const gapPx = 16; // must match CSS gap
        const containerWidth = container.clientWidth;
        const cardWidth = (containerWidth - gapPx * (state.itemsPerView - 1)) / state.itemsPerView;
        cards.forEach(card => { card.style.width = `${Math.max(0, cardWidth)}px`; });
        state.totalPages = Math.max(1, Math.ceil(cards.length / state.itemsPerView));
        if (state.page > state.totalPages - 1) state.page = state.totalPages - 1;
        apply();
        updateButtons();
    }

    function apply() {
        const startIndex = state.page * state.itemsPerView;
        const anchorCard = cards[startIndex];
        const offset = anchorCard ? anchorCard.offsetLeft : 0;
        track.style.setProperty('--pitcher-offset', `${offset}px`);
        track.setAttribute('aria-live', 'polite');
    }

    function updateButtons() {
        prevBtn.disabled = state.page <= 0;
        nextBtn.disabled = state.page >= state.totalPages - 1;
    }

    function go(delta) {
        const nextPage = state.page + delta;
        if (nextPage < 0 || nextPage > state.totalPages - 1) return;
        state.page = nextPage;
        apply();
        updateButtons();
    }

    function layoutWhenVisible() {
        if (container.clientWidth > 0 && group.classList.contains('active')) {
            layout();
            return;
        }
        const mo = new MutationObserver(() => {
            if (container.clientWidth > 0 && group.classList.contains('active')) {
                layout();
                mo.disconnect();
            }
        });
        mo.observe(group, { attributes: true, attributeFilter: ['class'] });
    }

    prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(-1); });
    nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(1); });

    layout();
    if (container.clientWidth === 0) layoutWhenVisible();
    window.addEventListener('resize', () => { layout(); });
}

// 포수 전용 캐러셀 (3장씩 보기)
function initCatcherCarousel() {
    const group = document.querySelector('#catcher');
    if (!group) return;

    const container = group.querySelector('.players-carousel-container');
    const track = group.querySelector('.players-carousel');
    const prevBtn = group.querySelector('#catcher-prev');
    const nextBtn = group.querySelector('#catcher-next');
    const cards = Array.from(group.querySelectorAll('.players-carousel .player-card'));

    if (!container || !track || !prevBtn || !nextBtn || cards.length === 0) return;

    const state = { page: 0, itemsPerView: 3, totalPages: 1 };

    function computeItemsPerView() {
        return 3; // 항상 3장 고정
    }

    function layout() {
        state.itemsPerView = computeItemsPerView();
        const gapPx = 16;
        const containerWidth = container.clientWidth;
        const cardWidth = (containerWidth - gapPx * (state.itemsPerView - 1)) / state.itemsPerView;
        cards.forEach(card => { card.style.width = `${Math.max(0, cardWidth)}px`; });
        state.totalPages = Math.max(1, Math.ceil(cards.length / state.itemsPerView));
        if (state.page > state.totalPages - 1) state.page = state.totalPages - 1;
        apply();
        updateButtons();
    }

    function apply() {
        const startIndex = state.page * state.itemsPerView;
        const anchorCard = cards[startIndex];
        const offset = anchorCard ? anchorCard.offsetLeft : 0;
        track.style.setProperty('--catcher-offset', `${offset}px`);
        track.setAttribute('aria-live', 'polite');
    }

    function updateButtons() {
        prevBtn.disabled = state.page <= 0;
        nextBtn.disabled = state.page >= state.totalPages - 1;
    }

    function go(delta) {
        const nextPage = state.page + delta;
        if (nextPage < 0 || nextPage > state.totalPages - 1) return;
        state.page = nextPage;
        apply();
        updateButtons();
    }

    function layoutWhenVisible() {
        if (container.clientWidth > 0 && group.classList.contains('active')) {
            layout();
            return;
        }
        const mo = new MutationObserver(() => {
            if (container.clientWidth > 0 && group.classList.contains('active')) {
                layout();
                mo.disconnect();
            }
        });
        mo.observe(group, { attributes: true, attributeFilter: ['class'] });
    }

    prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(-1); });
    nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(1); });

    layout();
    if (container.clientWidth === 0) layoutWhenVisible();
    window.addEventListener('resize', () => { layout(); });
}

// 내야수 전용 캐러셀 (3장씩 보기)
function initInfielderCarousel() {
    const group = document.querySelector('#infielder');
    if (!group) return;

    const container = group.querySelector('.players-carousel-container');
    const track = group.querySelector('.players-carousel');
    const prevBtn = group.querySelector('#infielder-prev');
    const nextBtn = group.querySelector('#infielder-next');
    const cards = Array.from(group.querySelectorAll('.players-carousel .player-card'));

    if (!container || !track || !prevBtn || !nextBtn || cards.length === 0) return;

    const state = { page: 0, itemsPerView: 3, totalPages: 1 };

    function computeItemsPerView() {
        return 3; // 항상 3장 고정
    }

    function layout() {
        state.itemsPerView = computeItemsPerView();
        const gapPx = 16;
        const containerWidth = container.clientWidth;
        const cardWidth = (containerWidth - gapPx * (state.itemsPerView - 1)) / state.itemsPerView;
        cards.forEach(card => { card.style.width = `${Math.max(0, cardWidth)}px`; });
        state.totalPages = Math.max(1, Math.ceil(cards.length / state.itemsPerView));
        if (state.page > state.totalPages - 1) state.page = state.totalPages - 1;
        apply();
        updateButtons();
    }

    function apply() {
        const startIndex = state.page * state.itemsPerView;
        const anchorCard = cards[startIndex];
        const offset = anchorCard ? anchorCard.offsetLeft : 0;
        track.style.setProperty('--infielder-offset', `${offset}px`);
        track.setAttribute('aria-live', 'polite');
    }

    function updateButtons() {
        prevBtn.disabled = state.page <= 0;
        nextBtn.disabled = state.page >= state.totalPages - 1;
    }

    function go(delta) {
        const nextPage = state.page + delta;
        if (nextPage < 0 || nextPage > state.totalPages - 1) return;
        state.page = nextPage;
        apply();
        updateButtons();
    }

    function layoutWhenVisible() {
        if (container.clientWidth > 0 && group.classList.contains('active')) {
            layout();
            return;
        }
        const mo = new MutationObserver(() => {
            if (container.clientWidth > 0 && group.classList.contains('active')) {
                layout();
                mo.disconnect();
            }
        });
        mo.observe(group, { attributes: true, attributeFilter: ['class'] });
    }

    prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(-1); });
    nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(1); });

    layout();
    if (container.clientWidth === 0) layoutWhenVisible();
    window.addEventListener('resize', () => { layout(); });
}

// 외야수 전용 캐러셀 (3장씩 보기)
function initOutfielderCarousel() {
    const group = document.querySelector('#outfielder');
    if (!group) return;

    const container = group.querySelector('.players-carousel-container');
    const track = group.querySelector('.players-carousel');
    const prevBtn = group.querySelector('#outfielder-prev');
    const nextBtn = group.querySelector('#outfielder-next');
    const cards = Array.from(group.querySelectorAll('.players-carousel .player-card'));

    if (!container || !track || !prevBtn || !nextBtn || cards.length === 0) return;

    const state = { page: 0, itemsPerView: 3, totalPages: 1 };

    function computeItemsPerView() {
        return 3; // 항상 3장 고정
    }

    function layout() {
        state.itemsPerView = computeItemsPerView();
        const gapPx = 16;
        const containerWidth = container.clientWidth;
        const cardWidth = (containerWidth - gapPx * (state.itemsPerView - 1)) / state.itemsPerView;
        cards.forEach(card => { card.style.width = `${Math.max(0, cardWidth)}px`; });
        state.totalPages = Math.max(1, Math.ceil(cards.length / state.itemsPerView));
        if (state.page > state.totalPages - 1) state.page = state.totalPages - 1;
        apply();
        updateButtons();
    }

    function apply() {
        const startIndex = state.page * state.itemsPerView;
        const anchorCard = cards[startIndex];
        const offset = anchorCard ? anchorCard.offsetLeft : 0;
        track.style.setProperty('--outfielder-offset', `${offset}px`);
        track.setAttribute('aria-live', 'polite');
    }

    function updateButtons() {
        prevBtn.disabled = state.page <= 0;
        nextBtn.disabled = state.page >= state.totalPages - 1;
    }

    function go(delta) {
        const nextPage = state.page + delta;
        if (nextPage < 0 || nextPage > state.totalPages - 1) return;
        state.page = nextPage;
        apply();
        updateButtons();
    }

    function layoutWhenVisible() {
        if (container.clientWidth > 0 && group.classList.contains('active')) {
            layout();
            return;
        }
        const mo = new MutationObserver(() => {
            if (container.clientWidth > 0 && group.classList.contains('active')) {
                layout();
                mo.disconnect();
            }
        });
        mo.observe(group, { attributes: true, attributeFilter: ['class'] });
    }

    prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(-1); });
    nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(1); });

    layout();
    if (container.clientWidth === 0) layoutWhenVisible();
    window.addEventListener('resize', () => { layout(); });
}

// Leaflet 지도 초기화
function initLeafletMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof L === 'undefined') return;

    // 사직야구장 근처 좌표 (대략)
    const sajikLatLng = [35.1989, 129.061];

    // 중복 초기화 방지
    if (mapContainer._leaflet_id) return;

    const map = L.map(mapContainer, { zoomControl: true }).setView(sajikLatLng, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker(sajikLatLng).addTo(map)
        .bindPopup('사직야구장')
        .openPopup();
}

// 초기화 (확장)
document.addEventListener('DOMContentLoaded', () => {
    initPlayersTabs();
    initPitcherCarousel();
    initCatcherCarousel();
    initInfielderCarousel();
    initOutfielderCarousel();
    initLeafletMap();
});

// 탭 전환 시 레이아웃 재계산 확장
(function enhanceTabRecalc(){
    const tabButtons = document.querySelectorAll('.tab-button');
    const recalcPositions = new Set(['pitcher','catcher','infielder','outfielder']);
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pos = btn.getAttribute('data-position');
            if (recalcPositions.has(pos)) {
                window.dispatchEvent(new Event('resize'));
            }
        });
    });
})();

// 아래 캐러셀 관련 공통 로직은 비활성화(노옵)
function initCarousel() {}
function moveCarousel() {}
function updateCarousel() {}
function updateButtons() {}
function updateAllCarousels() {}
function resetCarousel() {}
window.addEventListener('resize', () => {});
