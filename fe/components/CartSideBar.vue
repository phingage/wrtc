<script setup lang="ts">
import MinusIcon from '~/components/icons/MinusIcon.vue';

const { $bus } = useNuxtApp()
import BackToShoppingIcon from '~/components/icons/BackToShoppingIcon.vue';
import { differenceInMinutes } from 'date-fns';
import PlusIcon from '~/components/icons/PlusIcon.vue';
import MobileMinusIcon from '~/components/icons/MobileMinusIcon.vue';
import MobilePlusIcon from '~/components/icons/MobilePlusIcon.vue';
const currentCart = ref({ travel:{} });
$bus.$on('updateCart', ({ cart}) => {
  currentCart.value = cart
})
function closeCart() {
  document.body.classList.remove("cart-item-show");
}
function goToCheckout() {
  closeCart();
  navigateTo('/checkout')
}
const query = gql`
     mutation UpdateCart($updateCartInput: UpdateCartInput!){
  updateCart(updateCartInput: $updateCartInput){
        id,
    status,
    cartPopulatedAt,
    seat,
     travel {
      id
      name
      price
      maxTravellers
      availableSeats
    }
  }
}
`

const voidQuery = gql`
     mutation VoidCart($id: String!){
  voidCart(id: $id){
        id,
    status,
    cartPopulatedAt,
    seat,
     travel {
      id
      name
      price
      maxTravellers
      availableSeats
    }
  }
}
`
const { mutate: updateCartMutation, error, loading } = useMutation(query, {})
const { mutate: voidCartMutation } = useMutation(voidQuery, {})
watch(error, async (newError, oldError) => {
  if(newError){
    $bus.$emit('alert', { "msg": error.value, "type":"alert-error" })
    console.log("rise error")
  }
})
async function changeSeat(qty: number) {
  let newQty = currentCart.value.seat + qty
  if(newQty<1)
    newQty = 1;
  if(newQty>currentCart.value.travel.maxTravellers)
    newQty = currentCart.value.travel.maxTravellers
  const variables = {
    "updateCartInput": {
      "id": localStorage.getItem("cart_id"),
      "travelId": currentCart.value.travel.id,
      "seats": newQty
    }
  }
  const { data } = await updateCartMutation(variables)
  $bus.$emit('alert', { "msg": "Cart updated", "type":"alert-success" })
  $bus.$emit('updateCart', { "cart": data.updateCart })
}

async function voidCart() {
  const variables = {
      "id": localStorage.getItem("cart_id"),
  }
  const { data } = await voidCartMutation(variables)
  $bus.$emit('alert', { "msg": "Cart has been erased", "type":"alert-success" })
  $bus.$emit('updateCart', { "cart": data.voidCart })
}
</script>

<template>
  <section class="CartSidebar px-4 md:px-8 md:py-12 py-[26px] overflow-hidden">
    <main class="flex flex-col h-full ">
      <button
        @click="closeCart"
        class="flex items-center gap-1 w-fit text-primary text-base font-bold leading-[110%] px-6 py-3 border border-primary rounded-[40px]"
      >
        <BackToShoppingIcon/> Close Cart
      </button>
      <div class="grow overflow-hidden lg:mt-[80px] mt-16 scrollbar-style">
        <div  v-if="currentCart.travel"  class="h-full  overflow-auto">
          <h2 class="text-primary text-[40px] font-bold tracking-[-1px] ">
            Your Travel
          </h2>
          <p class="text-primary text-xl leading-[150%] tracking-[-1px] mt-6 lg:mt-8">

          </p>
          <div class="gap-3 flex flex-col mt-8">
            <div key={index} class="bg-[#F3F4F8] rounded-[20px] gap-3 p-4 flex items-center justify-between">
              <div class="w-[88px] h-[88px]">
                <img
                  class="w-full rounded-3xl"
                  src="https://cdn.weroad.io/common/images/company-values/jpg/coordinator.jpg"
                  alt=""
                />
              </div>
              <div class="flex gap-3 flex-col items-center justify-between w-full">
                <div class="flex w-full justify-between">
                  <p class="text-primary text-xl font-bold leading-[110%] tracking-[-1px] line-clamp-2">
                    {{ currentCart.travel.name}}
                  </p>
                  <p class="text-primary text-xl font-bold leading-[110%] tracking-[-1px]">
                    {{(currentCart.travel.price * currentCart.seat)/100}} €
                  </p>
                </div>
                <div class="flex w-full justify-between items-center">
                  <a href="#" @click="voidCart" class="text-secondary text-xs font-bold leading-[110%] tracking-[-1px]">
                     delete
                  </a>
                  <div
                    class="md:flex hidden items-center gap-3 text-primary text-xl font-bold leading-[110%] tracking-[-1]">
                    <button @click="changeSeat(-1)">
                                            <MinusIcon/>
                    </button>
                    <h1> {{ currentCart.seat}} Travelers</h1>
                    <button @click="changeSeat(+1)">
                                            <PlusIcon/>
                    </button>
                  </div>
                  <div
                    class="flex items-center gap-3 text-primary text-xl font-bold leading-[110%] tracking-[-1] md:hidden">
                    <button @click="changeSeat(-1)">
                                            <MobileMinusIcon/>
                    </button>
                    <h1> {{ currentCart.seat}} Travelers</h1>
                    <button @click="changeSeat(+1)">
                                            <MobilePlusIcon/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex sm:flex-col flex-col-reverse">
            <div class="flex flex-col gap-8 sm:mt-0 mt-8">
              <h3 class="text-primary text-2xl font-bold leading-[110%] tracking-[-1px]">
              </h3>
              <button @click="goToCheckout"  class="flex items-center justify-center gap-1 w-full hover:bg-transparent hover:text-ternary border border-ternary duration-200 ease-in-out text-white bg-ternary text-base font-bold leading-[110%] px-8 py-4 rounded-[40px]">
                Checkout
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <h2 class="text-primary text-[40px] font-bold tracking-[-1px] ">
            Your Cart is Empty
          </h2>
        </div>
      </div>

    </main>
  </section>
</template>

<style scoped>

</style>