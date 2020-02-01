<template>
  <div id="app">
    <div class="container">
      <div class="foobar">
        <vue-autosuggest
          ref="autocomplete"
          v-model="query"
          :suggestions="suggestions"
          :inputProps="inputProps"
          :renderSuggestion="renderSuggestion"
          :getSuggestionValue="getSuggestionValue"
          :on-selected="onSelected"
          @input="fetchResults"
        >
        <!-- <template slot="after-section">Some text</template> -->
        </vue-autosuggest>
        <el-button
          icon="el-icon-search"
          v-on:click="logSomething"
        >Search
        </el-button>
      </div>
      <div v-if="selected" style="margin-top: 10px;">
        You have selected:
        <code>
          <pre>{{ JSON.stringify(selected, null, 4) }}</pre>
        </code>
      </div>
    </div>
  </div>
</template>

<script>
import { VueAutosuggest } from "vue-autosuggest";
import axios from "axios";
import { getIndividuals } from "../apis/airtable";

export default {
  name: "app",
  components: {
    VueAutosuggest
  },
  data() {
    return {
      query: "",
      results: [],
      timeout: null,
      selected: null,
      debounceMilliseconds: 250,
      usersUrl: "https://jsonplaceholder.typicode.com/users",
      photosUrl: "https://jsonplaceholder.typicode.com/photos",
      inputProps: {
        id: "autosuggest__input",
        class: "form-control",
        name: "hello",
        onInputChange: this.onInputChange
      },
      suggestions: [],
      individual: {}
    };
  },
  methods: {
    fetchResults() {
      const query = this.query;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // const photosPromise = axios.get(this.photosUrl);
        // const usersPromise = axios.get(this.usersUrl);

        // Promise.all([photosPromise, usersPromise]).then(values => {
        //   this.suggestions = [];
        //   this.selected = null;

        //   const photos = this.filterResults(values[0].data, query, "title");
        //   const users = this.filterResults(values[1].data, query, "name");

        //   users.length &&
        //     this.suggestions.push({ name: "destinations", data: users });
        //   photos.length &&
        //     this.suggestions.push({ name: "hotels", data: photos });
        // });
        const sup = getIndividuals(query);
        sup
          .then(values => {
            this.suggestions = [];
            console.log("inside the then block", values);
            this.suggestions.push({ name: "defaultss", data: values }); //something reactive happens here ....
          })
          .catch(err => console.log("inside catch!", err));
      }, this.debounceMilliseconds);
    },
    filterResults(data, text, field) {
      console.log("filterResults", arguments);
      return data
        .filter(item => {
          if (item[field].toLowerCase().indexOf(text.toLowerCase()) > -1) {
            return item[field];
          }
        })
        .sort();
    },
    onSelected(option) {
      console.log("onselected option", option);
      this.selected = option.item;
    },
    renderSuggestion(suggestion) {
      console.log("renderSuggestion", arguments);
      if (suggestion.name === "hotels") {
        const image = suggestion.item;
        console.log(image);
        return (
          <div>
            <img class={{ avatar: true }} src={image.thumbnailUrl} />
            {image.title}
          </div>
        );
      } else {
        return suggestion.item.name;
      }
    },
    onInputChange(text) {
      console.log("onInputChange", text);
      if (text === "" || text === undefined) {
        return;
      }

      /* Full control over filtering. Maybe fetch from API?! Up to you!!! */
      const filteredData = this.options[0].data
        .filter(item => {
          return item.toLowerCase().indexOf(text.toLowerCase()) > -1;
        })
        .slice(0, this.limit);

      this.filteredOptions = [
        {
          data: filteredData
        }
      ];
    },
    getSuggestionValue(suggestion) {
      let { name, item } = suggestion;
      console.log("get suggestion value", suggestion);
      this.individual = suggestion.item;
      return suggestion.item.name;
    },
    logSomething() {
      console.log(
        "log something",
        this.individual
      );
      this.$router.push({
        path: "results",
        query: {
          individual: this.individual.ID,
          name: this.individual.code
        }
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.avatar {
  height: 25px;
  width: 25px;
  border-radius: 20px;
  margin-right: 10px;
}
#autosuggest__input {
  outline: none;
  position: relative;
  display: block;
  border: 1px solid #DCDFE6;
  padding: 12px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 10px;
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

#autosuggest {
    width: 100%;
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

.foobar {
  display: flex;
  flex-direction: row;
  position: relative;
}
</style>
