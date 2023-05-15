<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'
import { computed } from '@vue/reactivity';

const STATUS = {
  0: "待审核",
  1: "通过审核",
  2: "未通过审核"
}

// const originData = [
//   {
//     id:3,
//     url: 'https://upload-bbs.miyoushe.com/upload/2023/04/03/107574854/aae08031646ff78aa75bc696c81652d8_8603429288583368229.png',
//     title: 'PizzaHat',
//     description: '联动装扮真滴很时尚',
//     status: 1
//   },
//   {
//     id:4,
//     url: 'https://upload-bbs.miyoushe.com/upload/2023/03/10/302342544/9c6e872d8ccc8d6197eef60bd87b7a5c_3636786974646302478.jpg',
//     title: '申鹤',
//     description: '粉球已经备好，我势在必得～',
//     status: 1
//   },
// ]
//data
const originData = ref(null);
let tableKey='';
onMounted(() => {
  axios.get('/api/getImages').then((res) => {
    originData.value = res.data;
  })
})
const srcList = computed(() => {
  return originData.value?.map(item => item.url);
})
const tableData = computed(() => {
  return originData.value?.map(item => {
    item.status = STATUS[item.status];
    return item;
  })
})

//methods
const pass = function (row) {
  axios.post('/api/passImage', { id: row.id }).then((res) => {
    console.log(res);
    this.tableKey=Math.random();
  }).catch((err) => {
    console.log(err);
  })
}

const refuse = function (row) {
  axios.post('/api/refuseImage', { id: row.id }).then((res) => {
    console.log(res);
    this.tableKey=Math.random();
  }).catch((err) => {
    console.log(err);
  })
}

const deleteImage = function (row) {
  axios.post('/api/deleteImage', { id: row.id }).then((res) => {
    console.log(res);
    this.tableKey=Math.random();
  }).catch((err) => {
    console.log(err);
  })
}

const setTop = function (row) {
  axios.post('/api/setTop', { id: row.id }).then(res => {
    console.log(res);
    this.tableKey=Math.random();
  }).catch((err) => {
    console.log(err);
  })
}


</script>

<template>
  <header>
    <span>图片管理</span>
  </header>
  <div class="container">
    <el-table :data="tableData" :key="tableKey" border style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="src" label="图片">
        <template #default="scope">
          <el-image style="width: 100px; height: 100px; margin-left:10px;" :src="scope.row.url"
            :preview-src-list="srcList" preview-teleported></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态" />
      <el-table-column align="right">
        <template #header>
          操作
        </template>
        <template #default="scope">
          <el-button size="small" @click="pass(scope.row)">通过</el-button>
          <el-button size="small" @click="refuse(scope.row)">拒绝</el-button>
          <el-button size="small" @click="deleteImage(scope.row)">删除</el-button>
          <el-button size="small" @click="setTop(scope.row)">置顶</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped></style>
