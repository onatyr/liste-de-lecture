<script setup>
import AddButton from './cardSubcomponents/AddButton.vue'
import streamingSection from './cardSubcomponents/streamingSection.vue'
import overviewSection from './cardSubcomponents/overviewSection.vue'
import infosSection from './cardSubcomponents/infosSection.vue'

import { ref } from 'vue'
// import { provide } from 'vue'
import { useSearchResults } from '../../stores/useSearchResultStore'
import { useDB } from '../../stores/useDBStore'

const db = useDB()
const props = defineProps({
  data: Object,
  target: String
})

const search = useSearchResults()
const data = props.data

const note = ref(data.note)
const img = ref(data.img)
const type = ref(data.type)
const cardId = ref(data._id)
const albumUrl = ref(data.albumUrl)
const externalId = ref(data.externalId)

provide('albumUrl', albumUrl)

function assignTypeStyles(type) {
  let styles = {}
  if (type == 'Movie') {
    styles.color = 'text-mdPrpl'
    styles.imageH = 'h-24 md:h-36 '
  } else if (type == 'Book') {
    styles.color = 'text-drkRd'
    styles.imageH = 'h-fit'
  } else if (type == 'Album') {
    styles.imageH = 'h-16 md:h-24'
    styles.color = 'text-mdBl'
  }
  return styles
}

const typeStyles = assignTypeStyles(type.value)

function addItem() {
  db.sendData(data)

  setTimeout(search.stopSearching(), 800)
}
</script>

<template>
  <div
    :id="cardId"
    :class="typeStyles.imageH"
    class="CardElement text-offBlck w-full bg-white rounded-s5 shadow flex-row justify-center items-start inline-flex"
  >
    <section class="ImgWrapper w-fit h-fit flex grow-0 shrink-0" v-if="img != 'none' || undefined">
      <img
        class="Image aspect-auto rounded-tl-s5 rounded-bl-s5 text-xs text-gray-400 font-thin w-16 md:w-24"
        :class="typeStyles.imageH"
        :src="img"
        alt="A poster, book or album cover or similar image related to the element displayed in the card"
      />
    </section>

    <section
      class="cardBody font-display h-full grow shrink self-stretch lg:p-2 p-1 rounded-s5 flex-col justify-between items-start inline-flex gap-0.5"
    >
      <infosSection :data="props.data" :typeStyles="typeStyles"></infosSection>
      <streamingSection v-if="type == 'Album'" :albumUrl="albumUrl" :externalId="externalId">
      </streamingSection>
      <overviewSection v-if="type != 'Album'" :note="note"></overviewSection>
    </section>
    <AddButton v-if="search.getSearching" @click="addItem"></AddButton>
  </div>
</template>
