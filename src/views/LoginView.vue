<template>
    <div id="login" class="">
      <div class="login-container container d-flex justify-content-center align-items-center vh-100">
        <div class="card w-100 shadow bg-body-teritary rounded">
          <div class="row g-0">
            <div class="col-md-6 col-lg-5 d-none d-md-block">
              <img
                src="../assets/images/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.png"
                alt="Login Illustration"
                class="img-fluid login-image"
              />
            </div>
            <div class="col-md-6 col-lg-7 d-flex align-items-center">
              <div class="card-body p-4 p-md-5">
                <form>
                  <div class="header text-center mb-4">
                    <h1>Login</h1>
                  </div>
                  <div class="mb-3">
                    <label for="nik" class="form-label"><i class="bi bi-card-text"></i> NIK</label>
                    <input type="text" class="form-control" placeholder="Enter your NIK" required />
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label"><i class="bi bi-key"></i> Password</label>
                    <input type="password" class="form-control" placeholder="Enter your password" required />
                  </div>
                  <div class="login-btn mb-4">
                    <button type="submit" class="btn btn-primary w-100">Login</button>
                  </div>
                  <div class="copy-right">
                    <p class="text-center">&copy; 2024 WellMagic Media Digital</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "LoginView",
    data() {
        return {
            loginData: {
                
            }
        }
    }
  }
  </script>
  
  <style scoped>
  
  .card {
    border-radius: 8px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  @media (min-width: 768px) {
    /* .login-container {
      max-width: 800px;
    } */
    .card-body {
      padding: 4rem;
    }
  }
  
  @media (max-width: 576px) {
    .card-body {
      padding: 2rem;
    }
    .header h1 {
      font-size: 1.5rem;
    }
  }
  </style>  