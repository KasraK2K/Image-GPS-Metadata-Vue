app.component("render", {
  props: {
    metadata: { type: Object, required: true },
    src: { type: String, require: true },
  },
  template: /*html*/ `
    <div class="flex flex-col md:flex-row align-center justify-between bg-gray-900 py-6 px-8">
      <div class="w-full text-white">
        <code class="w-full" id="code">
          <p>{</p>
          <p v-if="src">&nbsp; &nbsp; <span class="text-pink-500">route:</span> &quot;<a :href="route" target="_blank"><span class="text-green-500">{{ route }}</span></a>&quot;,</p>
          <p v-for="detail in details">&nbsp; &nbsp; <span class="text-pink-500">{{ detail[0] }}:</span> &quot;<span class="text-green-500">{{ detail[1] }}</span>&quot;,</p>
          <p>}</p>
        </code>
      </div>
      <img :src="src" alt="render image" class="max-h-96 my-auto pt-6 md:pt-0" />
    </div>
  `,
  data() {
    return {};
  },
  methods: {},
  computed: {
    details() {
      return Object.entries(JSON.parse(JSON.stringify(this.metadata)));
    },
    route() {
      if (document.location.href.slice(-1) === "/") {
        return document.location.href.slice(0, -1) + this.src;
      } else {
        return document.location.href + this.src;
      }
    },
  },
  mounted() {},
});
