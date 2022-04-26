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
            <div
              class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            >
              <span
                v-for="(l, idx) of autocomplete"
                @click="
                  () => {
                    ticker = l;
                    add();
                  }
                "
                :key="idx"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                {{ l }}
              </span>
            </div>
            <div v-if="!isValid" class="text-sm text-red-600">
              Такой тикер уже добавлен
            </div>
          </div>
        </div>
        <add-button :disabled = "disabled" @click="add"/>
      </section>
</template>

<script>
import AddButton from './AddButton.vue';

export default {
   name: "AddTicker",
  data(){
    return {
      ticker:'',
      isValid:''
    }
  },
  components:{
    AddButton
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
  },
 
}
</script>