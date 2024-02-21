<script lang="ts" setup>
const { $bus } = useNuxtApp()
const currentMsg = ref("")
const showAlert = ref(false)
const currentAlertType = ref("alert-warning")
let currentTimeout = null
const query = gql`
      mutation CreateCart{
      createCart{
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
const { mutate: createCart } = useMutation(query,{})
const getCartQuery = gql`
      query getCart($id: String!){
  cart(id: $id) {
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
const { mutate: getCart } = useMutation(getCartQuery,{})

const subscriptionQuery = gql`
subscription availableSeatsUpdated {
  availableSeatsUpdated {
    id
    availableSeats
  }
}
    `
const response = useSubscription(subscriptionQuery,{})
response.onResult((result) => {
  //TODO: Check why doesn't work!!
});

async function createNewCart() {
  const { data } = await createCart();
  localStorage.setItem('cart_id', data.createCart.id);
  $bus.$emit('updateCart', { "cart": data.createCart })
}

async function checkCart() {
  let cartId = localStorage.getItem('cart_id');
  if (!cartId) {
    await createNewCart();
  } else {
    const variables = {
      'id': localStorage.getItem('cart_id'),
    };
    getCart(variables).then(({ data }) => {
      $bus.$emit('updateCart', { 'cart': data.cart });
    }).catch(async (err) => {
      await createNewCart();
    });
  }
}

onMounted(async ()=>{
  await checkCart();
})

onUpdated(async ()=>{
  await checkCart();
})

$bus.$on('alert', ({ msg, type }) => {
  currentMsg.value = msg
  currentAlertType.value = type
  showAlert.value = true;
  if(currentTimeout)
    clearTimeout(currentTimeout)
  currentTimeout = setTimeout(()=>showAlert.value =false, 1500)
})
</script>

<template>
  <div v-show="showAlert" class="fixed bottom-3 flex-wrap w-full z-50">
    <div role="alert" :class="['alert',currentAlertType]" class="max-w-[700px] mx-auto flex justify-center">
      <span>{{ currentMsg }}</span>
    </div>
  </div>
  <div class="w-full relative mx-auto">
    <div class="absolute top-0 shadow-c1 left-0 w-full bg-[url('https://strapi-imaginary.weroad.it/resource/webp-cover/30296/.webp')] h-[20%] lg:h-[30%] bg-cover"></div>
    <div class="flex w-full flex-col relative items-center">
      <div class="w-full h-full">
        <Header/>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
