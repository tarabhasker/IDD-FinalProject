const Footer = {
    template: `
      <footer id="contact" class="py-4" style="background-color: #3F4F44; color: #DCD7C9;">
        <div class="container text-center">
            
            <img src="images/logo.svg" alt="Eternally Logo" class="footer-logo">
            <h2 class="footer-heading mb-3">Begin Your Forever</h2>

            <div class="footer-social-links d-flex justify-content-center gap-3 mb-4">
                <a href="#" title="Facebook"><i class="bi bi-facebook"></i></a>
                <a href="#" title="Twitter"><i class="bi bi-twitter"></i></a>
                <a href="#" title="Instagram"><i class="bi bi-instagram"></i></a>
            </div>
            
            <hr class="footer-divider mx-auto">

            <div class="row mt-4">
                <div class="col-lg-4 footer-contact-col mb-4 mb-lg-0">
                    <h6>Our Office</h6>
                    <p class="mb-0">123 Anywhere St.<br>Any City, ST 12345</p>
                </div>
                <div class="col-lg-4 footer-contact-col mb-4 mb-lg-0">
                    <h6>Contact Us</h6>
                    <p class="mb-1"><a href="tel:1234567890" style="color: #DCD7C9;">(123) 456-7890</a></p>
                    <p class="mb-0"><a href="mailto:hello@reallygreatsite.com" style="color: #DCD7C9;">hello@reallygreatsite.com</a></p>
                </div>
                <div class="col-lg-4 footer-contact-col mb-4 mb-lg-0">
                    <h6>Office Hours</h6>
                    <p class="mb-1">Monday - Friday: 9am to 6pm</p>
                    <p class="mb-0">Saturday: 9am to 12pm</p>
                </div>
            </div>

            <div class="footer-copyright">
                &copy; {{ currentYear }} Eternally. All Rights Reserved.
            </div>

        </div>
      </footer>
    `,
  data() {
    return {};
  },
  computed: {
    currentYear() {
        return new Date().getFullYear();
    }
  }
};