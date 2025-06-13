window.RegisterPage = {
  template: `
    <div class="container py-5 animate__animated animate__fadeIn">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">Register</h3>
              <form @submit.prevent="register">
                <!-- Full Name -->
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input v-model="name" type="text" class="form-control" :class="{ 'is-invalid': nameError }" />
                  <div v-if="nameError" class="invalid-feedback">Name must contain only letters and spaces.</div>
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label">Email address</label>
                  <input v-model="email" type="email" class="form-control" :class="{ 'is-invalid': emailError }" />
                  <div v-if="emailError" class="invalid-feedback">Please enter a valid email.</div>
                </div>

                <!-- Password -->
                <div class="mb-3 position-relative">
                  <label class="form-label">Password</label>
                  <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control" :class="{ 'is-invalid': passwordError }" />
                    <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility">
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div class="form-text">Min 8 chars, 1 uppercase, 1 lowercase, 1 symbol.</div>
                  <div v-if="passwordError" class="invalid-feedback">Password is too weak.</div>
                </div>

                <!-- Confirm Password -->
                <div class="mb-3">
                  <label class="form-label">Confirm Password</label>
                  <input :type="showPassword ? 'text' : 'password'" v-model="confirmPassword" class="form-control" :class="{ 'is-invalid': confirmPasswordError }" />
                  <div v-if="confirmPasswordError" class="invalid-feedback">Passwords do not match.</div>
                </div>

                <!-- Messages -->
                <div v-if="success" class="alert alert-success">Registration successful! Redirecting...</div>
                <div v-if="error" class="alert alert-danger">{{ error }}</div>

                <!-- Submit -->
                <button type="submit" class="btn btn-success w-100">Register</button>
              </form>

              <p class="mt-3 text-center">
                Already have an account? <router-link to="/login">Login here</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      nameError: false,
      emailError: false,
      passwordError: false,
      confirmPasswordError: false,
      error: '',
      success: false
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    validateInputs() {
      const namePattern = /^[A-Za-z ]+$/;
      const emailPattern = /^\S+@\S+\.\S+$/;
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

      this.nameError = !namePattern.test(this.name.trim());
      this.emailError = !emailPattern.test(this.email);
      this.passwordError = !passwordPattern.test(this.password);
      this.confirmPasswordError = this.password !== this.confirmPassword;

      return !(this.nameError || this.emailError || this.passwordError || this.confirmPasswordError);
    },
    register() {
      this.error = '';
      this.success = false;

      if (!this.validateInputs()) {
        this.error = 'Please fix the errors in the form.';
        return;
      }

      fetch('http://localhost:5050/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          password: this.password
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            this.error = data.error;
          } else {
            this.success = true;
            setTimeout(() => this.$router.push('/login'), 1500);
          }
        })
        .catch(() => {
          this.error = 'Something went wrong. Please try again.';
        });
    }
  }
};
