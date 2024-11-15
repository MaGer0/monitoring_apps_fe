<template>
    <div class="landing-page" data-aos="fade-up">
      <div class="content">
        <h1 data-aos="fade-down">Welcome to Our Website</h1>
        <p data-aos="fade-right">Explore our features and get the best experience.</p>
        <button @click="goToLogin" data-aos="zoom-in">Get Started</button>
      </div>
    </div>
  </template>
  
  <script>
  import AOS from "aos";
  import "aos/dist/aos.css";
  
  export default {
    name: "LandingPage",
    methods: {
      goToLogin() {
        this.$router.push({ name: "login" });
      }
    },
    mounted() {
      AOS.init({
        duration: 1000,
        once: true 
      });
    }
  };
  </script>
  
  <style>
  .landing-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(to bottom, #a2d5f2, #d3efff);
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
  }
  
  .landing-page::before {
    content: "";
    background-image: url("https://path-to-cloud-image");
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.2;
    z-index: 1;
  }
  
  .content {
    text-align: center;
    color: #333;
    z-index: 2;
    padding: 0 1rem;
  }
  
  .content h1 {
    font-size: 3rem;
    color: #005b99;
    margin-bottom: 1rem;
  }
  
  .content p {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 2rem;
  }
  
  button {
    padding: 0.8rem 2rem;
    font-size: 1rem;
    color: #fff;
    background-color: #005b99;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #007acc;
  }
  
  @media (max-width: 768px) {
    .content h1 {
      font-size: 2.5rem;
    }
  
    .content p {
      font-size: 1rem;
    }
  
    button {
      padding: 0.6rem 1.5rem;
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    .content h1 {
      font-size: 2rem;
    }
  
    .content p {
      font-size: 0.9rem;
    }
  
    button {
      padding: 0.5rem 1.2rem;
      font-size: 0.85rem;
    }
  }
  </style>  