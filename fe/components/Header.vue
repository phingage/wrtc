<script setup lang="ts">
import { differenceInMinutes } from 'date-fns';

const { $bus } = useNuxtApp()
const currentSeats = ref(0)
import Logo from '~/components/Logo.vue';
import BlackAddToCartIcon from '~/components/icons/BlackAddToCartIcon.vue';
let interval = null
function toggleCart() {
  document.body.classList.toggle("cart-item-show");
}
const cartAge = ref(null);
const currentCart = ref(null);
$bus.$on('updateCart', ({ cart}) => {
  currentSeats.value=cart.seat
  currentCart.value = cart
  if(cart.cartPopulatedAt){
    cartAge.value = 15 - differenceInMinutes(new Date(),cart.cartPopulatedAt)
  }else{
    cartAge.value = null
  }
})

onMounted(() => {
  interval = setInterval(() =>  {
    if(currentCart && currentCart.value.cartPopulatedAt){
      cartAge.value = 15 - differenceInMinutes(new Date(),currentCart.value.cartPopulatedAt)
    }
  }, 30 * 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})

</script>

<template>
  <nav class="flex px-4">
    <div
      class="max-w-[1792px] w-full px-4 sm:px-6 py-3 bg-white rounded-full items-center mx-auto justify-between flex mt-8"
    >
      <NuxtLink href="/">
      <Logo/>
      </NuxtLink>
       <span class="text-red-600" v-show="cartAge!=null  && cartAge>0">Hurry up, you have {{cartAge}} minutes to complete your order</span>
       <span class="text-red-600" v-show="cartAge!=null && cartAge<0">Oooops your cart it's expired please start over!</span>
      <CartSideBar />
      <div class="lg:hidden gap-2 flex">
        <button @click="toggleCart"

          class="p-[8px_20px] sm:p-[12px_24px] border-black border-[1px] rounded-full relative"
        >
          <div v-show="currentSeats>0"  class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-ternary border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">{{currentSeats}}
        </div>
          <BlackAddToCartIcon />
        </button>
      </div>
      <div class="hidden lg:flex gap-3">
        <button  @click="toggleCart"
          class="p-[12px_24px] border-black border-[1px] rounded-full relative"
        >
          <div v-show="currentSeats>0" class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">{{currentSeats}}
        </div>
          <BlackAddToCartIcon />
        </button>
      </div>

    </div>
  </nav>
</template>

<style scoped>

</style>