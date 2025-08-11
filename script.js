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
    
    // 모달 닫기
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => {
        modal.remove();
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    // 좌석 선택 버튼
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

// 애니메이션 적용할 요소들
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.stat-item, .game-card, .gallery-item, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 모달 스타일 추가
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .game-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        position: relative;
        text-align: center;
    }
    
    .close {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
    }
    
    .close:hover {
        color: #333;
    }
    
    .modal-content h3 {
        color: #333;
        margin-bottom: 1rem;
    }
    
    .ticket-btn {
        background: #ff6b35;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin: 0.5rem;
    }
    
    .ticket-btn:hover {
        background: #e55a2b;
        transform: translateY(-2px);
    }
    
    .game-details {
        margin-bottom: 2rem;
        text-align: left;
    }
    
    .game-details p {
        margin-bottom: 0.5rem;
        color: #333;
    }
    
    .ticket-options h4 {
        margin-bottom: 1rem;
        color: #333;
    }
    
    .ticket-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }
    
    @media (max-width: 768px) {
        .modal-content {
            padding: 1.5rem;
            margin: 20px;
        }
        
        .ticket-buttons {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(modalStyles);

// Leaflet 지도 초기화
function initLeafletMap() {
    console.log('Leaflet 지도 초기화 시작...');
    
    // Leaflet이 로드되었는지 확인
    if (typeof L === 'undefined') {
        console.log('Leaflet이 아직 로드되지 않았습니다. 1초 후 다시 시도합니다.');
        setTimeout(initLeafletMap, 1000);
        return;
    }
    
    try {
        const container = document.getElementById('map');
        if (!container) {
            console.error('지도 컨테이너를 찾을 수 없습니다.');
            return;
        }

        console.log('지도 컨테이너를 찾았습니다. Leaflet 지도를 생성합니다...');

        // 사직야구장 좌표 (위도, 경도)
        const lat = 35.1795543;
        const lng = 129.0756416;

        // 지도 생성 (확대 레벨 16)
        const map = L.map('map').setView([lat, lng], 16);

        // OpenStreetMap 타일 레이어 추가
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // 사직야구장 마커 추가
        const marker = L.marker([lat, lng]).addTo(map);

        // 팝업 내용
        const popupContent = `
            <div style="text-align: center; font-family: 'Noto Sans KR', sans-serif;">
                <h3 style="color: #ff6b35; margin: 0 0 5px 0;">⚾ 사직야구장</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">롯데 자이언츠 홈구장</p>
                <p style="margin: 5px 0 0 0; color: #888; font-size: 12px;">부산광역시 사하구 사직로 45</p>
            </div>
        `;

        // 마커에 팝업 바인딩 및 자동 열기
        marker.bindPopup(popupContent).openPopup();

        // 지도 스타일 개선
        map.getContainer().style.borderRadius = '15px';

        console.log('Leaflet 지도가 성공적으로 생성되었습니다.');
        
    } catch (error) {
        console.error('Leaflet 지도 초기화 중 오류가 발생했습니다:', error);
        console.error('상세 오류 정보:', error.message);
    }
}

// 페이지 로드 완료 시 초기화
window.addEventListener('load', () => {
    console.log('사직야구장 웹사이트가 로드되었습니다!');
    
    // 로딩 애니메이션
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }

    // Leaflet 지도 초기화 (1초 후 실행)
    setTimeout(() => {
        initLeafletMap();
    }, 1000);
});
