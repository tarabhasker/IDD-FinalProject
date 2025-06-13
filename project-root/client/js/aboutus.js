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
  `,
  data() {
      return {
          observer: null
      };
  },
  mounted() {
      // Inject styles for decorations and animations
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

          /* Animation base styles */
          .fade-in-up, .fade-in-left, .fade-in-right {
              opacity: 0;
              transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          .fade-in-up { transform: translateY(40px); }
          .fade-in-left { transform: translateX(-40px); }
          .fade-in-right { transform: translateX(40px); }

          /* Animation visible state */
          .is-visible {
              opacity: 1;
              transform: none;
          }
      `;
      document.head.appendChild(style);

      // Set up the Intersection Observer to trigger animations
      this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('is-visible');
                  this.observer.unobserve(entry.target);
              }
          });
      }, { threshold: 0.1 });

      const elementsToAnimate = this.$el.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
      elementsToAnimate.forEach(el => this.observer.observe(el));
  },
  beforeUnmount() {
      // Clean up observer and styles
      if (this.observer) {
          this.observer.disconnect();
      }
      const style = document.getElementById('about-us-styles');
      if (style) {
          style.remove();
      }
  }
};