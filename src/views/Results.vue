<template>
  <div class="post">
    <h1>RESULTS for individual</h1>
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <el-card v-for="business in post">
        {{ business }}
        <el-rate
          v-model="business.communicationRating"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value} points">
        </el-rate>
      </el-card>
      <el-card>
        <a href="https://airtable.com/shrCbN3XSgXaifXNY">Submit a review!</a>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getReviews } from '../apis/airtable'

export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null,
      value: 3
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // replace `getPost` with your data fetching util / API wrapper
      // getPost(this.$route.params.id, (err, post) => {
      //   this.loading = false
      //   if (err) {
      //     this.error = err.toString()
      //   } else {
      //     this.post = post
      //   }
      // })
      console.log('foobar query param', this.$route.query.individual)
      let filteredIndividual = this.$route.query.individual
      getReviews(filteredIndividual)
        .then(response => {
          this.loading = false
          this.post = response
          console.log('sup post', this.post)
        })
        .catch(err => {
          console.error(err);
          this.loading = false
          this.error = err
        })
    }
  }  
}
</script>