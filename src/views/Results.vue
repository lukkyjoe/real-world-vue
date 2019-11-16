<template>
  <div class="post">
    <h1>Reviews for {{individualName}}</h1>
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <el-card v-for="business in post" v-bind:key="business">
        {{ business }}
        <div v-if="business.netPromoterScore">Net Promoter Score: {{business.netPromoterScore}}</div>
        <!-- <el-rate
          v-model="business.communicationRating"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value} points">
        </el-rate> -->
      </el-card>
      <el-card v-if="isEmpty">
        <a href="https://airtable.com/shrCbN3XSgXaifXNY">Be the first to submit a review!</a>
      </el-card>
      <el-card v-else>
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
      value: 3,
      individualName: 'individual',
      emptyText: 'Be the first to submit review for this individual.'
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  computed: {
    isEmpty: function() {
      return this.post.length === 0
    }
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
          this.individualName = this.$route.query.name
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