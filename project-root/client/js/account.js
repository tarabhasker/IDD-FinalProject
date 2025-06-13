window.AccountPage = {
  template: `
    <section class="min-vh-100 py-5" style="background-color: #f9f6f2;">
      <div class="container">

       <!-- ─── Logout Button ─────────────────────────────────────────── -->
        <div v-if="user" class="d-flex justify-content-end mb-3">
          <button @click="logout"
                  class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>

        <!-- ─── Tabs (desktop) / Select (mobile) ──────────────────────── -->
        <ul v-if="!isMobile"
            class="nav nav-tabs justify-content-center mb-4"
            style="border:0;border-bottom:2px solid #f0ebe4;">
          <li v-for="tab in tabs" class="nav-item">
            <button class="nav-link px-4 py-2"
                    :class="{ activeTab: currentTab===tab.key }"
                    @click="setTab(tab.key)">{{ tab.label }}</button>
          </li>
        </ul>
        <div v-else class="mb-4">
          <select class="form-select form-select-lg" v-model="currentTab">
            <option v-for="tab in tabs" :value="tab.key">{{ tab.label }}</option>
          </select>
        </div>

        <!-- ─── Edit Profile ──────────────────────────────────────────── -->
        <div v-if="user && currentTab==='edit'"
             class="account-card row justify-content-center p-4 my-4 bg-white shadow-sm rounded-4 border">
          <div class="col-md-8">
            <form @submit.prevent="saveProfile" class="account-form fs-5">
              <div class="row">
                <div class="col-md-6 form-group mt-5 mb-5">
                  <label class="form-label">First Name</label>
                  <input v-model="firstName" type="text"
                         class="form-control py-3 px-4 rounded"
                         style="border:1px solid #dfddda;" placeholder="First Name">
                </div>
                <div class="col-md-6 form-group mt-5 mb-5">
                  <label class="form-label">Last Name</label>
                  <input v-model="lastName" type="text"
                         class="form-control py-3 px-4 rounded"
                         style="border:1px solid #dfddda;" placeholder="Last Name">
                </div>
              </div>

              <div class="form-group mb-5">
                <label class="form-label">Address</label>
                <textarea v-model="address"
                          class="form-control py-3 px-4 rounded"
                          style="border:1px solid #dfddda;" rows="3"
                          placeholder="123 Main Street"></textarea>
              </div>

              <div class="row">
                <div class="col-md-6 form-group mb-5">
                  <label class="form-label">Email</label>
                  <input v-model="email" type="email"
                         class="form-control py-3 px-4 rounded"
                         style="border:1px solid #dfddda;" placeholder="you@example.com">
                </div>
                <div class="col-md-6 form-group mb-4">
                  <label class="form-label">Contact No.</label>
                  <input v-model="phone" type="text"
                         class="form-control py-3 px-4 rounded"
                         style="border:1px solid #dfddda;" placeholder="+60 12-345 6789">
                </div>
              </div>

              <div class="d-flex justify-content-end gap-3 mt-4 mb-5">
                <button type="button"
                        class="btn px-4 py-2 fs-6 rounded-pill shadow-sm border-0"
                        :style="cancelBtnStyle"
                        @click="cancelEdit"
                        @mouseover="hoverCancel=true" @mouseleave="hoverCancel=false">
                  Cancel
                </button>
                <button type="submit"
                        class="btn px-4 py-2 fs-6 rounded-pill shadow-sm border-0"
                        :style="saveBtnStyle"
                        @mouseover="hoverSave=true" @mouseleave="hoverSave=false">
                  Save Changes
                </button>
              </div>

              <div v-if="updateSuccess" class="alert alert-success mt-4 fs-6">
                Profile updated successfully!
              </div>
              <div v-if="error" class="alert alert-danger mt-4 fs-6">{{ error }}</div>
            </form>
          </div>
        </div>

        <!-- ─── Change Password ───────────────────────────────────────── -->
        <div v-else-if="user && currentTab==='password'"
             class="account-card row justify-content-center p-4 my-4 bg-white shadow-sm rounded-4 border">
          <div class="col-md-8">
            <form @submit.prevent="changePassword" class="account-form fs-5">
              <div class="form-group mt-5 mb-5">
                <label class="form-label">Old Password</label>
                <input :type="showPassword?'text':'password'"
                       v-model="oldPassword"
                       class="form-control py-3 px-4 rounded"
                       style="border:1px solid #dfddda;"
                       placeholder="Enter current password">
              </div>

              <div class="form-group mb-5">
                <label class="form-label">New Password</label>
                <input :type="showPassword?'text':'password'"
                       v-model="newPassword"
                       class="form-control py-3 px-4 rounded"
                       style="border:1px solid #dfddda;"
                       placeholder="Enter new password">
                <div class="form-text mt-2">
                  Min 8 chars, 1 uppercase, 1 lowercase, 1 symbol.
                </div>
              </div>

              <div class="d-flex justify-content-end gap-3 mt-4 mb-5">
                <button type="button" class="btn px-4 py-2 fs-6 rounded-pill border-0 shadow-sm"
                        :style="cancelBtnStyle"
                        @click="resetPasswordForm"
                        @mouseover="hoverCancel=true" @mouseleave="hoverCancel=false">
                  Cancel
                </button>
                <button type="submit" class="btn px-4 py-2 fs-6 rounded-pill border-0 shadow-sm"
                        :style="saveBtnStyle"
                        @mouseover="hoverSave=true" @mouseleave="hoverSave=false">
                  Update Password
                </button>
              </div>

              <div v-if="updateSuccess" class="alert alert-success mt-4 fs-6">
                Password updated successfully!
              </div>
              <div v-if="error" class="alert alert-danger mt-4 fs-6">{{ error }}</div>
            </form>
          </div>
        </div>

            <div v-else-if="user && currentTab==='purchases'" class="account-card row justify-content-center p-4 my-4 bg-white shadow-sm rounded-4 border">
                <div class="col-md-8 text-center">
                <p class="text-muted account-form fs-5 mt-5 mb-4">View a complete record of your past transactions, including order dates, item details, and payment status.</p>
                <router-link to="/mypurchases" class="btn checkout-btn w-100 py-2 fs-5 rounded-pill shadow-sm border-0 text-white text-center mb-5" style="background-color: #A27B5C; transition: background-color 0.3s;" @mouseover="hoverPurchases = true" @mouseleave="hoverPurchases = false" :style="{ backgroundColor: hoverPurchases ? '#472611' : '#A27B5C' }">View Purchase History</router-link>
                </div>
            </div>

            <div v-else-if="user && currentTab==='terms'" class="account-card row justify-content-center p-4 my-4 bg-white shadow-sm rounded-4 border">
                <div class="col-md-9 col-lg-8">
                <div class="text-center mb-5">
                    <i class="bi bi-file-text fs-1" style="color: #A27B5C;"></i>
                    <h4 class="mt-3 mb-2">Terms & Conditions</h4>
                    <p class="text-muted px-md-4">By using our platform, you agree to the following terms. These are in place to ensure a secure and fair experience for everyone.</p>
                </div>
                <div class="terms-list">
                    <div class="d-flex align-items-start mb-4 pb-4 border-bottom"><div class="flex-shrink-0 me-4"><i class="bi bi-person-badge fs-2" style="color: #3F4F44;"></i></div><div><h6 class="mb-1 fw-bold" style="color: #2C3930;">Account Responsibility</h6><p class="text-muted mb-0 small">You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p></div></div>
                    <div class="d-flex align-items-start mb-4 pb-4 border-bottom"><div class="flex-shrink-0 me-4"><i class="bi bi-check2-circle fs-2" style="color: #3F4F44;"></i></div><div><h6 class="mb-1 fw-bold" style="color: #2C3930;">Data Accuracy</h6><p class="text-muted mb-0 small">You agree to provide accurate, current, and complete information during account registration and profile updates.</p></div></div>
                    <div class="d-flex align-items-start mb-4 pb-4 border-bottom"><div class="flex-shrink-0 me-4"><i class="bi bi-slash-circle fs-2" style="color: #3F4F44;"></i></div><div><h6 class="mb-1 fw-bold" style="color: #2C3930;">Prohibited Activities</h6><p class="text-muted mb-0 small">You must not misuse the platform by attempting to interfere with its normal operation, spreading malicious content, or violating laws and regulations.</p></div></div>
                    <div class="d-flex align-items-start mb-4 pb-4 border-bottom"><div class="flex-shrink-0 me-4"><i class="bi bi-patch-check fs-2" style="color: #3F4F44;"></i></div><div><h6 class="mb-1 fw-bold" style="color: #2C3930;">Content Ownership</h6><p class="text-muted mb-0 small">All platform content (excluding user-submitted data) is owned by the platform provider and cannot be copied, redistributed, or repurposed without permission.</p></div></div>
                    <div class="d-flex align-items-start mb-4 pb-4 border-bottom"><div class="flex-shrink-0 me-4"><i class="bi bi-exclamation-octagon fs-2" style="color: #3F4F44;"></i></div><div><h6 class="mb-1 fw-bold" style="color: #2C3930;">Termination</h6><p class="text-muted mb-0 small">We reserve the right to suspend or terminate access to your account if these terms are violated or if suspicious activity is detected.</p></div></div>
                    <div class="d-flex align-items-start mb-4 pb-4 border-bottom"><div class="flex-shrink-0 me-4"><i class="bi bi-shield-lock fs-2" style="color: #3F4F44;"></i></div><div><h6 class="mb-1 fw-bold" style="color: #2C3930;">Privacy</h6><p class="text-muted mb-0 small">Your personal information will be handled in accordance with our Privacy Policy, which outlines how data is collected, used, and protected.</p></div></div>
                    <div class="d-flex align-items-start mb-4 pb-4"><div class="flex-shrink-0 me-4"><i class="bi bi-arrow-clockwise fs-2" style="color: #3F4F44;"></i></div><div><h6 class="mb-1 fw-bold" style="color: #2C3930;">Updates</h6><p class="text-muted mb-0 small">These terms may be updated occasionally. Continued use of the platform indicates acceptance of any changes.</p></div></div>
                </div>
                <p class="text-muted small text-center mt-4">For any questions or concerns regarding these terms, please contact our support team.</p>
                </div>
            </div>
        </div>

       <!-- good -->
        <template v-if="user"></template>
        <template v-else>
          <div class="text-center mt-5">
            <p class="text-danger">No user is currently logged in.</p>
            <router-link to="/login" class="btn btn-dark">Go to Login</router-link>
          </div>
        </template>

      </div>
    </section>
  `,
  /* ---------- STATE ---------- */
  data() {
    return {
      tabs: [
        { key:'edit',     label:'Edit Profile'      },
        { key:'password', label:'Change Password'   },
        { key:'purchases',label:'My Purchases'      },
        { key:'terms',    label:'Terms & Conditions'}
      ],
      currentTab: 'edit',
      user: null,

      /* form copies for profile */
      firstName:'', lastName:'', email:'', phone:'', address:'',

      /* password form */
      oldPassword:'', newPassword:'', showPassword:false,

      /* ui flags */
      updateSuccess:false, error:'',
      hoverCancel:false, hoverSave:false,
      isMobile: window.innerWidth < 768
    };
  },

  /* ---------- STYLE HELPERS ---------- */
  computed:{
    cancelBtnStyle(){
      return {
        backgroundColor: this.hoverCancel ? '#b3a99e' : '#DCD7C9',
        color:'#fff'
      };
    },
    saveBtnStyle(){
      return {
        backgroundColor: this.hoverSave ? '#472611' : '#A27B5C',
        color:'#fff'
      };
    }
  },

  /* ---------- LIFECYCLE ---------- */
  mounted() {
    window.addEventListener('resize', ()=>{ this.isMobile = window.innerWidth<768; });

    const stored = JSON.parse(localStorage.getItem('loggedInUser')||'null');
    if (stored?.email) {
      fetch(`https://idd-finalproject.onrender.com/api/get-user?email=${encodeURIComponent(stored.email)}`)
        .then(r=>r.json()).then(resp=>{
          if(resp.success){
            this.user = resp.user;
            this.populateProfileForm();
          }
        });
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', ()=>{});
  },

  /* ---------- METHODS ---------- */
  methods:{
    /* util */
    setTab(t){ this.currentTab=t; this.updateSuccess=false; this.error=''; },
    populateProfileForm(){
      this.firstName=this.user.full_name||'';
      this.lastName =this.user.last_name ||'';
      this.email    =this.user.email;
      this.phone    =this.user.phone ||'';
      this.address  =this.user.address||'';
    },

    /* logout */
    logout(){
      localStorage.removeItem('loggedInUser');
      this.user=null;
      this.$router.push('/login');
    },

    /* profile */
    cancelEdit(){ this.populateProfileForm(); },
    saveProfile(){
      if(!this.firstName || !this.email){ this.error='Name and email required'; return;}
      fetch('https://idd-finalproject.onrender.com/api/update-profile',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          oldEmail:this.user.email,
          newData:{
            first_name:this.firstName,
            last_name :this.lastName,
            email     :this.email,
            phone     :this.phone,
            address   :this.address
          }
        })
      })
      .then(r=>r.json()).then(resp=>{
        if(resp.success){
          Object.assign(this.user,{
            full_name:this.firstName,
            last_name:this.lastName,
            email:this.email,
            phone:this.phone,
            address:this.address
          });
          localStorage.setItem('loggedInUser',JSON.stringify(this.user));
          this.updateSuccess=true; this.error='';
        } else { this.error = resp.error || 'Update failed'; }
      })
      .catch(()=> this.error='Server error');
    },

    /* password */
    resetPasswordForm(){ this.oldPassword=this.newPassword=''; },
    changePassword(){
      if(!this.oldPassword || !this.newPassword){
        this.error='Both password fields required'; return;}
      fetch('https://idd-finalproject.onrender.com/api/change-password',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          email:this.user.email,
          oldPassword:this.oldPassword,
          newPassword:this.newPassword
        })
      })
      .then(r=>r.json()).then(resp=>{
        if(resp.success){
          this.updateSuccess=true; this.error='';
          this.resetPasswordForm();
        } else { this.error=resp.error || 'Update failed'; }
      })
      .catch(()=> this.error='Server error');
    }
  }
};