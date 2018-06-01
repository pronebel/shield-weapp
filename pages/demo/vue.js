export default {
  props:{
    propA:{
      type:Number
    }
  },
  data() {
    return {
      name:"li",
      age:22
    }
  },
  computed: {
    nameC(){
      
      return  this.data.name+".Computed"
    },
    ageC() {
      console.log(this.age)
      return this.data.age + ".Computed"
    }
  },
  //components: {},
  filters: {},
  methods: {},
  mounted: function () {

  }


}