<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            @keydown.enter="add"
            autocomplete="off"
            v-model="ticker"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <auto-complete :ticker = "ticker" @complete-ticker = "setTicker"/>
        <div v-if="!isValid" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button :disabled="disabled" @click="add" />
  </section>
</template>

<script>
import AddButton from './AddButton.vue';
import AutoComplete from './AutoComplete.vue'

export default {
   name: "AddTicker",
  data(){
    return {
      ticker:'',
      isValid:true
    }
  },
  components:{
    AddButton,
    AutoComplete
  },
  props:{
     disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

  },
  methods:{
     add() {
       this.$emit('add-ticker',this.ticker);
       this.ticker = ''
    },
    setTicker(ticker){
      this.ticker = ticker;
      this.add();
    }
  },

}
</script>
