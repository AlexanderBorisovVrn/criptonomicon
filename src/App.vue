<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <!-- <div
      class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
    >
      <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    </div> -->
    <div class="container">
      <add-ticker @add-ticker="add" />

      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div class="flex items-center">
          <label for="filter"
            >Фильтр:
            <input
              v-model="filter"
              type="text"
              name="filter"
              id="filter"
              class="pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            />
          </label>
          <div class="flex justyfy-between mx-2">
            <button
              v-if="page > 1"
              @click="page--"
              class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              type="button"
            >
              Назад
            </button>
            <button
              v-if="hasNextPage"
              @click="page += 1"
              class="my-4 mx2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              type="button"
            >
              Вперед
            </button>
          </div>
        </div>

        <hr class="w-full border-t border-gray-600 my-4" />

        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t of paginatedTicker"
            @click="selected = t"
            :key="t.name"
            :class="{
              'bg-red-100': t.price === '-',
              'border-4': selected === t,
            }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }}-USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ t.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="remove(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <graph-board :selected="selected" @close-graph="selected = null" />
    </div>
  </div>
</template>

<script>
const { subscribeToTicker, unsubscribe } = require("./api");
import AddTicker from "./components/AddTicker.vue";
import GraphBoard from "./components/GraphBoard.vue";

export default {
  name: "App",
  components: {
    AddTicker,
    GraphBoard,
  },
  data() {
    return {
      tickers: [],
      selected: null,

      maxElementsInGraph: null,

      filter: "",
      page: 1,
      nextPage: true,
    };
  },
  created() {
    const tickersList = JSON.parse(localStorage.getItem("tickersList"));
    if (tickersList) {
      this.tickers = tickersList;
    }

    this.tickers.forEach((ticker) =>
      subscribeToTicker(ticker.name, (price) =>
        this.updateTickers(ticker.name, price)
      )
    );
  },
  mounted() {
    window.addEventListener("resize", this.updateMaxElementsInGraph);
  },
  unmounted() {
    window.removeEventListener("resize", this.updateMaxElementsInGraph);
  },
  beforeUpdate() {},
  computed: {
    startIndex() {
      return (this.page - 1) * 6;
    },
    endIndex() {
      return this.page * 6;
    },
    filteredTickers() {
      return this.tickers.filter((ticker) =>
        ticker.name.includes(this.filter.toUpperCase())
      );
    },
    paginatedTicker() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },

    pageStateOptions() {
      return {
        page: this.page,
        filter: this.filter,
      };
    },
  },

  methods: {
    add(ticker) {
      if (!ticker) {
        return;
      }
      let currentTicker = { name: ticker.toUpperCase(), price: "-" };
      this.tickers = [...this.tickers, currentTicker];
      subscribeToTicker(currentTicker.name, (price) => {
        this.updateTickers(currentTicker.name, price);
      });
      this.filter = "";
    },
    transformPrice(price) {
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },
    updateTickers(tickerName, price) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => (t.price = this.transformPrice(price) || "Упс..."));
    },

    remove(itemToRemove) {
      this.tickers = this.tickers.filter((ticker) => {
        return ticker !== itemToRemove;
      });
      this.selected = null;
      unsubscribe(itemToRemove.name);
    },
    isValid(ticker) {
      return (
        this.tickers.filter((current) => current.name === ticker.toUpperCase())
          .length === 0
      );
    },
  },
  watch: {
    paginatedTicker() {
      if (this.paginatedTicker.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    // selected() {
    //   this.graph = [];
    //   if (this.selected) {
    //     subscribeToTicker(this.selected.name, (price) => {
    //       this.updateGraph(price);
    //     });
    //   }
  },
  tickers() {
    localStorage.setItem("tickersList", JSON.stringify(this.tickers));
  },

  pageStateOptions(value) {
    window.history.pushState(
      null,
      document.title,
      `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
    );
    const { filter, page } = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );
    if (filter) {
      this.filter = filter;
    }
  },
};
</script>

<style src="./app.css"></style>
