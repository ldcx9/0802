<template>
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Pagination',
    props: {
      total: {
        type: Number,
        required: true
      },
      currentPage: {
        type: Number,
        required: true
      },
      pageSize: {
        type: Number,
        required: true
      }
    },
    methods: {
      handleSizeChange(val) {
        this.$emit('update:pageSize', val);
        this.$emit('change');
      },
      handleCurrentChange(val) {
        this.$emit('update:currentPage', val);
        this.$emit('change');
      }
    }
  };
  </script>
  
  <style scoped>
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
  </style>