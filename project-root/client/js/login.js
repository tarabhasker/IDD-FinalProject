window.LoginPage = {
  template: `
    <div class="login-container d-flex min-vh-100">

      <div 
        class="image-panel d-none d-sm-flex flex-column justify-content-center align-items-center text-white p-5 text-center"
        :class="{ 'w-100': isLandscapeMobile, 'w-50': !isLandscapeMobile }"
        :style="{ backgroundImage: 'url(' + (viewMode === 'login' ? 'images/vintage1.jpg' : 'images/index1.jpeg') + ')' }"
      >

        <div class="image-panel-overlay"></div>
        <div class="image-panel-content anim-item" style="animation-delay: 0.3s;">
          <img src="images/logo.svg" alt="Eternally Logo" style="height: 80px; margin-bottom: 2rem;">
          <transition name="form-fade" mode="out-in">
            <div :key="viewMode">
              <h2 v-if="viewMode === 'login'" class="mb-3" style="font-family: 'Cormorant Garamond', serif;">Welcome Back</h2>
              <h2 v-else class="mb-3" style="font-family: 'Cormorant Garamond', serif;">A Day to Remember</h2>
              <p v-if="viewMode === 'login'" class="lead" style="opacity: 0.9;">Continue your journey to the perfect day.</p>
              <p v-else class="lead" style="opacity: 0.9;">Start your story with us today.</p>
            </div>
          </transition>
        </div>
      </div>

      <div class="form-panel w-100 w-md-50 d-flex justify-content-center align-items-center p-md-5 py-5">
        <div class="auth-card anim-item" style="animation-delay: 0.2s;">
          <div class="auth-card-scroll">
            <transition name="form-fade" mode="out-in">
            
            <div v-if="viewMode === 'login'" key="login">
              <div class="text-center">
                  <h3 class="mb-2 form-heading">Sign In</h3>
                  <p class="text-muted mb-4">Welcome back! Please enter your details.</p>
              </div>
              <form @submit.prevent="login">
                <div class="mb-3"><label class="form-label">Email address</label><input v-model="email" type="email" class="form-control" :class="{ 'is-invalid': emailError }" placeholder="you@example.com" /></div>
                <div class="mb-3"><label class="form-label">Password</label><div class="input-group"><input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control" :class="{ 'is-invalid': passwordError }" placeholder="Password" /><button type="button" class="btn btn-outline-secondary" @click="togglePassword" ><i :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i></button></div></div>
                <div class="d-flex justify-content-between align-items-center mb-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="rememberMe" v-model="rememberMe" /><label class="form-check-label small" for="rememberMe">Remember Me</label></div><button type="button" class="btn btn-link p-0 link-brand small" data-bs-toggle="modal" data-bs-target="#forgotModal">Forgot Password?</button></div>
                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                <div v-if="success" class="alert alert-success">Login successful! Redirecting...</div>
                <div class="d-grid mb-3"><button type="submit" class="btn btn-brand">Sign In</button></div>
              </form>
              <p class="mt-4 text-center text-muted small">Don't have an account? <button @click="switchToRegister" class="btn btn-link p-0 link-brand fw-medium">Register here</button></p>
            </div>

            <div v-else key="register">
              <div class="text-center">
                  <h3 class="mb-2 form-heading">Create Account</h3>
                  <p class="text-muted mb-4">Join us to begin planning your perfect day.</p>
              </div>
              <form @submit.prevent="register">
                <div class="mb-3"><label class="form-label">Full Name</label><input v-model.trim="name" type="text" class="form-control" :class="{ 'is-invalid': nameError }" placeholder="Enter your full name" /></div>
                <div class="mb-3"><label class="form-label">Email address</label><input v-model="email" type="email" class="form-control" :class="{ 'is-invalid': emailError }" placeholder="you@example.com" /></div>
                <div class="mb-3"><label class="form-label">Password</label><div class="input-group"><input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control" :class="{ 'is-invalid': passwordError }" placeholder="Create a strong password" /><button class="btn btn-outline-secondary" type="button" @click="togglePassword"><i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i></button></div><div class="form-text" style="font-size: 0.75rem;">Min 8 chars, 1 uppercase, 1 lowercase, 1 symbol.</div></div>
                <div class="mb-4"><label class="form-label">Confirm Password</label><input :type="showPassword ? 'text' : 'password'" v-model="confirmPassword" class="form-control" :class="{ 'is-invalid': confirmPasswordError }" placeholder="Confirm your password" /></div>
                <div v-if="success" class="alert alert-success">Registration successful! You can now log in.</div>
                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                <div class="d-grid mb-3"><button type="submit" class="btn btn-brand">Create Account</button></div>
              </form>
              <p class="mt-4 text-center text-muted small">Already have an account? <button @click="switchToLogin" class="btn btn-link p-0 link-brand fw-medium">Login here</button></p>
            </div>

          </transition>
          </div>
        </div>
      </div>

      <div class="modal fade" id="forgotModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Reset Password</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><p>Password reset is not available in this demo.</p></div><div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">Close</button></div></div></div></div>
      <div class="toast-container position-fixed bottom-0 end-0 p-3"><div class="toast align-items-center text-bg-success border-0" ref="toast" role="alert"><div class="d-flex"><div class="toast-body">Login successful!</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div></div>
    </div>
  `,
  data() {
    return {
      isLandscapeMobile: false,
      viewMode: 'login',
      email: '', password: '', rememberMe: false,
      name: '', confirmPassword: '',
      error: '', success: false, showPassword: false,
      nameError: false, emailError: false, passwordError: false, confirmPasswordError: false
    };
  },
  mounted() {
    document.body.style.paddingTop = '0';
    this.updateLandscapeFlag();
    window.addEventListener('resize', this.updateLandscapeFlag);
  },
  beforeUnmount() {
    document.body.style.paddingTop = '70px';
    window.removeEventListener('resize', this.updateLandscapeFlag);
  },
  methods: {
    updateLandscapeFlag() {
      this.isLandscapeMobile = window.innerWidth < 768 && window.innerWidth > window.innerHeight;
    },
    /* ---------- switches ---------- */
    switchToRegister() { this.clearFormState(); this.viewMode = 'register'; },
    switchToLogin()    { this.clearFormState(); this.viewMode = 'login';    },
    clearFormState() {
      this.name = this.email = this.password = this.confirmPassword = '';
      this.nameError = this.emailError = this.passwordError = this.confirmPasswordError = false;
      this.error = ''; this.success = false; this.rememberMe = false;
    },
    togglePassword() { this.showPassword = !this.showPassword; },

    /* ---------- validators ---------- */
    validateLogin() {
      this.emailError    = !/^\S+@\S+\.\S+$/.test(this.email);
      this.passwordError = this.password.length < 1;
      return !(this.emailError || this.passwordError);
    },
    validateRegister() {
      const nameRe = /^[A-Za-z ]+$/;
      const emailRe = /^\S+@\S+\.\S+$/;
      const pwRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      this.nameError           = !nameRe.test(this.name.trim());
      this.emailError          = !emailRe.test(this.email);
      this.passwordError       = !pwRe.test(this.password);
      this.confirmPasswordError = this.password !== this.confirmPassword;
      return !(this.nameError || this.emailError || this.passwordError || this.confirmPasswordError);
    },

    /* ---------- login ---------- */
    login() {
      this.error = ''; this.success = false;
      if (!this.validateLogin()) {
        this.error = 'Please provide a valid email and password.';
        return;
      }

      fetch('https://idd-finalproject.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password })
      })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          const user = resp.user;               // comes from login.php (without password hash)
          if (this.rememberMe) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
          } else {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
          }
          this.error = '';
          this.success = true;
          this.showSuccessToast();
          setTimeout(() => this.$router.push('/'), 1500);
        } else {
          this.error = resp.error || 'Invalid email or password.';
        }
      })
      .catch(() => { this.error = 'Server error. Please try again.'; });
    },

    /* ---------- register ---------- */
    register() {
      this.error = ''; this.success = false;
      if (!this.validateRegister()) {
        this.error = 'Please fix the errors in the form.';
        return;
      }

      fetch('https://idd-finalproject.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          password: this.password
        })
      })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          this.success = true;
          setTimeout(() => this.switchToLogin(), 2000);
        } else {
          this.error = resp.error || 'Registration failed.';
        }
      })
      .catch(() => { this.error = 'Server error. Please try again.'; });
    },

    /* ---------- toast ---------- */
    showSuccessToast() {
      const el = this.$refs.toast;
      if (el && bootstrap?.Toast) new bootstrap.Toast(el).show();
    }
  }
};