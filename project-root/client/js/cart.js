window.CartPage = {
  template: `
    <section class="py-5" style="background-color: #f9f6f2; overflow-x: hidden;">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 col-xl-9 mx-auto">

            <div class="flex-grow-1 mb-5">
              <h1 style="font-size: 3.2rem; font-weight: 500; color: #2C3930; margin-bottom: 1.5rem;">
                My Cart
              </h1>
            </div>
            <div v-if="cart.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
                <i class="bi bi-cart-x" style="font-size: 3rem; color: #A27B5C;"></i>
                <h4 class="mt-3 text-muted">Your cart is empty.</h4>
            </div>

            <div class="vstack gap-4" v-else>
              <div class="bg-white p-3 p-md-4 rounded shadow-sm">
                <div v-for="(item, index) in cart" :key="index">
                  
                  <div class="row align-items-center border-bottom py-3 d-none d-md-flex">
                    <div class="col-auto">
                      <button class="btn btn-sm p-0 border-0" @click="removeItem(index)"><i class="bi bi-x-circle-fill fs-5" style="color: #A27B5C;"></i></button>
                    </div>
                    <div class="col-auto">
                      <img :src="item.image" :alt="item.label" class="rounded" style="width: 120px; height: 100px; object-fit: cover;" />
                    </div>
                    <div class="col">
                      <h5 class="mb-1 fw-semibold" style="color: #2C3930;">{{ item.label }}</h5>
                      <h6 class="mb-0 mt-2 fst-italic text-muted">Available</h6>
                    </div>
                    <div class="col-auto text-end">
                      <div class="fw-bold fs-5">RM {{ item.price * item.qty }}</div>
                    </div>
                    <div class="col-auto">
                      <div class="border rounded d-flex align-items-center justify-content-between px-2" style="width: 100px;">
                        <button class="btn btn-sm p-0 border-0" :disabled="item.qty <= 1" @click="decreaseQty(index)"><i class="bi bi-dash"></i></button>
                        <span class="fw-medium">{{ item.qty }}</span>
                        <button class="btn btn-sm p-0 border-0" @click="increaseQty(index)"><i class="bi bi-plus"></i></button>
                      </div>
                    </div>
                  </div>

                  <div class="d-md-none border-bottom py-3">
                    <div class="d-flex gap-3">
                      <img :src="item.image" class="rounded" style="width: 90px; height: 110px; object-fit: cover;" />
                      <div class="d-flex flex-column flex-grow-1">
                        <div class="d-flex justify-content-between">
                          <h5 class="fw-semibold mb-1" style="color: #2C3930; font-size: 1.1rem;">{{ item.label }}</h5>
                          <button class="btn btn-sm p-0 border-0" @click="removeItem(index)"><i class="bi bi-x-circle-fill fs-5" style="color: #A27B5C;"></i></button>
                        </div>
                        <small class="text-muted fst-italic mb-2">Available</small>
                        <div class="fw-bold my-1">RM {{ item.price }}</div>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                          <div class="border rounded d-flex align-items-center justify-content-between px-2" style="width: 100px;">
                            <button class="btn btn-sm p-0 border-0" :disabled="item.qty <= 1" @click="decreaseQty(index)"><i class="bi bi-dash"></i></button>
                            <span class="fw-medium">{{ item.qty }}</span>
                            <button class="btn btn-sm p-0 border-0" @click="increaseQty(index)"><i class="bi bi-plus"></i></button>
                          </div>
                          <div class="fw-bold fs-5">RM {{ item.price * item.qty }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div class="bg-white p-3 p-md-4 rounded shadow-sm">
                <h4 class="mb-3 fw-semibold" style="color: #2C3930;">Order Summary</h4>
                <div class="vstack gap-2">
                    <div class="d-flex justify-content-between">
                        <span>Handling Fee:</span>
                        <strong>RM30</strong>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>Deposit:</span>
                        <strong>RM500</strong>
                    </div>
                    <hr class="my-2">
                    <div class="d-flex justify-content-between fs-5 fw-bold">
                        <span>Total:</span>
                        <span style="letter-spacing: 1px; color: #A27B5C;">RM {{ totalPrice + 30 + 500 }}</span>
                    </div>
                </div>
              </div>

              <div>
                <router-link
                  to="/checkout"
                  class="btn checkout-btn w-100 py-2 text-center"
                  style="background-color: #A27B5C; color: white; font-size: 1.2rem; letter-spacing: 1px;"
                >
                  Checkout
                </router-link>
              </div>

              <div class="vstack flex-md-row justify-content-md-center align-items-center gap-3 gap-md-5 mt-4 text-muted">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-truck"></i>
                  <span>Fast Delivery</span>
                </div>
                
                <div class="d-none d-md-block">•</div>

                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-stars"></i>
                  <span>Personalised Service</span>
                </div>

                <div class="d-none d-md-block">•</div>

                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-arrow-repeat"></i>
                  <span>Money Back Guarantee</span>
                </div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      cart: [],               // [{label, qty, price, image, item_name}]
      postage: 10,
      isMobile: false,
      productIndex: null
    };
  },

  /* ---------- totals ---------- */
  computed: {
    subtotal() {
      return this.cart.reduce((t,i)=>t + i.qty * i.price, 0);
    },
    totalPrice() {            // displayed in template (handling + deposit added inline)
      return this.subtotal;
    }
  },

  /* ---------- methods ---------- */
  /* ---------- methods ---------- */
methods: {
  /* make flat product index from services.json (cached) */
  async buildProductIndex () {
    if (this.productIndex) return;
    const res = await fetch('data/services.json');
    const js  = await res.json();
    this.productIndex = {};
    Object.values(js.details).forEach(svc=>{
      svc.items.forEach(p=>{
        this.productIndex[p.label] = { price:p.price, image:p.src };
      });
    });
  },

  /* pull rows from cart table, hydrate with JSON data */
  async loadCart () {
    const user = JSON.parse(localStorage.getItem('loggedInUser')||'null');
    if (!user?.id) { this.cart = []; return; }

    const res  = await fetch(`https://idd-finalproject.onrender.com/api/get-cart?user_id=${user.id}`);
    const resp = await res.json();
    if (!resp.success) { this.cart = []; return; }

    await this.buildProductIndex();

    this.cart = resp.items.map(row=>{
      const prod = this.productIndex[row.item_name] || {};
      const q    = Number(row.quantity) || 1;
      return {
        item_name : row.item_name,       // DB
        label     : row.item_name,       // template expects
        qty       : q,
        price     : prod.price  || 0,
        image     : prod.image || 'images/placeholder.png'
      };
    });
  },

  /* push update / delete to DB, optimistic UI */
  async updateRow(i,newQty){
    const user = JSON.parse(localStorage.getItem('loggedInUser')||'null');
    if(!user?.id) return;

    const row = this.cart[i];           // keep a copy before mutating array

    /* optimistic update */
    if(newQty>0) this.cart[i].qty = newQty;
    else         this.cart.splice(i,1);

    try{
      await fetch('https://idd-finalproject.onrender.com/api/update-cart',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          user_id  : user.id,
          item_name: row.item_name,
          quantity : newQty            // 0 = delete
        })
      });
    }catch(e){ console.error(e); }
  },

  increaseQty(i){ this.updateRow(i, this.cart[i].qty + 1); },
  decreaseQty(i){ const q=this.cart[i].qty; if(q>1) this.updateRow(i,q-1); },
  removeItem (i){ this.updateRow(i,0); },

  handleResize(){ this.isMobile = window.innerWidth < 768; }
},

/* ---------- lifecycle ---------- */
mounted(){
  this.loadCart();
  this.handleResize();
  window.addEventListener('resize', this.handleResize);
},
beforeUnmount(){
  window.removeEventListener('resize', this.handleResize);
}

};