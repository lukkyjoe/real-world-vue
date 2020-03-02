<template>
  <div class="post">
    <h1>Reviews for {{individualName}}</h1>
    <h2>Net Promoter Score: {{NPSObj.score}}</h2>
    <h3>This provider has been rated as {{NPSObj.summary}} by past clients</h3>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <el-card v-for="({reviewScore, notes}, index) in post" v-bind:key="index">
        <!-- {{ business }} -->
        <br>
        <div v-if="notes.positive"><strong>Positives:</strong> {{notes.positive}}</div>
        <br>
        <div v-if="notes.negative">Negatives: {{notes.negative}}</div>
        <br>
        <div v-if="notes.general">General: {{notes.general}}</div>
        <!-- <el-rate
          v-model="business.communicationRating"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value} points">
        </el-rate> -->
      </el-card>
      <el-card v-if="isEmpty">
        <a :href="reviewFormLink">Be the first to submit a review!</a>
      </el-card>
      <el-card v-else>
        <a :href="reviewFormLink">Submit a review!</a>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getReviews } from '../apis/airtable'
import NPS from 'net-promoter-score'

export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null,
      value: 3,
      individualName: 'individual',
      emptyText: 'Be the first to submit review for this individual.',
      NPSObj: {}
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
    },
    reviewFormLink() {
      console.log('data for submit link',)
     return (this.$route.query.individual && this.$route.query.name) ? `https://airtable.com/shrCbN3XSgXaifXNY?prefill_Name%20of%20broker=${this.$route.query.name}&prefill_individual_being_reviewed=${this.$route.query.individual}` : `https://airtable.com/shrCbN3XSgXaifXNY`
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
          const mapOfScores = this.post.map(review => Number(review.reviewScore))
          this.NPSObj = new NPS(mapOfScores)

          // group the scores by buckets
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