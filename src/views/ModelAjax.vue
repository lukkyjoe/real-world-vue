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
                @searchchange="searchIndividual"

              >
              </model-list-select>
              <el-button style="padding-left: 50px"
                icon="el-icon-search"
                v-on:click="logSomething"
                >
              </el-button>
            </div>
            <vue-autosuggest
              ref="autocomplete"
              v-model="query"
              @input="fetchResults"
              :suggestions="suggestions"
              :inputProps="inputProps"
              :render-suggestion="renderSuggestion"
              :getSuggestionValue="getSuggestionValue"
            />
            <!-- <template slot-scope="{suggestion}">
              <span class="my-suggestion-item">{{suggestion.item}}</span>
            </template> -->
            <el-card
              class="create-profile"
            >
              <a href="https://airtable.com/shr0A9hWQExhLLXs3">Can't find your broker? Create a profile for and help your community by adding to the database!</a>
            </el-card>
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
import { getIndividuals } from '../apis/airtable'
import { VueAutosuggest } from "vue-autosuggest"


export default {
  data () {
    return {
      countries: [],
      individual: {},
      searchText: '',
      animations: [],
      selectedAnimation: {},
      searchText2: '',
      query: "",
      suggestions: [],
      inputProps: {
        id: "autosuggest__input",
        placeholder: "Do you feel lucky, punk?",
        class: "form-control",
        name: "hello"
      },
    }
  },
  created () {
    this.searchAnimation()
  },
  methods: {
    searchIndividual (searchText) {
      this.searchText = searchText
      // ajaxFindCountry(searchText).then(response => {
      //   this.countries = response
      // })
      getIndividuals(searchText)
        .then(response => {
          this.countries = response
        })
    },
    renderSuggestion(suggestion) {
      console.log('inside renderSuggestion', suggestion)
        return (
          <div>
            {suggestion}
          </div>
        );
    },
    fetchResults (){
      const query = this.query
      console.log('fetching results', query)

      // ajaxFindCountry(searchText).then(response => {
      //   this.countries = response
      // })
      getIndividuals(query)
        .then(response => {
          this.suggestions = response
          return
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
          individual: this.individual.ID,
          name: this.individual.code
          }
        })
    },
    getSuggestionValue(suggestion) {
      console.log('inside getSuggestionValue', suggestion)
      return suggestion
    }
  },
  components: {
    ModelListSelect,
    VueAutosuggest
  }
}
</script>

<style>
.foobar {
  display: flex;
  flex-direction: row;
}
.create-profile {
  position: absolute;
  bottom: 100px;
  width: 100%;
}

#autosuggest__input {
  outline: none;
  position: relative;
  display: block;
  border: 1px solid #616161;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: white;
  padding: 0px;
  max-height: 400px;
  overflow-y: scroll;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results-item {
  cursor: pointer;
  padding: 15px;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results-before {
  color: gray;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results-item:active,
.autosuggest__results .autosuggest__results-item:hover,
.autosuggest__results .autosuggest__results-item:focus,
.autosuggest__results
  .autosuggest__results-item.autosuggest__results-item--highlighted {
  background-color: #f6f6f6;
}
</style>

