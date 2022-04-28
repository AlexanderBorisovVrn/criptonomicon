<template>
  <section v-if="selected" class="relative">
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ selected.name }} - USD
    </h3>
    <div
      class="flex items-end border-gray-600 border-b border-l h-64"
      ref="graph"
    >
      <div
        v-for="(bar, idx) in normalizedGraph"
        :key="idx"
        :style="{ height: `${bar}%` }"
        class="bg-purple-800 border w-10"
      ></div>
    </div>
    <close-button @close-graph="$emit('close-graph')" />
  </section>
</template>

<script>
import CloseButton from "./CloseButton.vue";
import { subscribeToTicker } from "../api";
export default {
  components: {
    CloseButton,
  },
  props: {
    selected: {
      type: [Object, null],
      required: true,
      default: null,
    },
  },
  emits:{
    'close-graph':null
  },
  data() {
    return {
      graph: [],
    };
  },
  computed: {
    normalizedGraph() {
      const maxVal = Math.max(...this.graph);
      const minVal = Math.min(...this.graph);

      return this.graph.map((price) => {
        if (minVal === maxVal) {
          return 50;
        }
        return 5 + ((price - minVal) * 95) / (maxVal - minVal);
      });
    },
  },
  methods: {
    updateGraph(price) {
      this.graph.push(price);
      this.updateMaxElementsInGraph();
    },
    updateMaxElementsInGraph() {
      if (!this.$refs.graph) {
        return;
      }
      this.maxElementsInGraph = this.$refs.graph.clientWidth / 39;
      if (this.graph.length > this.maxElementsInGraph) {
        const start = this.graph.length - this.maxElementsInGraph;
        this.graph = this.graph.slice(start);
      }
    },
  },
  watch: {
    selected() {
      this.graph = [];
      if (this.selected) {
        subscribeToTicker(this.selected.name, (price) =>
          this.updateGraph(price)
        );
      }
    },
  },
};
</script>
