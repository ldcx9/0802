<template>
  <div class="statistics-dashboard">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据统计</span>
      </div>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="开始日期">
          <el-date-picker v-model="form.startDate" type="date" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="form.endDate" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="form.area" placeholder="地区（可选）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchStatistics">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card mt-4">
      <div slot="header" class="clearfix">
        <span>问题统计</span>
      </div>
      <div class="statistics-summary">
        <div class="statistic-item">
          <div class="statistic-label">问题总数</div>
          <el-progress :percentage="100" :format="() => statistics.totalCount" :stroke-width="20" color="#409EFF"></el-progress>
        </div>
        <div class="statistic-item">
          <div class="statistic-label">已解决问题数</div>
          <el-progress :percentage="getPercentage(statistics.resolvedCount)" :format="() => statistics.resolvedCount" :stroke-width="20" color="#67C23A"></el-progress>
        </div>
        <div class="statistic-item">
          <div class="statistic-label">未解决问题数</div>
          <el-progress :percentage="getPercentage(statistics.unresolvedCount)" :format="() => statistics.unresolvedCount" :stroke-width="20" color="#E6A23C"></el-progress>
        </div>
      </div>
    </el-card>

    <el-card class="box-card mt-4">
      <div slot="header" class="clearfix">
        <span>关键词统计</span>
      </div>
      <div ref="keywordChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'StatisticsDashboard',
  data() {
    return {
      form: {
        startDate: '',
        endDate: '',
        area: ''
      },
      statistics: {
        totalCount: 0,
        resolvedCount: 0,
        unresolvedCount: 0,
        keywordStatistics: []
      },
      chart: null
    };
  },
  methods: {
    fetchStatistics() {
      const { startDate, endDate, area } = this.form;
      this.$axios.get('http://106.55.225.211:81/api/QusInt/GetStatistics', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          area
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (response.data.code === 2000) {
          this.statistics = response.data.data;
          this.updateChart();
        } else {
          this.$message.error(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
        this.$message.error('获取统计数据失败');
      });
    },
    updateChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.keywordChart);
      }
      const option = {
        title: {
          text: '关键词统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.statistics.keywordStatistics.map(item => item.keyword),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.statistics.keywordStatistics.map(item => item.count),
          type: 'bar'
        }]
      };
      this.chart.setOption(option);
    },
    getPercentage(value) {
      return this.statistics.totalCount > 0 ? (value / this.statistics.totalCount) * 100 : 0;
    }
  },
  mounted() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 5);
    end.setMonth(start.getMonth() + 6);
    this.form.startDate = start;
    this.form.endDate = end;
    this.fetchStatistics();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style scoped>
.statistics-dashboard {
  padding: 20px;
}
.mt-4 {
  margin-top: 20px;
}
.statistics-summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.statistic-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.statistic-label {
  min-width: 120px;
  font-weight: bold;
}
.el-progress {
  width: calc(100% - 140px);
}
</style>