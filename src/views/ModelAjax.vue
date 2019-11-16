<template>
  <div>
    <div class="ui vertical segment">
      <div class="flexbox">
        <div class="flex-content">
          <h3>Search for an individual</h3>
          <div>
            <div class="foobar">
              <model-list-select
                :list="countries"
                option-value="code"
                option-text="name"
                v-model="individual"
                placeholder="search individual"
                @searchchange="searchCountry"
              >
              </model-list-select>
              <el-button style="padding-left: 50px"
                icon="el-icon-search"
                v-on:click="logSomething"
                >
              </el-button>
            </div>

          </div>
        </div>
        <!-- <div class="flex-result">
          <h4>input text(searchText)</h4>
          <p>{{searchText}}</p>
          <table class="ui celled table">
            <thead>
            <tr>
              <th>code</th>
              <th>name</th>
              <th>id</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{individual.code}}</td>
              <td>{{individual.name}}</td>
              <td>{{individual.ID}}</td>
            </tr>
            </tbody>
          </table>
        </div> -->
      </div>
    </div>
    <!-- <div class="ui vertical segment">
      <div class="flexbox">
        <div class="flex-content">
          <h3>Init with ajax</h3>
          <div>
            <model-list-select
              :list="animations"
              option-value="id"
              :custom-text="optionDisplayText"
              v-model="selectedAnimation"
              placeholder="select item"
              @searchchange="printSearchText"
            >
            </model-list-select>
          </div>
        </div>
        <div class="flex-result">
          <h4>input text(searchText)</h4>
          <p>{{searchText2}}</p>
          <table class="ui celled table">
            <thead>
            <tr>
              <th>id</th>
              <th>title_short1</th>
              <th>twitter_account</th>
              <th>public_url</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{selectedAnimation.id}}</td>
              <td>{{selectedAnimation.title_short1}}</td>
              <td>{{selectedAnimation.twitter_account}}</td>
              <td>{{selectedAnimation.public_url}}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div> -->
  </div>
</template>

<script>
import { ModelListSelect } from 'vue-search-select'
import axios from 'axios'
// import { ajaxFindCountry } from '../data/countriesApi'
import 'vue-search-select/dist/VueSearchSelect.css'
import { getIndustries, getIndividuals } from '../apis/airtable'


export default {
  data () {
    return {
      countries: [],
      individual: {},
      searchText: '',
      animations: [],
      selectedAnimation: {},
      searchText2: ''
    }
  },
  created () {
    this.searchAnimation()
  },
  methods: {
    searchCountry (searchText) {
      this.searchText = searchText
      // ajaxFindCountry(searchText).then(response => {
      //   this.countries = response
      // })
      this.searchText = searchText
      getIndividuals(searchText)
        .then(response => {
          this.countries = response
          console.log('this.countries', this.countries)
          })
    },
    printSearchText (searchText) {
      this.searchText2 = searchText
    },
    /**
     * api : https://qiita.com/AKB428/items/64938febfd4dcf6ea698
     */
    searchAnimation () {
      if (this.animations.length === 0) {
        axios.get(`http://api.moemoe.tokyo/anime/v1/master/2017/2`)
          .then(response => {
            this.animations = response.data
          })
          .catch(error => {
            /* eslint no-console: off */
            console.error(error)
          })
      }
    },
    optionDisplayText (animation) {
      return `${animation.title_short1} - ${animation.twitter_account} - ${animation.public_url}`
    },
    logSomething () {
      console.log('log something', this.individual.name, this.individual.ID)
      this.$router.push({
        path: 'results',
        query: {
          individual: this.individual.ID
          }
        })
    }
  },
  components: {
    ModelListSelect
  }
}
</script>

<style>
.foobar {
  display: flex;
  flex-direction: row;
}
</style>

