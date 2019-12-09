<template>
  <v-container>
    <v-row>
        <v-data-table :headers="headers" :items="events" :items-per-page="5" class="elevation-1"></v-data-table>
        {{events}}
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Events',
  computed: {
    events () {
      return this.$store.getters.loadEvents
    }
  },
  data: () => ({
    headers: [
      {
        text: 'Title',
        value: 'title'
      },
      {
        text: 'Description',
        value: 'description'
      }
    ]
  })
}
</script>
