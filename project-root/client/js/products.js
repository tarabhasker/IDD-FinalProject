window.ProductsPage = {
  template: `
    <section class="position-relative" 
             :class="{ 'mobile-view': isMobile }" 
             style="background-color: #f9f6f2; overflow: hidden; min-height: calc(100vh - 70px);">
      <div class="d-flex products-section" style="min-height: calc(100vh - 100px); flex-wrap: nowrap;">
        <div class="products-left position-relative animate-slide-in-left" style="width: 60vw; background-image: url('images/vintage1.jpg'); background-size: cover; background-position: center; min-height: calc(100vh - 70px);">
          <div class="h-100 d-flex flex-column justify-content-center align-items-center text-center text-white px-5 products-overlay">
            <small class="text-uppercase animate-fade-in" style="--delay: 0.5s;">Celebrate your day with Eternally.</small>
            <h1 class="fw-bold display-5 mt-3 animate-fade-in" style="--delay: 0.7s;">Your Wedding,<br>Our Priority.</h1>
            <h4 class="fw-normal mt-3 animate-fade-in" style="--delay: 0.9s;">Enjoy a Stress-Free day<br>on us.</h4>
          </div>
        </div>

        <div ref="cardsContainer" class="products-right flex-grow-1 position-relative animate-slide-in-right" style="margin-left: -10vw; padding-top: 16vh;">
          <div style="overflow-x: auto;">
            <TransitionGroup name="card-deck" tag="div" class="d-flex card-grid-container gap-4 px-2 pb-5 pt-2 position-relative">
              <div v-for="(service, index) in paginatedServices" :key="service.title"
                   class="flex-shrink-0 text-center border-0 card-item"
                   style="width: 450px; background-color: #fdfaf8; padding: 1.2rem 1.2rem 2rem; border: 1px solid #e0dcd8; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);">
                <img :src="service.image" :alt="service.title"
                     class="img-fluid mx-auto mb-3"
                     style="width: 100%; height: 320px; object-fit: cover; background-color: #e4e2e0;">
                <div class="px-0">
                  <h5 class="card-title" style="color: #3b2f2f; font-weight: 600;">
                    {{ service.title }}
                  </h5>
                  <div style="width: 30px; height: 4px; background-color: #532f2f; margin: 0 auto 10px;"></div>
                  <p class="card-text text-muted mb-3">{{ service.description }}</p>
                  <router-link :to="'/services/' + service.title.toLowerCase().replaceAll(' ', '-')"
                               class="text-decoration-underline fst-italic" style="color: #3b2f2f;">
                    See more
                  </router-link>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <div v-if="!isMobile" class="d-flex align-items-center gap-3 animate-fade-in" style="position: fixed; bottom: 16px; right: 20px; z-index: 1000; --delay: 1.2s;">
        <button @click="currentPage--" :disabled="currentPage === 1" class="btn p-0 border-0 bg-transparent pagination-arrow" style="font-size: 1.5rem; color: #4d4032;"><i class="bi bi-arrow-left"></i></button>
        <div style="font-family: 'Montserrat', sans-serif; font-size: 1.1rem; color: #2b2b2b;">
          Page 
          <span v-for="page in totalPages" :key="page" style="margin: 0 4px;">
            <span v-if="page === currentPage" class="d-inline-flex justify-content-center align-items-center page-indicator active" style="width: 32px; height: 32px; border-radius: 50%; background-color: #A27B5C; font-variant-numeric: tabular-nums;">{{ page }}</span>
            <span v-else class="page-indicator">{{ page }}</span>
            <span v-if="page < totalPages">|</span>
          </span>
        </div>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn p-0 border-0 bg-transparent pagination-arrow" style="font-size: 1.5rem; color: #4d4032;"><i class="bi bi-arrow-right"></i></button>
      </div>
    </section>
  `,
  data() {
    return {
      services: [],
      currentPage: 1,
      pageSize: 2,
      isMobile: this.getIsMobile()
    };
  },
  computed: {
    paginatedServices() {
      if (this.isMobile) { return this.services; }
      const start = (this.currentPage - 1) * this.pageSize;
      return this.services.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.services.length / this.pageSize);
    }
  },
  watch: {
    currentPage(newPage, oldPage) {}
  },
  mounted() {
    const style = document.createElement('style');
    style.id = 'products-page-styles';
    style.innerHTML = `
        /* --- Mobile Layout Overrides --- */
        .mobile-view .products-section { flex-direction: column !important; position: relative; z-index: 1; }
        .mobile-view .products-left {
            position: fixed !important;
            inset: 0;
            width: 100vw !important;
            /* MODIFIED: Use dvh for dynamic viewport height */
            height: 100vh !important; /* Fallback for older browsers */
            height: 100dvh !important; /* This fixes the gap on mobile */
            z-index: 0;
        }
        .mobile-view .products-overlay { padding: 2rem 1.5rem; }
        .mobile-view .products-right {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 2rem 1rem !important;
            /* MODIFIED: Use dvh for dynamic viewport height */
            margin-top: 100vh !important; /* Fallback for older browsers */
            margin-top: 100dvh !important; /* This fixes the gap on mobile */
            position: relative;
            z-index: 2;
        }

        /* --- Mobile Landscape Tweaks --- */
        @media (max-height: 500px) and (orientation: landscape) {
            .mobile-view .products-left {
                /* MODIFIED: Use dvh for dynamic viewport height */
                height: 70vh !important; /* Fallback */
                height: 70dvh !important;
            }
            .mobile-view .products-right {
                /* MODIFIED: Use dvh for dynamic viewport height */
                margin-top: 70vh !important; /* Fallback */
                margin-top: 70dvh !important;
            }
            .mobile-view .products-overlay { text-align: center !important; }
            .mobile-view .products-overlay h1 { font-size: 2.0rem !important; }
            .mobile-view .products-overlay h4 { font-size: 1.0rem !important; }
            .mobile-view .products-overlay { padding-top: 1rem !important; padding-bottom: 1rem !important; }
            
            .mobile-view .card-grid-container { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; padding: 0 1rem !important; }
            .mobile-view .card-item { width: 100% !important; margin: 0 !important; padding: 0.8rem !important; }
            .mobile-view .card-item img { height: 160px !important; }
            .mobile-view .card-item .card-title { font-size: 1rem !important; margin-bottom: 0.5rem !important; }
            .mobile-view .card-item .card-text { font-size: 0.8rem !important; margin-bottom: 0.75rem !important; }
        }

        /* --- Page Load Animations (Unchanged) --- */
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .animate-slide-in-left { animation: slideInLeft 1s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in-right { animation: slideInRight 1s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; animation-delay: var(--delay, 0s); opacity: 0; }
        .pagination-arrow { transition: transform 0.3s ease; }
        .pagination-arrow:hover { transform: scale(1.2); }
        .page-indicator { transition: color 0.3s ease; }
        .page-indicator.active { color: white; }

        /* --- TransitionGroup Card Animations (Unchanged) --- */
        .card-deck-move, .card-deck-enter-active, .card-deck-leave-active { transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1); }
        .card-deck-enter-from, .card-deck-leave-to { opacity: 0; transform: scale(0.9) translateY(30px); }
        .card-deck-leave-active { position: absolute !important; }
    `;
    if (!document.getElementById('products-page-styles')) {
        document.head.appendChild(style);
    }
    fetch('data/services.json').then(res => res.json()).then(data => { this.services = data.services; });
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    const style = document.getElementById('products-page-styles');
    if (style) { style.remove(); }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    getIsMobile() {
      const hasTouch = window.matchMedia('(pointer: coarse)').matches;
      const isLandscapePhone = window.matchMedia('(max-height: 500px) and (orientation: landscape)').matches;
      return window.innerWidth < 768 || hasTouch || isLandscapePhone;
    },
    handleResize() {
      this.isMobile = this.getIsMobile();
    }
  }
};