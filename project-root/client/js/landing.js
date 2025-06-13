window.LandingPage = {
    template: `
      <div>
        <!-- Hero Section -->
        <header class="hero-section" id="heroSection">
          <div class="hero-overlay"></div>
          <div class="container hero-content">
            <div class="hero-title">
              <img src="images/mainlogo.svg" alt="Eternally Logo">
            </div>
            <a href="#contact" class="btn hero-btn">Plan My Wedding</a>
          </div>
          <div class="image-indicators" id="imageIndicators"></div>
        </header>
  
        <!-- Services Section -->
        <section id="services" class="py-3 my-5" style="background-color: #fff;">
          <div class="container text-center">
            <h2 class="mb-5 display-3" style="color: #3b2f2f;">Wedding Planning Services</h2>
            <div class="row g-4">
              <div class="col-md-4" v-for="(service, index) in services" :key="index">
                <img :src="service.image" :alt="service.title" class="service-img">
                <div class="service-card mt-3">
                  <h5 class="service-title">{{ service.title }}</h5>
                  <p class="service-text">{{ truncate(service.description, 100) }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <!-- Testimonials Section -->
        <section class="testimonials-section position-relative text-white">
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
  
        <!-- Instagram Section -->
        <section class="text-center py-5 mb-5" style="background-color: #ffffff;">
          <hr class="mx-auto my-5" style="width: 90%; height: 1px; background-color: #7d7d7d; border: none;" />
          <div class="container">
            <h2 class="mb-2 display-6 text-black" style="letter-spacing: 3px; font-weight: 300;">Follow us on Instagram</h2>
            <p class="mb-4 fst-italic text-muted">@yourseternally.co</p>
  
            <div class="row justify-content-center gx-4 gy-4">
              <div class="col-6 col-md-4 col-lg-2" v-for="(img, i) in instaImages" :key="i">
                <a :href="img.link" target="_blank" class="insta-link d-block position-relative overflow-hidden rounded-3 shadow-sm">
                  <img :src="img.src" class="w-100 h-100 object-fit-cover" :alt="'Instagram ' + (i + 1)">
                  <div class="insta-hover-overlay d-flex align-items-center justify-content-center">
                    <i class="bi bi-instagram fs-3 text-white"></i>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <hr class="mx-auto mt-5" style="width: 90%; height: 1px; background-color: #7d7d7d; border: none;" />
        </section>
  
        <!-- Contact Section -->
        <section id="contact" class="py-5" style="background-color: #1b1815; color: #f4f1ed;">
          <div class="container">
            <h3 class="text-left mb-5 display-6">Get in Touch!</h3>
            <div class="row g-4 justify-content-center">
              <div class="col-md-4">
                <div class="border p-4 h-100 rounded">
                  <h5 class="mb-3">Reservations Office</h5>
                  <p class="mb-2"><i class="bi bi-geo-alt me-2"></i>123 Anywhere St., Any City ST 12345</p>
                  <p class="mb-2"><i class="bi bi-phone me-2"></i>1123-456-7890</p>
                  <p class="mb-0"><i class="bi bi-envelope me-2"></i>
                    <a href="mailto:hello@reallygreatsite.com" style="color: #f4f1ed; text-decoration: underline;">hello@reallygreatsite.com</a>
                  </p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="border p-4 h-100 rounded">
                  <h5 class="mb-3">Office Hours</h5>
                  <p class="mb-2">Monday to Friday<br>9:00 am to 6:00 pm</p>
                  <p class="mb-0">Saturday<br>9:00 am to 12:00 noon</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="border p-4 h-100 rounded">
                  <h5 class="mb-3">Contact Us</h5>
                  <div class="d-flex justify-content-center gap-3 mb-3">
                    <a href="#" class="fs-4" style="color: #f4f1ed;"><i class="bi bi-facebook"></i></a>
                    <a href="#" class="fs-4" style="color: #f4f1ed;"><i class="bi bi-twitter"></i></a>
                    <a href="#" class="fs-4" style="color: #f4f1ed;"><i class="bi bi-instagram"></i></a>
                  </div>
                  <a href="#contact" class="btn btn-outline-light w-100">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `,
    data() {
      return {
        services: [
          { title: 'Decoration', image: 'images/indexloc.jpeg', description: 'Unique themes and elegant décor to match your dream wedding style.' },
          { title: 'Dress and Accessories', image: 'images/indexdress.jpeg', description: 'Find the perfect gown, veil, and accessories to complete your look.' },
          { title: 'Event Planning', image: 'images/indexplan.jpeg', description: 'We organize everything from invitations to the last dance with care.' }
        ],
        testimonials: [
          { text: "Boost your product and service's credibility by adding testimonials from your clients.", source: "Santa Solana Post" },
          { text: "Feedback from others who've tried it is invaluable.", source: "Mariana's Luxe Travels" },
          { text: "People love recommendations. Add testimonials to build trust.", source: "Fairhill Journal" }
        ],
        instaImages: [
          { src: 'images/insta1.jpeg', link: 'https://www.instagram.com/p/DIZjW1IBHN_/' },
          { src: 'images/insta2.jpeg', link: 'https://www.instagram.com/p/DIZjGf8By-9/' },
          { src: 'images/insta3.jpeg', link: 'https://www.instagram.com/p/DIZjRQ8hfu6/' },
          { src: 'images/insta4.jpeg', link: 'https://www.instagram.com/p/DIZi8iEhBvO/' },
          { src: 'images/insta5.jpeg', link: 'https://www.instagram.com/p/DIZiynzBNR8/' },
          { src: 'images/insta6.jpeg', link: 'https://www.instagram.com/p/DIZjBVkhqHt/' }
        ],
        images: ['images/index1.jpeg', 'images/index2.jpeg'],
        index: 0,
        interval: null
      };
    },
    methods: {
      truncate(value, length) {
        return value.length > length ? value.slice(0, length) + '...' : value;
      },
      updateBackground() {
        const section = document.getElementById('heroSection');
        const indicators = document.getElementById('imageIndicators');
        section.style.backgroundImage = `url('${this.images[this.index]}')`;
        Array.from(indicators.children).forEach((dot, i) =>
          dot.classList.toggle('active', i === this.index)
        );
      },
      nextImage() {
        this.index = (this.index + 1) % this.images.length;
        this.updateBackground();
      },
      resetInterval() {
        clearInterval(this.interval);
        this.interval = setInterval(this.nextImage, 5000);
      },
      toggleMenu() {
        document.getElementById("mobileMenu").classList.toggle("active");
      }
    },
    mounted() {
      const indicators = document.getElementById('imageIndicators');
      this.images.forEach((_, i) => {
        const btn = document.createElement('button');
        if (i === 0) btn.classList.add('active');
        btn.onclick = () => {
          this.index = i;
          this.updateBackground();
          this.resetInterval();
        };
        indicators.appendChild(btn);
      });
      this.updateBackground();
      this.interval = setInterval(this.nextImage, 5000);
  
      // Attach global menu toggle (optional)
      window.toggleMenu = this.toggleMenu;
    }
  };
  