window.FormPage = {
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

      <div class="container">

        <!-- heading -->
        <div class="text-center mb-5 pb-3 fade-in-up">
          <h3 class="display-5 fw-semibold" style="color:#2C3930;">Get&nbsp;In&nbsp;Touch</h3>
          <p class="fs-6 text-secondary">We’d love to hear from you. Send us your message below.</p>
        </div>

        <!-- form card -->
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow border-0 rounded-4 fade-in-up">
              <div class="card-body p-4 p-md-5" style="background-color:#f9f6f2;">
                <form @submit.prevent="submitForm">

                  <!-- name + email -->
                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <label class="form-label fw-medium">Full Name</label>
                      <input v-model="form.name" type="text"
                             class="form-control form-control-lg" required>
                    </div>
                    <div class="col-md-6 mb-4">
                      <label class="form-label fw-medium">Email</label>
                      <input v-model="form.email" type="email"
                             class="form-control form-control-lg" required>
                    </div>
                  </div>

                  <!-- service dropdown -->
                  <div class="mb-4">
                    <label class="form-label fw-medium">Service of Interest</label>
                    <div class="dropdown">
                      <button class="btn form-control form-control-lg text-start d-flex
                                     justify-content-between align-items-center"
                              type="button" data-bs-toggle="dropdown" aria-expanded="false"
                              style="background-color:#fff;">
                        <span :class="{'text-muted':!form.subject}">
                          {{ form.subject || 'Select a service' }}
                        </span>
                        <i class="bi bi-chevron-down text-muted"></i>
                      </button>
                      <ul class="dropdown-menu w-100 shadow-sm">
                        <li v-for="option in services" :key="option">
                          <a class="dropdown-item py-2" href="#"
                             @click.prevent="form.subject = option">{{ option }}</a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- message -->
                  <div class="mb-4">
                    <label class="form-label fw-medium">Message</label>
                    <textarea v-model="form.message" class="form-control form-control-lg"
                              rows="5" required></textarea>
                  </div>

                  <!-- submit -->
                  <button type="submit"
                          class="btn checkout-btn btn-lg w-100 mt-3"
                          :disabled="sending"
                          style="background-color:#A27B5C;color:#fff;letter-spacing:1px;font-weight:500;">
                    <span v-if="sending" class="spinner-border spinner-border-sm me-2"
                          role="status" aria-hidden="true"></span>
                    Send&nbsp;Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- success modal -->
        <div class="modal fade" id="contactSuccessModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-sm rounded-4">
              <div class="modal-body text-center p-5">
                <i class="bi bi-check-circle-fill text-success mb-3" style="font-size:3.5rem;"></i>
                <h5 class="fw-semibold fs-4 mb-3" style="color:#3b2f2f;">Message&nbsp;Sent!</h5>
                <p class="text-muted">Thank you for reaching out. We’ll get back to you soon.</p>
                <button class="btn btn-dark mt-3 px-4 py-2" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,

  data () {
    return {
      /* form inputs --------------------------------------- */
      form: { name: '', email: '', subject: '', message: '' },
  
      /* dropdown options ---------------------------------- */
      services: [
        'Decoration',
        'Dress and Accessories',
        'Event Planning',
        'Other Inquiry'
      ],
  
      /* ui-state ------------------------------------------ */
      sending: false,
  
      /* private ref for one-and-only Bootstrap Modal ------ */
      _successModal: null
    };
  },
  computed: {
    /* always return the same bootstrap.Modal instance      */
    successModal () {
      return (
        this._successModal ||
        (this._successModal = new bootstrap.Modal(
          document.getElementById('contactSuccessModal')
        ))
      );
    }
  },

  methods:{
    /* ---------- submit ---------- */
    async submitForm () {
      if (this.sending) return;
      this.sending = true;
  
      /* send to your /api/contact route */
      try {
        const res  = await fetch('/api/contact', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify(this.form)
        });
        const json = await res.json();
  
        if (!json.success) throw new Error(json.error || 'Mail failed');
  
        /* ── success → show modal ───────────────────────── */
        const modalEl = this.successModal._element;
  
        /* clean-up after it fades out (once!) */
        modalEl.addEventListener(
          'hidden.bs.modal',
          () => {
            /* dispose + forget the single instance */
            this.successModal.dispose();
            this._successModal = null;
  
            /* remove any stray backdrops / classes */
            document.querySelectorAll('.modal-backdrop')
                    .forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('padding-right');
          },
          { once: true }
        );
  
        this.successModal.show();
  
        /* reset form for next message */
        this.form = { name: '', email: '', subject: '', message: '' };
  
      } catch (err) {
        alert(err.message || 'Network error – please try again.');
      } finally {
        this.sending = false;
      }
    },
  
    /* ---------- pre-fill inputs from logged-in user ---------- */
    async prefillFromUser () {
      /* 1 – check storage */
      let stored =
        JSON.parse(localStorage.getItem('loggedInUser')   || 'null') ??
        JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');
  
      if (!stored?.email) return;            // not logged-in
  
      /* 2 – fetch fresh copy if bits are missing */
      if (!stored.full_name || !stored.last_name) {
        try {
          const res = await fetch(
            `/api/get-user?email=${encodeURIComponent(stored.email)}`
          );
          const rsp = await res.json();
          if (rsp.success) {
            stored = { ...stored, ...rsp.user };
            localStorage.setItem('loggedInUser', JSON.stringify(stored));
          }
        } catch {/* ignore network failure */}
      }
  
      /* 3 – write into form */
      this.form.name  = [stored.full_name, stored.last_name]
                        .filter(Boolean).join(' ').trim();
      this.form.email = stored.email || '';
    }
  },

  /* ---------- mounted ---------- */
  mounted(){
    /* animations + hover (unchanged) */
    if(!document.getElementById('formpage-style')){
      const css=document.createElement('style'); css.id='formpage-style';
      css.textContent=`
.fade-in-up{opacity:0;transform:translateY(35px);
  transition:opacity .7s cubic-bezier(.25,.8,.25,1),
             transform .7s cubic-bezier(.25,.8,.25,1);}
.fade-in-up.is-visible{opacity:1;transform:none;}
.btn.checkout-btn{transition:transform .25s ease,box-shadow .25s ease;}
.btn.checkout-btn:hover{transform:translateY(-2px);
  box-shadow:0 8px 18px -6px rgba(0,0,0,.25);}
.btn.checkout-btn:active{transform:none;box-shadow:none;}
      `;
      document.head.appendChild(css);
    }

    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);} });
    },{threshold:.15});
    this.$el.querySelectorAll('.fade-in-up').forEach(el=>io.observe(el));

    /* finally – auto-fill */
    this.prefillFromUser();
  }
};