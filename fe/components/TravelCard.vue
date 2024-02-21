<script setup lang="ts">
const { $bus } = useNuxtApp()
import type { PropType } from 'vue'
import { differenceInMinutes, format } from 'date-fns';
type TravelResult = {
  id: number,
  slug: string,
  name: string,
  description: string
  startingDate: Date
  endingDate: Date
  nature: number,
  relax: number
  history: number
  culture:number
  party: number
  maxTravellers: number
  availableSeats: number
  price: number
}

const props = defineProps({
  travel: {
    type: Object as PropType<TravelResult>,
    required: true
  },
})
const availableSeats = ref(props.travel?.availableSeats);
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
    }
  }
}
`
const { mutate, error, loading } = useMutation(query, {})
function formatDate(date: Date){
  return format(date,'yyyy/mm/dd')
}

$bus.$on('updateCart', ({ cart }) => {
  if(cart.travel?.id == props.travel?.id){
    availableSeats.value = cart.travel.availableSeats
  }
  if(!cart.travel){
    availableSeats.value = props.travel.maxTravellers
  }
})

async function addToCart() {
  const variables = {
    "updateCartInput": {
      "id": localStorage.getItem("cart_id"),
      "travelId": props.travel?.id,
      "seats": 1
    }
  }
  const { data } = await mutate(variables)
  $bus.$emit('alert', { "msg": "Travel add to your cart", "type":"alert-success" })
  $bus.$emit('updateCart', { "cart": data.updateCart })
}

watch(error, async (newError, oldError) => {
 if(newError){
   $bus.$emit('alert', { "msg": error.value, "type":"alert-error" })
   console.log("rise error")
 }
})

</script>

<template>
  <div class="h-auto lg:max-w-[726px] w-full xl:p-12 lg:p-6 p-4 max-lg:mb-4 flex flex-col gap-6 bg-white lg:rounded-[10px] rounded-b-[10px] shadow-[0px_0px_10px_0px_rgba_(0_0_0_0.10)] ">
    <h2 class="text-primary w-full text-5xl leading-[110%] -tracking-[1px] font-bold uppercase">
      {{ travel.name }}
    </h2>
    <h3 class="text-quinary w-full text-2xl">
      {{ formatDate(travel.startingDate) }} - {{ formatDate(travel.endingDate) }}
    </h3>
    <h4 class="text-accent w-full text-2xl">
      {{travel.price / 100}}€ - {{travel.maxTravellers}} travelers <span v-show="availableSeats<travel.maxTravellers && availableSeats>0"> - Only {{availableSeats}} left</span>
    </h4>
    <p class="text-secondary leading-[150%] -tracking-[1px] text-xl">
      {{travel.description}}
    </p>
    <div class="flex flex-wrap items-start justify-around mx-[-15px] pb-[10px] lg:pb-[0]">
    <div class="radial-progress bg-gray-50 text-green-700" style="--size:7rem; --thickness: 4px;" :style="{'--value':travel.nature}" role="progressbar">Nature {{travel.nature}}%</div>
    <div class="radial-progress bg-gray-50 text-yellow-400" style="--size:7rem;  --thickness: 4px;" :style="{'--value':travel.relax}" role="progressbar">Relax {{travel.relax}}%</div>
    <div class="radial-progress bg-gray-50 text-lime-400" style="--size:7rem;  --thickness: 4px;" :style="{'--value':travel.history}" role="progressbar">History {{travel.history}}%</div>
    <div class="radial-progress bg-gray-50 text-amber-700" style="--size:7rem;  --thickness: 4px;" :style="{'--value':travel.culture}" role="progressbar">Culture {{travel.culture}}%</div>
    <div class="radial-progress bg-gray-50 text-purple-600" style="--size:7rem;  --thickness: 4px;" :style="{'--value':travel.party}" role="progressbar">Party {{travel.party}}%</div>
    </div>
      <button @click.stop="addToCart" :disabled="loading || availableSeats<1"
      class="px-8 py-6 bg-ternary border border-ternary hover:bg-transparent duration-200 ease-in-out hover:text-ternary rounded-[40px] text-white text-2xl font-bold leading-[110%] -tracking-[1px]">
        <span v-show="availableSeats>0">Add To Cart</span><span v-show="availableSeats<1">SOLD OUT!</span> <span v-show="loading" class="loading loading-dots text-white"></span>
    </button>
  </div>
</template>

<style scoped>

</style>