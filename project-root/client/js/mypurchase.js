window.MyPurchasesPage = {
  template: `

  <!-- Custom Alert Modal -->
  <div class="modal fade" id="alertModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0">
        <div class="modal-header border-0">
          <h5 class="modal-title fw-semibold text-danger">
            <i class="bi bi-exclamation-circle me-2"></i>Action Not Allowed
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-muted">
          You can only edit or delete purchases that are still in <strong>Pending</strong> status.
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Okay</button>
        </div>
      </div>
    </div>
  </div>

    <section class="py-5" style="background-color: #fdfdfd;">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-semibold" style="color: #3b2f2f;">My Purchase History</h2>
          <p class="text-muted">A record of your timeless selections with Eternally.</p>
        </div>

        <div v-if="orders.length === 0" class="text-center text-muted fs-5 py-5">
          <i class="bi bi-bag-x fs-1 text-muted mb-3"></i>
          <p>You have not made any purchases yet.</p>
          <router-link to="/products" class="btn btn-outline-dark mt-3">Explore Our Services</router-link>
        </div>

        <div v-else class="orders-container">
          <TransitionGroup name="order-list">
            <div v-for="(order, index) in sortedOrders" :key="order.timestamp" class="order-card mb-3 shadow-sm">
              <div class="order-header d-flex justify-content-between align-items-center p-3" @click="toggleOrder(index)">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-receipt-cutoff fs-4" style="color: #A27B5C;"></i>
                  <div>
                    <h5 class="fw-bold mb-0 fs-6">Order placed on {{ formatDate(order.timestamp) }}</h5>
                    <small class="text-muted">Order ID: {{ order.timestamp }}</small>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-4">
                  <span class="fw-bold fs-5 me-3" style="color: #3b2f2f;">RM{{ order.total.toFixed(2) }}</span>
                  <i class="bi chevron-icon" :class="isOpen(index) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
              </div>

              <transition name="slide-fade">
                <div v-if="isOpen(index)" class="order-body p-4">
                  
                  <div v-if="!isEditing(index)">
                    <h6 class="mb-3 fw-semibold">Order Details</h6>
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                      <div class="badge bg-light border text-dark px-3 py-2 mb-2">
                        <i class="bi bi-geo-alt me-1 text-danger"></i>
                        <strong></strong> {{ order.location }}
                      </div>
                      <div :class="['badge', 'px-3', 'py-2', 'mb-2', getStatusClass(order.status)]">
                        <i class="bi bi-circle-fill me-1"></i>
                        {{ order.status }}
                      </div>
                    </div>
                    <div class="item-list">
                      <div v-for="(item, idx) in order.items" :key="idx" class="order-item d-flex justify-content-between align-items-center">
                        <div>
                          <p class="mb-0 fw-medium">{{ item.label }}</p>
                          <small class="text-muted">{{ item.qty }} x RM{{ item.price.toFixed(2) }}</small>
                        </div>
                        <p class="mb-0">RM{{ (item.price * item.qty).toFixed(2) }}</p>
                      </div>
                    </div>
                    <hr class="my-3">
                    <div class="totals-summary">
                      <div class="d-flex justify-content-between text-muted"><span>Subtotal</span><span>RM{{ order.subtotal.toFixed(2) }}</span></div>
                      <div v-if="order.discount > 0" class="d-flex justify-content-between text-success"><span>Discount</span><span>-RM{{ order.discount.toFixed(2) }}</span></div>
                      <div class="d-flex justify-content-between text-muted"><span>Postage</span><span>RM{{ order.postage.toFixed(2) }}</span></div>
                      <div class="d-flex justify-content-between fw-bold mt-2 pt-2 border-top fs-5" style="color: #3b2f2f;"><span>Total</span><span>RM{{ order.total.toFixed(2) }}</span></div>
                    </div>
                    <div class="text-end mt-4 d-flex justify-content-end gap-2">
                       <button class="btn btn-sm btn-edit" title="Edit Order" @click.stop="startEdit(order, index)">
                          <i class="bi bi-pencil-square"></i> Edit
                       </button>
                       <button @click.stop="deleteOrder(order)">Delete</button>
                    </div>
                  </div>

                  <div v-else>
                     <h6 class="mb-3 fw-semibold">Editing Order</h6>
                     <div class="item-list">
                        <div v-for="(item, idx) in editingOrderData.items" :key="idx" class="order-item d-flex justify-content-between align-items-center">
                           <p class="mb-0 fw-medium">{{ item.label }}</p>
                           <input type="number" v-model.number="item.qty" @input="updateEditingOrderTotals" min="1" class="form-control form-control-sm" style="width: 70px;">
                        </div>
                     </div>
                     <hr class="my-3">
                     <div class="totals-summary">
                        <div class="d-flex justify-content-between text-muted"><span>Subtotal</span><span>RM{{ editingOrderData.subtotal.toFixed(2) }}</span></div>
                        <div class="d-flex justify-content-between text-muted"><span>Postage</span><span>RM{{ editingOrderData.postage.toFixed(2) }}</span></div>
                        <div class="d-flex justify-content-between fw-bold mt-2 pt-2 border-top fs-5" style="color: #3b2f2f;"><span>Total</span><span>RM{{ editingOrderData.total.toFixed(2) }}</span></div>
                     </div>
                     <div class="text-end mt-4 d-flex justify-content-end gap-2">
                        <button class="btn btn-sm btn-secondary" @click.stop="cancelEdit">Cancel</button>
                        <button class="btn btn-sm btn-success" @click.stop="saveEdit">Save Changes</button>
                     </div>
                  </div>

                </div>
              </transition>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      orders: [],
      openOrderIndex: null,
      editingOrderIndex: null, // Tracks which order is being edited
      editingOrderData: null,  // Holds a copy of the order data for editing
    };
  },
  computed: {
    sortedOrders() {
      return [...this.orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  },
  methods: {
    showAlertModal() {
      const modal = new bootstrap.Modal(document.getElementById('alertModal'));
      modal.show();
    },
    isOpen(index) {
      return this.openOrderIndex === index;
    },
    toggleOrder(index) {
      if (this.editingOrderIndex !== null && this.editingOrderIndex !== index) {
        // If editing another order, cancel that first before opening a new one
        this.cancelEdit();
      }
      this.openOrderIndex = this.isOpen(index) ? null : index;
    },
    isEditing(index) {
      return this.editingOrderIndex === index;
    },
    startEdit(order, index) {
      if (order.status?.toLowerCase() !== 'pending') {
        this.showAlertModal();
        return;
      }
      this.editingOrderIndex = index;
      this.editingOrderData = JSON.parse(JSON.stringify(order));
    }
    ,
    cancelEdit() {
      this.editingOrderIndex = null;
      this.editingOrderData = null;
    },
    updateEditingOrderTotals() {
      if (!this.editingOrderData) return;
      const newSubtotal = this.editingOrderData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      this.editingOrderData.subtotal = newSubtotal;
      this.editingOrderData.total = newSubtotal + this.editingOrderData.postage - this.editingOrderData.discount;
    },
    async loadOrders() {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      const userId = user?.id;
      if (!userId) return;
    
      try {
        const [purchaseRes, servicesRes] = await Promise.all([
          fetch('https://idd-finalproject.onrender.com/api/get-purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
          }),
          fetch('/data/services.json')
        ]);
    
        const purchaseData = await purchaseRes.json();
        const servicesJson = await servicesRes.json();
    
        // Build a product lookup from services.json
        const productIndex = {};
        Object.values(servicesJson.details).forEach(category => {
          category.items.forEach(item => {
            productIndex[item.label] = {
              price: item.price,
              image: item.src
            };
          });
        });
    
        // Enrich each purchase's items
        this.orders = purchaseData.map(order => {
          const enrichedItems = order.items.map(item => {
            const details = productIndex[item.item_name] || {};
            return {
              label: item.item_name,
              qty: item.quantity,
              price: details.price || 0,
              image: details.image || 'images/placeholder.png'
            };
          });
        
          const subtotal = enrichedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
        
          return {
            ...order,
            purchase_id: order.purchase_id, // ✅ This now comes correctly from backend
            items: enrichedItems,
            subtotal: subtotal,
            total: subtotal + order.postage - order.discount,
            status: order.status || 'Pending',
            location: order.location || '—'
          };          
        });        
    
      } catch (err) {
        console.error('Failed to load orders or services.json', err);
      }
    },
    saveEdit() {
      if (!this.editingOrderData) return;
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      const userId = user?.id;
    
      fetch('https://idd-finalproject.onrender.com/api/update-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          purchase_id: this.editingOrderData.purchase_id, // ✅ send this
          timestamp: this.editingOrderData.timestamp,
          items: this.editingOrderData.items,
          subtotal: this.editingOrderData.subtotal,
          postage: this.editingOrderData.postage,
          discount: this.editingOrderData.discount || 0,
          total: this.editingOrderData.total,
          location: this.editingOrderData.location,
          status: this.editingOrderData.status || 'Pending'
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.cancelEdit();
          this.loadOrders();
        } else {
          alert('Failed to save changes: ' + data.error);
        }
      })
      .catch(err => alert('An error occurred while saving.'));
    },
    
    async deleteOrder(order) {
      if (order.status?.toLowerCase() !== 'pending') {
        this.showAlertModal();
        return;
      }
    
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      const userId = user?.id;
      const purchaseId = order.purchase_id;
    
      if (!userId || !purchaseId) {
        console.error('Missing user_id or purchase_id');
        return;
      }
    
      try {
        const res = await fetch('https://idd-finalproject.onrender.com/api/delete-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, purchase_id: purchaseId })
        });
    
        const result = await res.json();
        if (result.success) {
          alert('Order deleted!');
          this.loadOrders();
        } else {
          alert('Failed to delete order: ' + result.error);
        }
      } catch (err) {
        console.error('Error deleting order:', err);
      }
    },    
    formatDate(iso) {
      const d = new Date(iso);
      return d.toLocaleString('en-MY', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    },
    getStatusClass(status) {
      switch (status?.toLowerCase()) {
        case 'processing':
          return 'bg-rgb-processing text-dark-rgb';
        case 'shipped':
          return 'bg-rgb-shipped text-dark-rgb';
        case 'delivered':
          return 'bg-rgb-delivered text-white';
        case 'cancelled':
          return 'bg-rgb-cancelled text-white';
        default:
          return 'bg-rgb-default text-white';
      }
    }
    
    
  },
  mounted() {
    this.loadOrders();

    const styleId = 'my-purchases-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* ... existing styles from previous response ... */
        .order-card { background-color: #fff; border: 1px solid #eee; border-radius: 0.5rem; overflow: hidden; transition: all 0.3s ease; }
        .order-header { cursor: pointer; transition: background-color 0.2s ease; }
        .order-header:hover { background-color: #fcfaf8; }
        .order-body { background-color: #fdfdfd; border-top: 1px solid #eee; }
        .chevron-icon { transition: transform 0.3s ease; }
        .order-header .bi-chevron-up { transform: rotate(180deg); }
        .order-item { padding: 0.75rem 0; border-bottom: 1px dashed #eee; }
        .order-item:last-child { border-bottom: none; }
        .totals-summary span { padding: 0.1rem 0; }
        .btn-delete { color: #c82333; background-color: transparent; border: 1px solid #c8233344; transition: all 0.3s ease; }
        .btn-delete:hover { background-color: #c82333; color: #fff; }
        /* NEW styles for edit button */
        .btn-edit { color: #5a6268; background-color: transparent; border: 1px solid #5a626844; transition: all 0.3s ease; }
        .btn-edit:hover { background-color: #5a6268; color: #fff; }
        
        /* Vue Transitions */
        .slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); max-height: 500px; }
        .slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-10px); max-height: 0; }
        .order-list-leave-active { transition: all 0.5s ease; }
        .order-list-leave-to { opacity: 0; transform: translateX(50px); }
      `;
      document.head.appendChild(style);
    }
  },
  beforeUnmount() {
    const style = document.getElementById('my-purchases-styles');
    if (style) {
        style.remove();
    }
  }
};