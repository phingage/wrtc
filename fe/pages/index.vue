<template>
  <section class="grid h-full lg:grid-cols-2 grid-cols-1 lg:gap-[26px] max-w-[1492px] w-full mx-auto lg:mt-[103px] mt-[43px] px-4 mb-5">
    <TravelCard
      v-for="travel in data.travels.edges"
      :key="travel.node.id"
      :travel="travel.node"
    />
  </section>
</template>

<script lang="ts" setup>
const query = gql`
  query getTravel($limit: Int!) {
    travels(first: $limit) {
      edges {
      node {
        id
        slug
        name
        description
        startingDate
        endingDate
        nature
         relax
         history
         culture
         party
         maxTravellers
         price
         availableSeats
      }
      cursor
    },
    pageInfo {
      hasNextPage,
      hasPreviousPage
      endCursor
    }
    }
  }
`
const variables = { limit: 15 }
const { data } = await useAsyncQuery(query, variables)
</script>


<style scoped></style>