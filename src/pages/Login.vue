<script setup>
import {onMounted, ref} from 'vue'
import { LogoGithub, Skull } from '@vicons/ionicons5'
import { useAuth } from '@/firebase.js'

const {user, isLogin, login, loginAnonymously} = useAuth()

const username = ref('')

// TODO: Add username for anonymous login (do this with localstorage)
</script>

<template>
  <div class="grid text-center gap-2">
    <button @click="login" class="btn btn-github has-icon btn-sm">
      <LogoGithub class="h-4" />
      <span>Sign in with GitHub</span>
    </button>
    <span>- or -</span>
    <button @click="loginAnonymously" class="btn btn-primary has-icon btn-sm">
      <Skull class="h-4" />
      <span>Sign in anonymously</span>
    </button>
  </div>
</template>

<style scoped>

</style>