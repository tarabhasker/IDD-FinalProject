const Navbar = {
  // ... const Navbar = { ...
  template: `
    <div>
      <style>
        /* Desktop Navbar Styling (Unchanged) */
        @media (min-width: 992px) { 
            .navbar-collapse { position: relative; }
            .navbar-main-links .nav-link { padding: 0.5rem 2rem; font-size: 0.95rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; position: relative; transition: color 0.3s ease; color: #DCD7C9; }
            .navbar-main-links .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: 0; left: 50%; transform: translateX(-50%); background-color: #DCD7C9; transition: width 0.4s ease; }
            .navbar-main-links .nav-link:hover { color: #fff; }
            .navbar-main-links .nav-link:hover::after { width: 40%; }
            .navbar-right-icons { position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); }
        }
      </style>
      <nav class="navbar navbar-expand-lg navbar-light fixed-top w-100 z-3" style="background-color: #2C3930;">
        <div class="container-fluid px-3">
          <router-link class="navbar-brand" to="/"><img src="images/logo.svg" alt="Eternally Logo" style="height: 50px;"></router-link>
          <div class="d-flex align-items-center d-lg-none">
            <router-link to="/cart" class="me-3" style="font-size: 1.8rem; color: #DCD7C9;"><i class="bi bi-bag"></i></router-link>
            <router-link to="/account" class="me-3" style="font-size: 1.8rem; color: #DCD7C9;"><i class="bi bi-person-circle"></i></router-link>
            <button class="navbar-toggler p-2" type="button" @click="toggleMenu"><i class="bi bi-list" style="font-size: 2rem; color: #DCD7C9;"></i></button>
          </div>
          <div class="collapse navbar-collapse justify-content-center d-none d-lg-flex" id="navbarNav">
            <ul class="navbar-nav navbar-main-links">
              <li class="nav-item"><router-link class="nav-link" to="/about">About Us</router-link></li>
              <li class="nav-item"><router-link class="nav-link" to="/products">Services</router-link></li>
              <li class="nav-item"><router-link class="nav-link" to="/contactform">Contact</router-link></li>        
            </ul>
            <div class="d-none d-lg-flex align-items-center gap-4 navbar-right-icons">
              <router-link to="/cart" style="color: #DCD7C9;"><i class="bi bi-bag" style="font-size: 1.3rem;"></i></router-link>
              <router-link to="/account" style="color: #DCD7C9;"><i class="bi bi-person-circle" style="font-size: 1.3rem;"></i></router-link>
            </div>
          </div>
        </div>
      </nav>

      <div class="custom-mobile-menu" :class="{ 'active': isMenuOpen }" id="mobileMenu">
        <div class="mobile-menu-header">
            <div class="mobile-logo">
            </div>
            <button class="custom-menu-close" @click="toggleMenu"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="mobile-logo">
                <img src="images/logo.svg" alt="Eternally Logo">
            </div>
            
        <nav class="mobile-menu-nav">
            <router-link to="/about" @click="closeMenu">
              <i class="bi bi-info-circle-fill me-3"></i>About Us
            </router-link>
            <router-link to="/products" @click="closeMenu">
              <i class="bi bi-briefcase-fill me-3"></i>Services
            </router-link>
            <router-link to="/contactform" @click="closeMenu">
              <i class="bi bi-envelope-fill me-3"></i>Contact Us
            </router-link>
        </nav>

        <div class="mobile-menu-footer">
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="#" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      isMenuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    }
  }
};