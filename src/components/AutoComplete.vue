<template>
  <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
    <span
      v-for="(l, idx) of autocomplete"
      @click="completeTicker(l)"
      :key="idx"
      class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
    >
      {{ l }}
    </span>
  </div>
</template>
<script>
import { fetchFullTickersList as fetchTickers } from "../api";
export default {
  props: {
    ticker: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      tickersList: [],
      autocomplete: [],
    };
  },
  created() {
    fetchTickers().then((allTickers) => {
      this.tickersList = Object.keys(allTickers.Data);
    });
  },
  methods: {
    completeTicker(ticker) {
      this.$emit("complete-ticker", ticker);
    },
  },
  computed: {
    autocompleteList() {
      return this.tickersList
        .filter((t) => t.includes(this.ticker.toUpperCase()))
        .slice(0, 4);
    },
  },
  watch: {
    ticker() {
      if (!this.tickersList) {
        return;
      }
      this.autocomplete = this.autocompleteList;
      if (!this.ticker) {
        this.autocomplete = [];
      }
    },
  },
};
</script>
