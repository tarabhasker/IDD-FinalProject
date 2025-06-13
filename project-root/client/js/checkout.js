window.CheckoutPage = {
  template: `

  <!-- ────────── Add-Location Modal (with Google Places) ────────── -->
<div class="modal fade" id="locationModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-semibold">Select Wedding Venue</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <!-- quick picks -->
        <label class="form-label">Popular venues</label>
        <select v-model="tempLocation" class="form-select mb-3">
          <option value="" disabled>Select…</option>
          <option v-for="v in locationList" :value="v">{{ v }}</option>
        </select>

        <!-- google autocomplete -->
        <label class="form-label">Or type an address</label>
        <input  ref="addressInput"
                v-model="tempLocation"
                type="text"
                class="form-control"
                placeholder="Start typing…">
      </div>

      <div class="modal-footer border-0">
        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-brand" @click="saveLocation">Save</button>
      </div>
    </div>
  </div>
</div>
<!-- ───────────────────────────────────────────────────────────── -->

<!-- ───────────────────────────────────────────────────────────── -->
<div class="modal fade" id="cardModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-semibold">Add payment card</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <form @submit.prevent="saveCard">
        <div class="modal-body">

          <label class="form-label">Name on card</label>
          <input v-model.trim="newCard.name" class="form-control mb-3" required>

          <label class="form-label">Card number</label>
          <input v-model.trim="newCard.number"
                 class="form-control mb-3"
                 maxlength="19"  pattern="\\d{13,19}"
                 placeholder="•••• •••• •••• ••••" required>

          <div class="row g-2">
            <div class="col">
              <label class="form-label">Exp MM</label>
              <input v-model.number="newCard.exp_m" type="number" min="1" max="12"
                     class="form-control" placeholder="MM" required>
            </div>
            <div class="col">
              <label class="form-label">Exp YY</label>
              <input v-model.number="newCard.exp_y" type="number"
                     :min="new Date().getFullYear()%100"
                     class="form-control" placeholder="YY" required>
            </div>
            <div class="col">
              <label class="form-label">CVV</label>
              <input v-model.trim="newCard.cvv" type="password"
                     class="form-control" maxlength="4" required>
            </div>
          </div>

        </div>
        <div class="modal-footer border-0">
          <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-brand" :disabled="cardSaving">
            <span v-if="cardSaving" class="spinner-border spinner-border-sm me-2"></span>
            Save card
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
<!-- ───────────────────────────────────────────────────────────── -->



     <section class="py-5" style="background-color: #f9f6f2; overflow-x: hidden;">
      <div class="container">
        <div class="flex-grow-1 mb-5">
          <h1 style="font-size: 3.2rem; font-weight: 500; color: #2b2b2b; margin-bottom: 1.5rem;">
            Checkout
          </h1>
        </div>

        <div v-if="cart.length === 0" class="text-center text-muted fs-5">Your cart is empty.</div>

        <div v-else>
          <div class="row g-4 g-md-5">
            
            <div class="col-md-4 order-md-2">
              <div class="vstack gap-4">
                <div class="border rounded shadow-sm p-4" style="background-color: #fff;">
                  <h4 class="fw-semibold mb-3 d-flex align-items-center">
                    <span class="me-auto">Review Order</span>

                    <!-- arrow link -->
                    <router-link to="/cart"
                                class="arrow-link text-decoration-none">
                      <i class="bi bi-arrow-right-circle fs-5"></i>
                    </router-link>


                  </h4>
                  <!-- one line per cart item -->
                  <div v-for="(item, index) in cart"
                      :key="index"
                      class="d-flex align-items-center mb-2">

                    <!-- picture + title grows -->
                    <div class="d-flex align-items-center flex-grow-1">
                      <img :src="item.image"
                          class="rounded border me-2 flex-shrink-0"
                          style="width:32px;height:32px;object-fit:cover;">
                      <span class="small">{{ item.label }}</span>
                    </div>

                    <!-- price (fixed width, left-aligned) -->
                    <div class="small flex-shrink-0 text-start me-3" style="width:90px;">
                      RM&nbsp;{{ item.price }}
                    </div>

                    <!-- quantity (fixed width, left-aligned) -->
                    <div class="small flex-shrink-0 text-start" style="width:40px;">
                      ×{{ item.qty }}
                    </div>
                  </div>


                  <hr>
                  <div class="d-flex justify-content-between small text-muted">
                    <span>Postage</span>
                    <span>RM {{ postage }}</span>
                  </div>
                  <div class="d-flex justify-content-between small text-muted">
                    <span>Subtotal</span>
                    <span>RM {{ subtotal }}</span>
                  </div>
                  <div class="d-flex justify-content-between small text-muted text-success" v-if="discount > 0">
                    <span>Voucher</span>
                    <span>-RM {{ discount }}</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold mt-2" style="color: #3b2f2f;">
                    <span>Grand Total</span>
                    <span>RM {{ totalPrice }}</span>
                  </div>
                </div>

                <div class="border rounded shadow-sm p-4" style="background-color: #fff;">
                  <h4 class="fw-semibold mb-4">Book with confidence</h4>
                  <div class="vstack gap-3">
                    <div class="p-3 bg-light rounded d-flex align-items-start gap-3">
                      <i class="bi bi-patch-check-fill fs-4 text-secondary"></i>
                      <div>
                        <div class="fw-semibold">Lowest price guarantee</div>
                        <div class="text-muted small">Find it cheaper? We'll refund the difference</div>
                      </div>
                    </div>
                    <div class="p-3 bg-light rounded d-flex align-items-start gap-3">
                      <i class="bi bi-shield-lock-fill fs-4 text-secondary"></i>
                      <div>
                        <div class="fw-semibold">Privacy protection</div>
                        <div class="text-muted small">We use SSL encryption to keep your data secure</div>
                      </div>
                    </div>
                    <div class="p-3 bg-light rounded d-flex align-items-start gap-3">
                      <i class="bi bi-headset fs-4 text-secondary"></i>
                      <div>
                        <div class="fw-semibold">24/7 global support</div>
                        <div class="text-muted small">Get the answers you need, when you need them</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-8 order-md-1">
              <div class="row">
                <div class="col-md-6 mb-4 mb-md-0">
                  <div class="border rounded shadow-sm p-3 text-center w-100 d-flex flex-column justify-content-between align-items-center"
                      style="background-color:#fff;height:200px;">

                    <i class="bi bi-geo-alt-fill fs-2 text-secondary mb-2"></i>

                    <div>
                      <h6 class="fw-semibold mb-1">
                        {{ location ? location : 'No location saved' }}
                      </h6>
                      <p class="text-muted small mb-2">
                        {{ location ? 'Wedding venue selected' : 'Add your Wedding Venue to proceed!' }}
                      </p>
                    </div>

                    <button class="btn checkout-btn rounded-pill w-100 py-2"
                            style="background-color:#A27B5C;color:#fff;font-size:.95rem;"
                            @click="openLocationModal">
                      {{ location ? 'Change' : '+ Add' }}
                    </button>
                  </div>

                </div>
                <div class="col-md-6">
                  <div class="border rounded shadow-sm p-4 w-100 d-flex flex-column" style="background-color: #fff; height: 200px;">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h5 class="fw-semibold mb-0">Payment Method</h5>
                      <a href="#"
                        @click.prevent.stop="openCardModal"
                        class="small fw-semibold text-decoration-none"
                        style="color:#A27B5C;">
                        + Add
                      </a>
                    </div>
                    <div style="overflow-y: auto; flex-grow: 1; padding-right: 4px;">
                      <div class="vstack">
                        <!-- Show message if no cards saved -->
                        <div v-if="cards.length === 0" class="d-flex mt-3 flex-column align-items-center justify-content-center text-center" style="height: 100%;">
                          <h6 class="fw-semibold mb-1">
                            No Payment Method saved.
                          </h6>
                          <p class="text-muted small mb-2">
                            Add a Payment Method to proceed!
                          </p>
                        </div>
                        <!-- Render saved cards -->
                        <div v-else v-for="c in cards" :key="c.id" class="form-check d-flex align-items-center py-2">
                          <input class="form-check-input me-3" type="radio" name="payment"
                                :id="'card'+c.id" :value="'card:'+c.id" v-model="selectedPay">
                          <label class="form-check-label d-flex align-items-center fs-6" :for="'card'+c.id">
                            <i class="bi bi-credit-card me-2 fs-5"></i>
                            {{ c.brand }} •••• {{ c.last4 }}
                          </label>
                          <i class="bi bi-trash text-danger ms-auto pointer"
                            @click="removeCard(c.id)"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              <div>
                <h3 class="fw-semibold mt-5 mb-4">Contact Details</h3>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email</label>
                    <input v-model="email"      type="email" class="form-control rounded-3" placeholder="you@example.com">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Contact No.</label>
                    <input v-model="phone"      type="text"  class="form-control rounded-3" placeholder="+60 12-345 6789">
                  </div>
                </div>
                <hr class="my-4" />
                <h3 class="fw-semibold mb-4">Customer Details</h3>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">First Name</label>
                    <input v-model="firstName"  type="text"  class="form-control rounded-3" placeholder="John">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Last Name</label>
                    <input v-model="lastName"   type="text"  class="form-control rounded-3" placeholder="Doe">
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">Address</label>
                    <textarea v-model="address" class="form-control rounded-3"           rows="3" placeholder="123 Main Street"></textarea>
                  </div>
                </div>
                <hr class="my-4" />
                <h3 class="fw-semibold mb-4">Voucher</h3>
                <div class="input-group mb-3">
                  <input v-model="voucherCode" type="text" class="form-control" placeholder="Enter voucher code" aria-label="Enter voucher code" aria-describedby="button-apply">
                  <button class="btn" style="background-color: #DCD7C9;" type="button" id="button-apply" @click="applyVoucher">Apply</button>
                </div>
                <div v-if="voucherError" class="text-danger fst-italic small mt-1 ms-1">
                  {{ voucherError }}
                </div>

              </div>
            </div> 
          </div>
        </div>

      </div>

      <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-sm rounded">
            <div class="modal-body text-center py-5">
              <i class="bi bi-check-circle-fill text-success mb-3" style="font-size: 3rem;"></i>
              <h5 class="fw-semibold mb-3" style="color: #3b2f2f;">Purchase Successful!</h5>
              <p class="text-muted">Thank you for your order. We will process it shortly.</p>
              <button class="btn btn-outline-dark mt-3 px-4" data-bs-dismiss="modal" @click="goHome">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

          <!-- ─── Sticky Confirm-Order button (same page-side padding) ─── -->
          <div class="sticky-bottom">
            <div class="container py-3 d-flex justify-content-center">
              <button
                class="btn checkout-btn w-100 w-md-auto px-5 py-2"
                style="background-color:#A27B5C;color:#fff;font-size:1.2rem;letter-spacing:1px;"
                :disabled="!formReady || loading"
                @click="confirmCheckout"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Confirm&nbsp;Order
              </button>
            </div>
          </div>
          <!-- ──────────────────────────────────────────────────────────── -->



          


    </section>
  `,
  data() {
    return {
      productIndex: null,
      /* cart & voucher */
      cart: [],
      voucherCode: '',
      discount: 0,
      postage: 0,
      voucherError: '',

      cards:        [],          // ← pulled from backend
      selectedPay:  'cod',       // default
      /* modal form */
      newCard: { name:'', number:'', exp_m:'', exp_y:'', cvv:'' },
      cardSaving:false,

      googleLoaded : false,   // 👉 script once-only
      autocomplete : null,
      SWINBURNE : {   // <─ NEW
        lat : 1.513251,      // Swinburne University of Technology, Kuching
        lng : 110.356903
      },
      tempCoords  : null,
      /* contact details (autofilled) */
      email:     '',
      phone:     '',
      firstName: '',
      lastName:  '',
      address:   '',
      location     : '',   // final chosen value (shown on card & included in order)
      locationList : [     // choices in the popup – extend as you wish
        'Shangri-La Kuala Lumpur',
        'Majestic Hotel KL',
        'Putrajaya Marriott',
        'Mandarin Oriental KL',
        'Other (enter manually)'
      ],
      tempLocation : '',
      loading: false
    };
  },
  
  /* ───────── totals ───────── */
  computed: {
    subtotal () { return this.cart.reduce((t,i)=>t + i.price * i.qty, 0); },
    totalPrice() { return this.subtotal - this.discount + this.postage; },
    formReady() {
      return (
        this.cart.length &&
        this.email.trim()     &&
        this.phone.trim()     &&
        this.firstName.trim() &&
        this.lastName.trim()  &&
        this.address.trim()   &&
        this.location         &&
        this.selectedPay.startsWith('card:') &&
        !this.voucherError
      );
    }
      
  },
  
  /* ───────── methods ───────── */
  methods: {

    loadGoogleScript () {
      return new Promise((resolve, reject) => {
        if (this.googleLoaded) return resolve();
  
        const src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB69z0GItiD960JggExyc5PcOtk_RGOBzI&libraries=places&callback=initGMaps`;
        window.initGMaps = () => {
          this.googleLoaded = true;
          resolve();
        };
  
        const s = document.createElement('script');
        s.src = src; s.onerror = reject; document.head.appendChild(s);
      });
    },

    kmBetween (a, b) {                            // <─ NEW
      const R = 6371;                             // mean Earth radius (km)
      const dLat = (b.lat - a.lat) * Math.PI/180;
      const dLng = (b.lng - a.lng) * Math.PI/180;
      const lat1 = a.lat * Math.PI/180;
      const lat2 = b.lat * Math.PI/180;
  
      const h =
        Math.sin(dLat/2)**2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
  
      return 2 * R * Math.asin(Math.sqrt(h));     // kilometres
    },
  
    /* ---------------- open modal & attach Autocomplete ------------- */
    async openLocationModal () {
      this.tempLocation = this.location || '';
  
      /* 1 – make sure script is ready */
      await this.loadGoogleScript();
  
      /* 2 – show modal */
      const modal = new bootstrap.Modal('#locationModal');
      modal.show();
  
      /* 3 – wait one tick so input is in DOM then bind Places */
      this.$nextTick(() => {
        const input = this.$refs.addressInput;
        if (!input) return;
  
        /* create once */
        if (!this.autocomplete) {
          this.autocomplete = new google.maps.places.Autocomplete(input, {
            types: ['geocode'],             // only addresses
            componentRestrictions: { country: 'my' } // 🇲🇾 optional
          });
  
          this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete.getPlace();
            if (place?.formatted_address) {
              this.tempLocation = place.formatted_address;
            } else {
              this.tempLocation = input.value; // fallback to raw
            }
          });
        }
  
        /* each open → clear previous predictions */
        google.maps.event.trigger(this.autocomplete, 'bounds_changed');
      });


      this.$nextTick(() => {
        const input = this.$refs.addressInput;
        if (!input) return;

        if (!this.autocomplete) {
          this.autocomplete = new google.maps.places.Autocomplete(input, {
            types:['geocode'], componentRestrictions:{ country:'my' }
          });

          this.autocomplete.addListener('place_changed', () => {
            const pl = this.autocomplete.getPlace();
            this.tempLocation = pl.formatted_address || input.value;
            /* NEW */ this.tempCoords   = pl.geometry?.location?.toJSON() || null;
          });
        }
        google.maps.event.trigger(this.autocomplete, 'bounds_changed');
      });
    },
  

    saveLocation: async function () {
      if (!this.tempLocation.trim()) return;

      /* 1 ─ keep the text version the user sees */
      this.location = this.tempLocation.trim();
      localStorage.setItem('checkout_location', this.location);

      /* 2 ─ get coordinates + address-components */
      //  – if the user chose a Places suggestion we already have coords in tempCoords
      //  – otherwise geocode the free-typed / quick-pick address
      let info = this.tempCoords ? { coords: this.tempCoords } : null;

      if (!info) {
        try {
          // geocodeAddress returns { coords:{lat,lng}, components:[ … ] }
          info = await this.geocodeAddress(this.location);
        } catch {
          /* ignore – we’ll fall back to the highest tier later */
        }
      }

      /* 3 ─ decide postage
            - inside Kuching        → RM 5 / km  (distance from Swinburne)
            - elsewhere in Sarawak  → RM 500
            - outside Sarawak       → RM 1000                                 */
      if (info) {
        const comps = info.components || [];

        // pull city & state names (safe – no optional-chaining mix-ups)
        const cityComp  = comps.find(c => c.types.includes('locality'));
        const stateComp = comps.find(c => c.types.includes('administrative_area_level_1'));

        const city  = cityComp  ? cityComp.long_name.toLowerCase()  : '';
        const state = stateComp ? stateComp.long_name.toLowerCase() : '';

        if (city.includes('kuching')) {
          const km = this.kmBetween(this.SWINBURNE, info.coords);
          this.postage = Math.ceil(km) * 5;               // dynamic
        } else if (state.includes('sarawak')) {
          this.postage = 500;                             // flat
        } else {
          this.postage = 1000;                            // flat
        }
      } else {
        // couldn’t geocode – assume farthest distance
        this.postage = 1000;
      }

      /* 4 ─ close the modal */
      bootstrap.Modal.getInstance('#locationModal').hide();
    },

    

    async buildProductIndex () {
      if (this.productIndex) return;           // already built
    
      const res = await fetch('data/services.json');
      const js  = await res.json();
    
      this.productIndex = {};
      Object.values(js.details).forEach(svc => {
        svc.items.forEach(p => {
          this.productIndex[p.label] = { price: p.price, image: p.src };
        });
      });
    },
    /* pull rows from cart table, then enrich with price & image */
    async loadCart () {
      const logged = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      if (!logged?.id) { this.cart = []; return; }

      // ① rows from database
      const res  = await fetch(`https://idd-finalproject.onrender.com/api/get-cart?user_id=${logged.id}`);
      const resp = await res.json();
      if (!resp.success) { this.cart = []; return; }

      // ② make sure we have a price/image lookup
      await this.buildProductIndex();

      // ③ hydrate each DB row
      this.cart = resp.items.map(row => {
        const p = this.productIndex[row.item_name] || {};
        return {
          label : row.item_name,                 // used in template
          qty   : Number(row.quantity) || 1,     // used in template
          price : p.price  || 0,
          image : p.image || 'images/placeholder.png'
        };
      });
    },
  
    /* fetch user info once & autofill */
    async loadUser() {
      const stored = JSON.parse(localStorage.getItem('loggedInUser')||'null');
      if (!stored?.email) return;          // guest checkout
  
      try {
        const res  = await fetch(`https://idd-finalproject.onrender.com/api/get-user?email=${encodeURIComponent(stored.email)}`);
        const resp = await res.json();
        if (resp.success) Object.assign(stored, resp.user);
      } catch {/* ignore network errors – fall back to localStorage copy */}
  
      this.email     = stored.email     || '';
      this.phone     = stored.phone     || '';
      this.firstName = stored.full_name || '';
      this.lastName  = stored.last_name || '';
      this.address   = stored.address   || '';
    },

    async geocodeAddress(addr) {
      await this.loadGoogleScript();               // ensure Maps JS is ready
      return new Promise((resolve, reject) => {
        new google.maps.Geocoder().geocode(
          { address: addr },
          (results, status) => {                   // <-- correct order!
            if (status === 'OK' && results[0]) {
              resolve({
                coords:     results[0].geometry.location.toJSON(),   // {lat,lng}
                components: results[0].address_components            // for state/city
              });
            } else {
              reject(status);
            }
          }
        );
      });
    },    
  
    /* voucher logic (unchanged) */
    applyVoucher() {
      const code = this.voucherCode.trim().toLowerCase();
      this.voucherError = '';
      if (code === 'eternally10')      this.discount = Math.floor(this.subtotal*0.10);
      else if (code === 'eternally50') this.discount = 50;
      else if (!code)                  this.discount = 0, this.voucherError = 'Please enter a voucher code.';
      else                             this.discount = 0, this.voucherError = "Invalid voucher code. Try 'eternally10' or 'eternally50'.";
    },

    openCardModal() { this.newCard={name:'',number:'',exp_m:'',exp_y:'',cvv:''};
                    new bootstrap.Modal('#cardModal').show(); },

  /* ─ add card ─ */
    async saveCard(){
      if(this.cardSaving) return;
      this.cardSaving=true;

      try{
        const res=await fetch('https://idd-finalproject.onrender.com/api/add-card',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({...this.newCard,
                              user_id: JSON.parse(localStorage.loggedInUser).id})
        });
        const j=await res.json();
        if(j.success){
          this.cards.push(j.card);                 // show instantly
          bootstrap.Modal.getInstance('#cardModal').hide();
        }else alert(j.error||'Failed to save');
      }catch{alert('Network error');}
      finally{this.cardSaving=false;}
    },

    /* ─ delete card ─ */
    async removeCard(id){
      if(!confirm('Delete this card?')) return;
      const res=await fetch('https://idd-finalproject.onrender.com/api/delete-card',
                    {method:'POST',headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({id})});
      const j = await res.json();
      if(j.success) this.cards=this.cards.filter(c=>c.id!==id);
      else alert(j.error||'Delete failed');
    },

    /* load cards once */
    async fetchCards(){
      const user=JSON.parse(localStorage.loggedInUser||'null');
      if(!user?.id) return;
      const r=await fetch(`https://idd-finalproject.onrender.com/api/get-cards?user_id=${user.id}`);
      const j=await r.json();
      if(j.success) this.cards=j.cards;
    },
  
    /* send order → backend */
    async confirmCheckout() {
      if (!this.formReady) {
        alert('Please complete all required fields before proceeding.');
        return;
      }

      if (!this.formReady || this.loading) return;
    
      if (!this.selectedPay.startsWith('card:')) {
        alert('Please select a payment method.');
        return;
      }
    
      this.loading = true;
    
      const loggedUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      let cardId = 0;
      if (this.selectedPay.startsWith('card:')) {
        cardId = parseInt(this.selectedPay.split(':')[1]);
      }
      if (!cardId) {
        alert('Invalid card selection.');
        return;
      }

    
      const order = {
        user_id   : loggedUser.id,
        card_id   : cardId,
        email     : this.email,
        phone     : this.phone,
        firstName : this.firstName,
        lastName  : this.lastName,
        address   : this.address,
        location  : this.location,
        items     : this.cart,
        subtotal  : this.subtotal,
        discount  : this.discount,
        postage   : this.postage,
        total     : this.totalPrice,
        timestamp : new Date().toISOString()
      };
    
      try {
        const res = await fetch('https://idd-finalproject.onrender.com/api/checkout', {
          method : 'POST',
          headers: { 'Content-Type':'application/json' },
          body   : JSON.stringify(order)
        });
        
        const json = await res.json();
        console.log(json);

        
        if (res.ok && json.success) {
          new bootstrap.Modal(document.getElementById('successModal')).show();
          localStorage.removeItem('checkout_location');
          this.cart = [];
        
          await fetch('https://idd-finalproject.onrender.com/api/delete-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: loggedUser.id })
          });
        } else {
          alert(json.error || 'Something went wrong saving the order.');
        }
        
      } catch {
        alert('Failed to connect to the server.');
      } finally {
        this.loading = false;
      }
    },
    
  
    goHome() { this.$router.push('/'); }
    
  },
  
  /* ───────── lifecycle ───────── */
  async mounted() {
    await this.loadCart();
    await this.loadUser();
    await this.fetchCards();
    this.location = localStorage.getItem('checkout_location') || '';

  }
};