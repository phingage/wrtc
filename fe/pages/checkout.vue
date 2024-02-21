<template>
  <div class="max-w-[1330px] mx-auto py-56 lg:py-96 px-3 lg:px-4">
    <NuxtLink
      href="/"
      class="btn-hover flex space-x-2 items-center justify-center max-w-[209px] py-2 px-3 rounded-[100px] border border-black text-[16px] font-bold text-center leading-[22px]"
    >
          <span>
            <RightArrowIcon />
          </span>
      <span> Back to portal </span>
    </NuxtLink>
    <div v-if="currentCart" class="lg:flex items-start lg:space-x-10">
      <form class="lg:w-1/2"  v-on:submit="placeOrder">
        <h2 class="text-primary text-[40px] font-bold tracking-[-1px] leading-[110%] mt-8">
          Checkout
        </h2>
        <div class="flex items-center space-x-2 py-8">
          <h4 class="text-xl font-bold tracking-[-1px] leading-[110%]">
            Information
          </h4>
          <LeftArrowIcon />
          <h4 class="text-quaternary font-bold tracking-[-1px] leading-[110%]">
            Payment Method
          </h4>
        </div>
        <h2 class="text-primary text-2xl font-bold tracking-[-1px] leading-[110%] mb-4">
          Contact Information
        </h2>
        <input
          class="border-0 border-b h-[40px] py-[8px] placeholder-secondary text-dark w-full form-control text-[16px] mb-4"
          placeholder="email address"
          type="email"
          name="email"
          required
        />
        <h2 class="text-primary text-2xl font-bold tracking-[-1px] leading-[110%] my-4">
          Billing Address
        </h2>
        <div class="flex items-start justify-between space-x-4">
          <input
            class="border-0 border-b h-[40px] py-[8px] placeholder-secondary text-dark w-full form-control text-[16px] mb-4"
            placeholder="First Name"
            type="text"
            name="firstName"
            required
          />
          <input
            class="border-0 border-b h-[40px] py-[8px] placeholder-secondary text-dark w-full form-control text-[16px] mb-4"
            placeholder="Last Name"
            type="text"
            name="lastName"
            required
          />
        </div>
        <input
          class="border-0 border-b h-[40px] py-[8px] placeholder-secondary text-dark w-full form-control text-[16px] mb-4"
          placeholder="Address"
          type="text"
          name="address1"
          required
        />
        <div class="flex items-end justify-between space-x-4 mb-8">
          <input
            class="border-0 border-b h-[40px] py-[8px] placeholder-secondary text-dark w-full form-control text-[16px]"
            placeholder="City"
            type="text"
            name="city"
            required
          />
        </div>
        <button
          type="submit"
          class="mt-8 w-full btn-hover flex space-x-2 items-center justify-center py-3 px-3 rounded-[100px] border border-black text-[16px] font-bold text-center leading-[22px]"
        >
          Proceed
        </button>
      </form>
      <div class="lg:w-1/2">
        <h2 class="text-primary text-[32px] font-bold tracking-[-1px] leading-[110%] mt-8">
          Your Travel
        </h2>
        <article
          class="border border-secondary rounded-2xl p-3 lg:p-4 flex items-center justify-between mb-6"
          key={index}
        >
          <div class="flex items-center space-x-2">
            <img class="max-w-[88px]  rounded-3xl"  src="https://cdn.weroad.io/common/images/company-values/jpg/coordinator.jpg" alt="weroad" />
            <h4 class="text-primary text-xl font-bold tracking-[-1px] leading-[110%]">
              {{ currentCart.travel.name}} x {{currentCart.seat}}
            </h4>
          </div>

          <span class="text-primary text-xl font-bold tracking-[-1px] leading-[110%]">
                 {{(currentCart.travel.price * currentCart.seat)/100}} €
            </span>
        </article>
        <div class="flex items-center justify-between mb-6">
          <h4 class="text-primary text-2xl font-bold tracking-[-1px] leading-[110%]">
            Total
          </h4>
          <p class="text-primary text-2xl font-bold tracking-[-1px] leading-[110%]">
            {{(currentCart.travel.price * currentCart.seat)/100}} €
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { differenceInMinutes } from 'date-fns';

const { $bus } = useNuxtApp()
import RightArrowIcon from '~/components/icons/RightArrowIcon.vue';
import LeftArrowIcon from '~/components/icons/LeftArrowIcon.vue';
const currentCart = ref(null);
$bus.$on('updateCart', ({ cart}) => {
  currentCart.value = cart
})
const closeCartQuery = gql`
     mutation CloseCart($id: String!){
  closeCart(id: $id){
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
const { mutate: placeOrderMutation, error } = useMutation(closeCartQuery, {})
watch(error, async (newError, oldError) => {
  if(newError){
    $bus.$emit('alert', { "msg": error.value, "type":"alert-error" })
    console.log("rise error")
  }
})
async function placeOrder(e) {
  e.preventDefault()
  const variables = {
    "id": localStorage.getItem("cart_id"),
  }
  const { data } = await placeOrderMutation(variables)
  $bus.$emit('alert', { "msg": "Order has been placed!", "type":"alert-success" })
  localStorage.removeItem("cart_id");
  navigateTo('/')
  currentCart.value = null
  $bus.$emit('updateCart', { "cart": null })

}
</script>


<style scoped></style>