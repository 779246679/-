<template>
  <div>
    <el-date-picker
      v-model="value2"
      type="year"
      @change="changeYear"
      placeholder="选择年份"
    ></el-date-picker>
    <el-date-picker
      v-model="value1"
      type="daterange"
      range-separator="至"
      ref="datePicker"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="options"
    ></el-date-picker>

    <single-quarter
      :status="'single'"
      :inputwidth="'220px'"
      :canSelectList="canSelectList"
      @getsinglequarter="handleGetSingleQuarter"
    ></single-quarter>
  </div>
</template>
<script>
import singleQuarter from "@/views/singleQuarter.vue";
export default {
  components: {
    singleQuarter,
  },
  data() {
    return {
      value1: "",
      value2: "",
      pickerOptions: {},
      options: {
        disabledDate(time) {
          const today = new Date().setHours(0, 0, 0, 0);
          return time.getTime() > today;
        },
      },
      canSelectList: [
        {
          start_time: "2022-01",
        },
        {
          start_time: "2022-04",
        },
        {
          start_time: "2022-07",
        },
        {
          start_time: "2022-10",
        },
      ],
    };
  },
  methods: {
    changeYear() {
      this.options = {
        disabledDate: (time) => {
          return time.getFullYear() != this.value2.getFullYear();
        },
      };
    },
    handleGetSingleQuarter(value) {
      console.log(value);
    },
  },
};
</script>
