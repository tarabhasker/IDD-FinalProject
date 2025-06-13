const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Define the main App component that will hold the layout
const App = {
  template: `
    <div>
      <navbar v-if="showLayout"></navbar>
      <router-view></router-view>
      <app-footer v-if="showLayout"></app-footer>
    </div>
  `,
  computed: {
    showLayout() {
      // This checks the route's metadata. If 'hideLayout' is true, it returns false.
      return !this.$route.meta.hideLayout;
    }
  }
};

const HomePage = {
  template: `
    <div>
      <header class="hero-section" id="heroSection">
        <div class="hero-overlay"></div>
        <div class="container hero-content">
          <div class="hero-title">
            <img src="images/mainlogo.svg" alt="Eternally Logo">
          </div>
          <router-link to="/contactform" class="btn hero-btn">Plan My Wedding</router-link>
        </div>
        <div class="image-indicators" id="imageIndicators"></div>
      </header>

      <section id="services" class="py-3" style="background-color: #fff; min-height: calc(100vh - 70px);">
        <div class="container text-center h-100 d-flex flex-column justify-content-center">
          <h3 class="mb-5 mt-3 display-4 service-heading" style="color: #2C3930;">{{ heading }}</h3>
          <div class="row g-4">
            <div class="col-md-4" v-for="(service, index) in services" :key="index">
              <div class="service-item">
                <div class="img-container">
                  <img :src="service.image" :alt="service.title" class="service-img">
                  <div class="img-overlay"></div>
                </div>
                <div class="service-card mt-3">
                  <h4 class="service-title">
                    <span class="title-text">{{ service.title }}</span>
                    <span class="title-underline"></span>
                  </h4>
                  <p class="service-text">{{ truncate(service.description, 100) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="testimonials-section position-relative text-white" style="min-height: calc(100vh - 70px);">
        <div class="testimonials-bg"></div>
        <div class="container position-relative text-center py-5">
          <h2 class="mb-5 display-5 fw-normal">Voted Wedding Planner of the Year</h2>
          <div class="row justify-content-center g-5">
            <div class="col-md-4" v-for="(testimonial, index) in testimonials" :key="index">
              <blockquote class="testimonial text-white">
                <div class="quote-icon">&ldquo;</div>
                <p>{{ testimonial.text }}</p>
                <footer class="blockquote-footer text-white mt-4">{{ testimonial.source }}</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section class="text-center pb-5" style="background-color: #fff;">
        <hr class="mx-auto my-5" style="width: 90%; height: 1px; background-color: #7d7d7d; border: none;" />
        <div class="container">
          <h2 class="mb-2 display-6 text-[#2C3930]" style="letter-spacing: 3px; font-weight: 300;">Follow us on Instagram</h2>
          <p class="mb-4 fst-italic text-muted">@yourseternally.co</p>

          <div class="row justify-content-center gx-4 gy-4">
            <div v-for="(img, i) in instagram" :key="i" class="col-6 col-md-4 col-lg-2">
              <a :href="img.link" target="_blank" class="insta-link d-block position-relative overflow-hidden rounded-3 shadow-sm">
                <img :src="img.src" class="w-100 h-100 object-fit-cover" :alt="'Instagram ' + (i + 1)">
                <div class="insta-hover-overlay d-flex align-items-center justify-content-center">
                  <i class="bi bi-instagram fs-3 text-white"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
        <hr class="mx-auto" style="width: 90%; height: 1px; background-color: #7d7d7d; border: none;" />
      </section>
    </div>
  `,
  data() {
    return {
      heading: 'Wedding Planning Services',
      services: [
        { title: 'Decoration', image: 'images/indexloc.jpeg', description: 'Unique themes and elegant décor to match your dream wedding style.' },
        { title: 'Dress and Accessories', image: 'images/indexdress.jpeg', description: 'Find the perfect gown, veil, and accessories to complete your look.' },
        { title: 'Event Planning', image: 'images/indexplan.jpeg', description: 'We organize everything from invitations to the last dance with care.' }
      ],
      testimonials: [
        { text: "Boost your product and service's credibility by adding testimonials from your clients.", source: "Santa Solana Post" },
        { text: "People love recommendations so feedback from others who've tried it is invaluable.", source: "Mariana's Luxe Travels" },
        { text: "Boost your product and service's credibility by adding testimonials from your clients.", source: "Fairhill Journal" }
      ],
      instagram: [
        { src: 'images/insta1.jpeg', link: 'https://www.instagram.com/p/DIZjW1IBHN_/' },
        { src: 'images/insta2.jpeg', link: 'https://www.instagram.com/p/DIZjGf8By-9/' },
        { src: 'images/insta3.jpeg', link: 'https://www.instagram.com/p/DIZjRQ8hfu6/' },
        { src: 'images/insta4.jpeg', link: 'https://www.instagram.com/p/DIZi8iEhBvO/' },
        { src: 'images/insta5.jpeg', link: 'https://www.instagram.com/p/DIZiynzBNR8/' },
        { src: 'images/insta6.jpeg', link: 'https://www.instagram.com/p/DIZjBVkhqHt/' }
      ],
    };
  },
  methods: {
    truncate(text, length) {
      return text.length > length ? text.slice(0, length) + '...' : text;
    }
  },
  mounted() {
    // Inject slideshow logic
    const images = ['images/index1.jpeg', 'images/index2.jpeg'];
    const section = document.getElementById('heroSection');
    const indicators = document.getElementById('imageIndicators');
    let index = 0;

    images.forEach((_, i) => {
      const btn = document.createElement('button');
      if (i === 0) btn.classList.add('active');
      btn.onclick = () => {
        index = i;
        updateBackground();
        resetInterval();
      };
      indicators.appendChild(btn);
    });

    const updateBackground = () => {
      section.style.backgroundImage = `url('${images[index]}')`;
      [...indicators.children].forEach((dot, i) =>
        dot.classList.toggle('active', i === index)
      );
    };

    const nextImage = () => {
      index = (index + 1) % images.length;
      updateBackground();
    };

    let interval = setInterval(nextImage, 5000);
    const resetInterval = () => {
      clearInterval(interval);
      interval = setInterval(nextImage, 5000);
    };

    updateBackground();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('services-animate');
        }
      });
    }, { threshold: 0.1 });
  
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      observer.observe(servicesSection);
    }
  }
};



const routes = [
  { path: '/', component: HomePage },
  { path: '/products', component: ProductsPage },
  { path: '/services/:slug', component: ServiceDetailPage },
  // MODIFIED: Added a meta field to the login route
  { path: '/login', component: LoginPage, meta: { hideLayout: true } },
  // NOTE: You can add meta: { hideLayout: true } to any other route to hide the navbar and footer
  { path: '/account', component: AccountPage },
  { path: '/cart', component: CartPage },
  { path: '/checkout', component: window.CheckoutPage },
  { path: '/mypurchases', component: window.MyPurchasesPage},
  { path: '/contactform', component: window.FormPage },
  { path: '/about', component: window.AboutUsPage }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// MODIFIED: Create the app using the new main App component
const app = createApp(App);
app.use(router);

// Register global components
app.component('navbar', Navbar);
app.component('app-footer', Footer);

app.config.globalProperties.$filters = {
  currency(value) {
    return 'RM ' + parseFloat(value).toFixed(2);
  }
};

app.mount('#app');