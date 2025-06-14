window.AboutUsPage = {
  template: `
    <section class="py-5" style="background-color: #f9f6f2; overflow-x: hidden;">
      <div class="container">
        <div class="text-center mb-5 pb-4 fade-in-up">
          <h2 class="display-4 fw-semibold" style="color: #2C3930;">Our Story</h2>
          <p class="fs-5 text-secondary mt-3">Your journey begins with a story — let us help you write yours.</p>
          <div class="title-divider"></div>
        </div>

        <div class="row align-items-center mb-5 pb-5">
          <div class="col-md-6 mb-4 mb-md-0 fade-in-left">
            <div class="decorative-image-frame">
              <img src="images/about.jpg" class="img-fluid rounded" alt="Our Story">
            </div>
          </div>
          <div class="col-md-6 fade-in-right">
            <h3 class="fw-semibold mb-3" style="color: #A27B5C;">The Beginning</h3>
            <p class="text-muted lh-lg">
              Eternally began with a single, heartfelt goal — to turn once-in-a-lifetime moments into timeless memories.
              With years of experience in wedding styling, event planning, and personalized bridal support,
              we pride ourselves on attention to detail and our dedicated approach to every couple’s dream.
            </p>
          </div>
        </div>

        <div class="row align-items-center mt-5">
          <div class="col-md-6 order-md-2 mb-4 mb-md-0 fade-in-right">
            <div class="decorative-image-frame frame-right">
              <img src="images/groupphoto.jpg" class="img-fluid rounded" alt="Our Team">
            </div>
          </div>
          <div class="col-md-6 order-md-1 fade-in-left">
            <h3 class="fw-semibold mb-3" style="color: #A27B5C;">Why Choose Us</h3>
            <p class="text-muted lh-lg">
              From intimate ceremonies to grand celebrations, we tailor every experience to reflect your unique style and values.
              Our team consists of passionate creatives, planners, and designers — all committed to bringing your vision to life with grace, joy, and unparalleled professionalism.
            </p>
          </div>
        </div>
      </div>
    </section>
      <section class="partner-section text-white fade-in-up position-relative">
    <img src="images/winebg1.jpeg" class="position-absolute w-100 h-100 object-fit-cover z-n1" style="top:0; left:0;" alt="Background" />
    <div class="noir-bg-overlay"></div>
    <div class="container text-center position-relative">
      <h2 class="display-5 fw-bold mb-3" style="color: #f4e9dc;">In Celebration with</h2>
      <h1 class="mb-4 display-3 fw-semibold noir-header">Noir & Oak</h1>
      <p class="fs-5 text-light mb-4" style="max-width: 700px; margin: 0 auto;">
        A curated wine experience — elevating love, laughter, and every elegant toast.
      </p>
      <a href="https://noirandoak.onrender.com/" target="_blank" class="btn btn-outline-light mt-3 px-4 py-2 noir-btn">
        Visit Their Cellar →
      </a>
    </div>
  </section>

  `,
  data() {
    return {
      observer: null
    };
  },
  mounted() {
    const style = document.createElement('style');
    style.id = 'about-us-styles';
    style.innerHTML = `
      .title-divider {
        width: 80px;
        height: 3px;
        background-color: #A27B5C;
        margin: 1.5rem auto 0;
        border-radius: 2px;
      }

      .decorative-image-frame {
        position: relative;
        padding: 1rem;
        border: 1px solid #e0d8cd;
        background-color: #fff;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
      }
      .decorative-image-frame::before {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        width: 100%;
        height: 100%;
        border: 1px solid #e0d8cd;
        z-index: -1;
        transition: all 0.4s ease;
      }
      .decorative-image-frame.frame-right::before {
        left: auto;
        right: -10px;
      }
      .decorative-image-frame > img {
        width: 100%;
        height: 400px;
        object-fit: cover;
      }

      .fade-in-up, .fade-in-left, .fade-in-right {
        opacity: 0;
        transition: opacity 1.2s ease-out, transform 1.2s ease-out;
      }
      .fade-in-up { transform: translateY(60px); }
      .fade-in-left { transform: translateX(-60px); }
      .fade-in-right { transform: translateX(60px); }
      .is-visible {
        opacity: 1;
        transform: none;
      }

      .partner-section {
        position: relative;
        padding-top: 6rem;
        padding-bottom: 6rem;
        overflow: hidden;
        z-index: 0;
      }
      .noir-bg-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(44,44,44,0.9));
        z-index: -1;
      }
      .noir-header {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        letter-spacing: 2px;
        color: #E5C9B3;
        animation: glowUp 3s ease-in-out infinite alternate;
      }
      .noir-btn {
        border: 2px solid #E5C9B3;
        color: #E5C9B3;
        transition: all 0.4s ease;
      }
      .noir-btn:hover {
        background-color: #E5C9B3;
        color: #2c2c2c;
        transform: scale(1.05);
      }

      @keyframes glowUp {
        0% { text-shadow: 0 0 8px rgba(229, 201, 179, 0.3); }
        100% { text-shadow: 0 0 20px rgba(229, 201, 179, 0.7); }
      }
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

    this.$nextTick(() => {
      const animatedEls = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
      animatedEls.forEach(el => this.observer.observe(el));
    });
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
    const style = document.getElementById('about-us-styles');
    if (style) style.remove();
  }
};
