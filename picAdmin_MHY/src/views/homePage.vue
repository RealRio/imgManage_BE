<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios'
import { computed } from '@vue/reactivity';
import cusImage from '../components/customImage.vue';
import Sortable from 'sortablejs'
const PAGE_SIZE = 20;
const STATUS = {
  0: "待审核",
  1: "通过审核",
  2: "未通过审核"
}

const originData = ref(null);
var currentPage = ref(1);
let imgCount = ref(0);
const listTable = ref();
onMounted(() => {
  axios.post('/api/getImages', {
    lastIndex: 0,
  }).then((res) => {
    originData.value = res.data;
    console.log(res.data)
    imgCount.value = res.data.length;
    rowDrop();
    console.log(tableData)
  })
})
watch(originData, () => {

})

const currentList = computed(() => {
  // return originData.value?.slice(0,20)
  return originData.value?.slice((currentPage.value - 1) * PAGE_SIZE, Math.min(currentPage.value * PAGE_SIZE, originData.value?.length))
})
const srcList = computed(() => {
  return currentList.value?.map(item => item.url);
})
const tableData = computed(() => {
  return currentList.value?.map(item => {
    item.status = STATUS[item.status];
    return item;
  })
})

//methods
const pass = function (row) {
  // console.log(row)
  axios.post('/api/passImage', { id: row.id }).then((res) => {
    console.log(res);
    axios.post('/api/getImages', {
      lastIndex: 0,
    }).then((res) => {
      originData.value = res.data;
      imgCount.value = res.data?.length;
    })
  }).catch((err) => {
    console.log(err);
  })
}

const refuse = function (row) {
  axios.post('/api/refuseImage', { id: row.id }).then((res) => {
    console.log(res);
    axios.post('/api/getImages', {
      lastIndex: 0,
    }).then((res) => {
      originData.value = res.data;
      imgCount.value = res.data?.length;
    })
  }).catch((err) => {
    console.log(err);
  })
}

const deleteImage = function (row) {
  axios.post('/api/deleteImage', { id: row.id }).then((res) => {
    console.log(res);
    axios.post('/api/getImages', {
      lastIndex: 0,
    }).then((res) => {
      originData.value = res.data;
      imgCount.value = res.data?.length;
    })
  }).catch((err) => {
    console.log(err);
  })
}

const setTop = function (row) {
  axios.post('/api/setTop', { id: row.id }).then(res => {
    console.log(res);
    axios.post('/api/getImages', {
      lastIndex: 0,
    }).then((res) => {
      originData.value = res.data;
      imgCount.value = res.data?.length;
    })
  }).catch((err) => {
    console.log(err);
  })
}
const handlePageChange = function (clickPage) {
  currentPage.value = clickPage;
  console.log(currentPage.value)
}

const changeOrder = function (id) {
  for (let i = 0; i < currentList.length; i++) {
    if (currentList[i].id !== id) {
      const item = srcList.shift();
      srcList.push(item);
    }
    else
      return;
  }
}
const rowDrop = function () {
  // const tbody = document.querySelector('.el-table__body-wrapper tbody')
  // Sortable.create(tbody, {
  //   ghostClass: 'sortable-ghost',
  //   setData: function (dataTransfer) {
  //     dataTransfer.setData('Text', '')
  //   },
  //   onEnd: evt => {
  //     const targetRow = tableData.splice(evt.oldIndex, 1)[0];
  //     tableData.splice(evt.newIndex, 0, targetRow);
  //   }
  // });
  const tbody = document.querySelector('.el-table__body-wrapper tbody');
  Sortable.create(tbody, {
    onEnd({ newIndex, oldIndex }) {
      console.log(newIndex, oldIndex)
      const newSortIndex = tableData.value[newIndex].sort_index - 1;
      const currRow = tableData.value[oldIndex];
      console.log(currRow, newSortIndex)
      axios.post('/api/changeOrder', {
        id: currRow.id,
        newIndex: newSortIndex,
      }).then((res) => {
        console.log(res);
      })
    }
  })
}

</script>

<template>
  <header>
    <span>图片管理</span>
  </header>
  <div class="container">
    <el-table :data="tableData" border style="width: 100%" :row-key="id" ref="listTable">
      <el-table-column type="index" draggable="true" />
      <el-table-column prop="id" label="id" />
      <el-table-column prop="src" label="图片">
        <template #default="scope">
          <cusImage style="width: 100px; height: 100px; margin-left:10px;" :src="scope.row.url" :id="scope.row.id"
            :preview-src-list="srcList" @click="changeOrder(scope.row.id)">
            <!-- <template >
                <button class="custom-button" @click="handleButtonClick">Custom Button</button>
              </template> -->
          </cusImage>
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
          <el-button size="small" @click="pass(scope.row)" :disabled="scope.row.status === '通过审核'">通过</el-button>
          <el-button size="small" @click="refuse(scope.row)" :disabled="scope.row.status === '未通过审核'">拒绝</el-button>
          <el-button size="small" @click="deleteImage(scope.row)">删除</el-button>
          <el-button size="small" @click="setTop(scope.row)">置顶</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="currentPage.value" :page-size="PAGE_SIZE" :total="imgCount"
      @current-change="handlePageChange" layout="prev, pager, next"></el-pagination>
  </div>
</template>

<style scoped></style>
