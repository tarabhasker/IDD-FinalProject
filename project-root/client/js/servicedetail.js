window.ServiceDetailPage = {
  template: `
    <section
      class="pt-5 position-relative"
      style="
        background-image: url('images/floralborder2.jpg');
        background-size: cover;
        background-position: center top;
        background-repeat: no-repeat;
        background-attachment: fixed;
        min-height: calc(100vh - 70px);
        height: auto;
        padding-bottom: 3rem;
        z-index: 0;
        overflow-x: hidden;
      "
    >

      <div v-if="pageReady">
        <div class="container d-flex justify-content-between align-items-start flex-wrap gap-4 mb-4 fade-in-up top-button-section">
          <div class="flex-grow-1" style="min-width: 250px;">
            <h1 style="font-size: 3.2rem; font-weight: 500; color: #2C3930; margin-bottom: 1.5rem;">
              {{ serviceTitle }}
            </h1>
            <p class="ps-3" style="border-left: 4px solid #A27B5C; color: #3F4F44; font-size: 1.05rem; margin-bottom: 0;">
              We tailor this service to match your dream wedding vision.
            </p>
          </div>
          
          <router-link 
            to="/products" 
            class="btn btn-outline px-4 mt-2" 
            style="color: #3F4F44; border-color: #3F4F44; height: fit-content;">
            ← Back to Services
          </router-link>
        </div>

        <div class="carousel-wrapper text-center my-5 fade-in-up" style="--animation-delay: 0.1s;">
          <div class="container px-3 px-md-4 mb-4">
            <h3 class="position-relative text-center" style="color: #2C3930; font-weight: 500;">
              <span style="background: white; color: #3F4F44; padding: 8px 20px; position: relative; z-index: 1; border-radius: 10px; border: 1px solid #3F4F44;">Top Picks</span>
              <span style="position: absolute; height: 1px; background: #3F4F44; width: 100%; top: 50%; left: 0; z-index: 0;"></span>
            </h3>
          </div>
          <div class="d-flex align-items-center justify-content-center gap-3">
            <button class="btn rounded-circle shadow d-flex align-items-center justify-content-center"
                style="width: 44px; height: 44px; background-color: #A27B5C;"
                @click="prevCard">
              <i class="bi bi-arrow-left" style="color: white; font-size: 1.2rem;"></i>
            </button>

            <div v-if="visibleCards.length > 0"
             class="carousel-inner-wrapper d-flex align-items-center justify-content-center position-relative"
             :style="{
               width: isMobile ? '90vw' : '75vw',
               overflowX: 'visible',
               overflowY: 'visible'
             }">
              <div
              v-for="image in visibleCards"
              :key="image.label + image._index"
              class="carousel-card text-center  mt-3 mx-3 rounded shadow d-flex flex-column justify-content-between align-items-center"
              :class="{ 'center-card': image._index === currentCard, 'side-card': image._index !== currentCard && !isMobile }"
              :style="{
                width: isMobile ? '100%' : '280px',
                minHeight: isMobile ? 'auto' : '520px',
                backgroundColor: '#f9f6f2',
                padding: '1rem',
                boxSizing: 'border-box'
              }"
            >
                <div class="d-flex justify-content-center mb-3">
                  <img
                    :src="image.src"
                    :alt="image.label"
                    style="width: 240px; height: 280px; object-fit: cover; border-radius: 10px;"
                  />
                </div>
                <div class="d-flex flex-column justify-content-between" style="width: 240px;">
                  <h6 class="fw-semibold" style="color: #2C3930;">{{ image.label }}</h6>
                  <p class="text-muted mb-2">{{ image.description }}</p>
                  <div class="text-center">
                    <p class="fw-semilight text-dark fst-italic mb-3">RM {{ image.price }}</p>
                  </div>
                </div>
                <button
                  class="btn mt-auto"
                  :disabled="isInCart(image)"
                  @click="addToCart(image)"
                  style="background-color: #3F4F44; color: #ffffff; font-style: italic; width: 240px;"
                >
                  {{ isInCart(image) ? 'Added!' : 'Add to Cart' }}
                </button>
              </div>
            </div>
            <div v-else class="text-muted">No items found for this service.</div>
            <button class="btn rounded-circle shadow d-flex align-items-center justify-content-center"
                style="width: 44px; height: 44px; background-color: #A27B5C;"
                @click="nextCard">
              <i class="bi bi-arrow-right" style="color: white; font-size: 1.2rem;"></i>
            </button>
          </div>
        </div>

        <div class="container px-3 px-md-4 mb-4 mt-5 fade-in-up" style="--animation-delay: 0.2s;">
            <h3 class="position-relative text-center" style="color: #2C3930; font-weight: 500;">
              <span style="background: white; color: #3F4F44; padding: 8px 20px; position: relative; z-index: 1; border-radius: 10px; border: 1px solid #3F4F44;">All Items</span>
              <span style="position: absolute; height: 1px; background: #3F4F44; width: 100%; top: 50%; left: 0; z-index: 0;"></span>
            </h3>
        </div>

        <div class="container px-3 px-md-4 mb-4 d-flex justify-content-end fade-in-up" style="--animation-delay: 0.3s;">
            <div class="d-flex align-items-center bg-light rounded-pill shadow-sm px-3 search-bar-wrapper" style="height: 48px; background-color: #f4f2ef; width: 100%; max-width: 500px;">
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control border-0 bg-transparent p-0 me-2 shadow-none"
                  placeholder="Search themes or descriptions..."
                  style="font-size: 0.95rem;"
                />
                <div class="dropdown">
                  <button class="btn btn-sm border-0 rounded-pill px-2 py-1 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-funnel" style="font-size: 1.2rem; color: #2b2b2b;"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" @click="sortOrder = 'asc'">Price: Low to High</a></li>
                    <li><a class="dropdown-item" @click="sortOrder = 'desc'">Price: High to Low</a></li>
                  </ul>
                </div>
                <i class="bi bi-search ms-2" style="font-size: 1.2rem; color: #2b2b2b;"></i>
            </div>
        </div>
        
        <div class="container px-3 px-md-4 fade-in-up" style="--animation-delay: 0.4s;">
            <transition-group name="list" tag="div" class="row g-4 justify-content-center">
                <div v-for="item in sortedImages" :key="item.label" class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
                    <div class="card w-100 shadow-sm p-2" style="background-color: white; border-radius: 10px; overflow: hidden;">
                        <div class="d-flex align-items-center">
                            <div style="flex-shrink: 0; width: 140px;">
                                <img :src="item.src" class="img-fluid" :alt="item.label" style="height: 160px; width: 100%; object-fit: cover; border-radius: 8px;">
                            </div>
                            <div class="d-flex flex-column flex-grow-1 ps-3">
                                <div class="card-body p-0">
                                    <h6 class="card-title fw-semibold mb-1" style="color: #2C3930;">{{ item.label }}</h6>
                                    <p class="card-text text-muted small mb-2">{{ item.description }}</p>
                                    <p class="fw-semilight text-dark fst-italic mb-2">RM {{ item.price }}</p>
                                </div>
                                <button class="btn btn-sm mt-2 align-self-center" :disabled="isInCart(item)" @click="addToCart(item)" style="background-color: #3F4F44; color: #ffffff; font-style: italic;">
                                    {{ isInCart(item) ? 'Added!' : 'Add to Cart' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <transition name="fade">
                  <div v-if="sortedImages.length === 0" class="col-12 text-center">
                      <p class="text-muted fst-italic">No items match your search or filter criteria.</p>
                  </div>
                </transition>
            </transition-group>
        </div>
      </div>
    </section>  
  `,
  data() {
    return {
      pageReady: false,
      observer: null, // To hold the IntersectionObserver instance
      currentCard: 0,
      addedItems: [],
      searchQuery: '',
      sortOrder: null,
      allDetails: {},
      allDescriptions: {}
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
    serviceTitle() {
      return this.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    serviceImages() {
      return this.allDetails[this.slug]?.items || [];
    },
    serviceDescription() {
      return this.allDetails[this.slug]?.description || "Details coming soon.";
    },
    filteredImages() {
      const query = this.searchQuery.toLowerCase();
      return this.serviceImages.filter(img =>
        img.label.toLowerCase().includes(query) ||
        img.description.toLowerCase().includes(query)
      );
    },
    sortedImages() {
      const images = [...this.filteredImages];
      if (this.sortOrder === 'asc') return images.sort((a, b) => a.price - b.price);
      if (this.sortOrder === 'desc') return images.sort((a, b) => b.price - a.price);
      return images;
    },
    isMobile() {
      return window.innerWidth <= 768;
    },
    visibleCards() {
      if (!this.serviceImages || this.serviceImages.length === 0) return [];
  
      const total = this.serviceImages.length;
      const getIndex = (i) => (i + total) % total;
  
      if (this.isMobile) {
        return [{ ...this.serviceImages[this.currentCard], _index: this.currentCard }];
      } else {
        const leftIndex = getIndex(this.currentCard - 1);
        const centerIndex = getIndex(this.currentCard);
        const rightIndex = getIndex(this.currentCard + 1);
        return [leftIndex, centerIndex, rightIndex].map(i => ({ ...this.serviceImages[i], _index: i }));
      }
    }
  },
  methods: {
    initializeAnimations() {
        const styleId = 'service-detail-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .fade-in-up {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                transition-delay: var(--animation-delay, 0s);
            }
            .fade-in-up.is-visible {
                opacity: 1;
                transform: translateY(0);
            }
            .list-enter-active, .list-leave-active { transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1); }
            .list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }
            .list-move { transition: transform 0.6s cubic-bezier(0.55, 0, 0.1, 1); }
            .fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
            .fade-enter-from, .fade-leave-to { opacity: 0; }
            .carousel-card { transition: transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease; }
            .center-card { transform: scale(1.05); opacity: 1; z-index: 10; filter: brightness(1); }
            .side-card { transform: scale(0.85); opacity: 0.6; z-index: 1; filter: brightness(0.9); }
        `;
        document.head.appendChild(style);

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const elementsToAnimate = this.$el.querySelectorAll('.fade-in-up');
        elementsToAnimate.forEach(el => this.observer.observe(el));
    },
    nextCard() {
      if (this.serviceImages.length > 0) {
        this.currentCard = (this.currentCard + 1) % this.serviceImages.length;
      }
    },
    prevCard() {
      if (this.serviceImages.length > 0) {
        this.currentCard = (this.currentCard - 1 + this.serviceImages.length) % this.serviceImages.length;
      }
    },
    formatPrice(value) {
      return 'RM ' + parseFloat(value).toFixed(2);
    },
    /* ——— add item ——— */
    addToCart(img){
      const logged = JSON.parse(localStorage.getItem('loggedInUser')||'null');
      if (!logged?.id) { this.$router.push('/login'); return; }

      fetch('https://idd-finalproject.onrender.com/api/add-to-cart',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          user_id : logged.id,
          item_name: img.label    // quantity is fixed to 1 inside PHP
        })
      })
      .then(r=>r.json())
      .then(()=> this.syncAddedItems());
    },

    /* ——— refresh local “already-in-cart” list ——— */
    syncAddedItems(){
      const logged = JSON.parse(localStorage.getItem('loggedInUser')||'null');
      if (!logged?.id){ this.addedItems=[]; return; }

      fetch(`https://idd-finalproject.onrender.com/api/get-cart?user_id=${logged.id}`)
        .then(r=>r.json())
        .then(resp=>{
          if(resp.success){
            this.addedItems = resp.items.map(i=>i.item_name);
          }
        });
    },

    /* ——— helper for button disable text ——— */
    isInCart(img){ return this.addedItems.includes(img.label); }
  },
  mounted() {
    fetch('data/services.json')
      .then(res => res.json())
      .then(data => {
        this.allDetails = data.details;
        this.syncAddedItems();          // ←  fixed name
        this.currentCard = 0;
        this.pageReady = true;
        this.$nextTick(() => this.initializeAnimations());
      });
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
    const style = document.getElementById('service-detail-styles');
    if (style) style.remove();
  }
};  
