<template>
  <div class="relative footer bg-[#003266] w-full transition all z-10" id="footer">
    <div class="w-full">
      <div class="content-box mx-20">
        <div class="footer-box flex sm:flex-col lg:flex-row gap-72 sm:gap-y-20 mx-auto">
          <div class="about-us">
            <div class="logo mt-24 pb-8">
              <router-link to="/" @click="handleScrollToTop">
                <img src="../assets/image/CampusHub.svg" alt="Logo" />
              </router-link>
            </div>
            <div class="address text-white text-medium text-[14px] lg:mb-20 sm:mb-10">
              <p>Gedung Rektorat Lantai 2</p>
              <p>Jl. Veteran No.10-11, Ketawanggede</p>
              <p>Kec. Lowokwaru, Kota Malang, Jawa Timur, 65145</p>
            </div>
            <div class="contact">
              <span class="text-white text-bold text-[16px] py-4 block">Subscribe Email</span>
              <p class="text-white text-[14px] text-medium">Get the best new products in your inbox, every day.</p>
              <p class="text-white text-[14px] text-medium">Get the latest content first</p>
              <div class="social-media flex gap-4 my-8">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src="../assets/image/Facebook.svg" alt="Facebook" class="text-4xl" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src="../assets/image/Instagram.svg" alt="Instagram" class="text-4xl" />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  <img src="../assets/image/Linkedin.svg" alt="LinkedIn" class="text-4xl" />
                </a>
                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                  <img src="../assets/image/TikTok.svg" alt="TikTok" class="text-4xl" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <img src="../assets/image/X.svg" alt="Twitter/X" class="text-4xl" />
                </a>
              </div>
            </div>
          </div>

          <div class="flex md:gap-72 sm:gap-20">
            <div class="kategori lg:mt-32 sm:mt-0">
              <span class="text-white mb-6 block text-bold text-[18px] font-semibold">Kategori</span>
              <ul class="text-white space-y-6 text-[18px] text-medium">
                <li><router-link to="/seminar" @click="handleScrollToTop">Seminar</router-link></li>
                <li><router-link to="/webinar" @click="handleScrollToTop">Webinar</router-link></li>
                <li><router-link to="/kuliah-tamu" @click="handleScrollToTop">Kuliah Tamu</router-link></li>
                <li><router-link to="/workshop" @click="handleScrollToTop">Workshop</router-link></li>
                <li><router-link to="/sertifikasi" @click="handleScrollToTop">Sertifikasi</router-link></li>
              </ul>
            </div>

            <div class="halaman lg:mt-32 sm:mt-0 flex-col justify-center items-center">
              <span class="text-white mb-6 block text-bold text-[18px] font-semibold">Halaman</span>
              <ul class="text-white space-y-6 text-[18px] text-medium">
                <li><router-link :to="homeLink" @click="handleScrollToTop">Home</router-link></li>
                <li><router-link to="/my-events" @click="handleScrollToTop">MyEvent</router-link></li>
                <li><router-link to="#footer" @click="handleScrollToTop">About Us</router-link></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="border-b-2 border-white w-full"></div>
        <div class="copyright-box flex gap-4 justify-center py-8">
          <i class="ri-copyright-line text-white text-2xl"></i>
          <div class="copyright text-white text-[16px] text-medium mt-1">
            Copyright 2024. CampusHub. All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const homeLink = computed(() => {
  const path = route.path
  if (path === '/') return '/'
  if (path === '/home') return '/home'
  if (path === '/admin') return '/admin'
  return '/home'
})

const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>
