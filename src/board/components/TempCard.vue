<template>
  <div class="container">

    <!-- Upload your deck -->

    <b-modal
      id="deck-upload"
      title="Deck Upload"
      ref="upload-modal"
      @ok="ok"
      ok-only
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      visible
      >
        <div>
          <b-form-file
            v-model="upload_deck"
            :state="Boolean(upload_deck)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            id="selected"
            
          ></b-form-file>
          
        </div>
        <b-button @click="readDeck">Preview</b-button>

        <div id="error_notify">
          <pre class="text-danger"> {{this.deckErrMsg}} </pre>
        </div>

        <br>
        <br>
        <h5>Preview of deck</h5>

        <div>
          <b-list-group>
            <b-list-group-item>
              <h5> Main Deck: </h5>

              <div class="row">
                <template v-for="element in upload_main">
                  <div
                    class="col-2"
                    v-for="card in element.cnt"
                    :key="element.detail.card_number + card"
                    style="padding-left: 0px; padding-right: 0px;"
                    >

                    <img
                      :src="element.detail.img_url"
                      title="Click to check out detail"
                      class="deck-img-tb"
                      alt="error">

                  </div>
                </template>
              </div>

            </b-list-group-item>

            <b-list-group-item>
              <h5> Ex-Deck: </h5>

              <div class="row">
                <template v-for="element in upload_ex">
                  <div
                    class="col-2"
                    v-for="card in element.cnt"
                    :key="element.detail.card_number + card"
                    style="padding-left: 0px; padding-right: 0px;"
                    >

                    <img
                      :src="element.detail.img_url"
                      title="Click to check out detail"
                      class="deck-img-tb"
                      alt="error">

                  </div>
                </template>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
        
    </b-modal>

    <strong> {{title_from}} {{this.card_list.length}} 枚</strong>
    <draggable
      class="card-list"
      tag="div"
      v-model="card_list"
      v-bind="dragOptions"
      :emptyInsertThreshold="150"
      @start="drag = true"
      @end="drag = false"
      @add="updateAddTo"
      @remove="updateRemoveTo"
    >
      <transition-group
        id="temp-area"
        :area-name="title_from"
        class="row"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        
        <div
          class="item col"
          v-for="(element, index) in card_list"
          :key="'temp-' + index"
          :class = "index % 10 == 0 ? 'item col-1' : 'item col-1' "
        >
          <img :src="title_from == 'Deck' ? back_img : element.detail.img_url" />
          <i
            :class="
              element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
            "
            @click="element.fixed = !element.fixed"
            aria-hidden="true"
          >{{index}},{{element.order}}</i>

        </div>
      </transition-group>
    </draggable>  
    
  </div>
</template>

<script>
import draggable from "vuedraggable";
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: "hand-area",
  display: "hand-area",
  order: 6,
  components: {
    draggable,
  },
  data() {
    //const message = [];

    //for(let i = 0;i < 50;++i){
    //  message.push(toString(i + 1));
    //}
    
    //const rowofcard = 5;
    //const mapped_list = message.map((name, index) => {
    //  return { name, order: index + 1 };
    //});

    const mapped_list = [];

    return {
      card_list: mapped_list,
      drag: false,
      title_from: "Temp Card Area",
      modalData: null,
      back_img: require('../PM_Back.jpg'),

      // upload
      upload_deck: null,
      upload_main: [],
      upload_ex: [],
      deckErrMsg: '',
    };
  },
  methods: {
    openModal(data) {
      console.log("jizz:" + data);
      this.modalData = data;
    },
    addToHand(id) {
      console.log("id: " + id);
      console.log("element: " + this.card_list[id].order);

      // remove it from list
      this.card_list.splice(id,1);
      
      this.$bus.$emit("get-card")
    },
    updateAddTo(card_data) {
      console.log("updateAddTo" + this.title_from);
      switch(this.title_from) {
        case "Deck":
          this.$bus.$emit("add-to-deck",card_data.newIndex,this.card_list[card_data.newIndex]);
          break;
        case "Discard":
          this.$bus.$emit("add-to-discard",card_data.newIndex,this.card_list[card_data.newIndex]);
          break;
        case "Ex-Deck":
          this.$bus.$emit("add-to-ex-deck",card_data.newIndex,this.card_list[card_data.newIndex]);
          break;
        case "Excluded":
          this.$bus.$emit("add-to-excluded",card_data.newIndex,this.card_list[card_data.newIndex]);
          break;
      }
    },
    updateRemoveTo(card_data) {
      switch(this.title_from) {
        case "Deck":
          this.$bus.$emit("remove-to-deck",card_data.oldIndex);
          break;
        case "Discard":
          this.$bus.$emit("remove-to-discard",card_data.oldIndex);
          break;
        case "Ex-Deck":
          this.$bus.$emit("remove-to-ex-deck",card_data.oldIndex);
          break;
        case "Excluded":
          this.$bus.$emit("remove-to-excluded",card_data.oldIndex);
          break;
      }
    },

    // initial upload 
    readDeck() {
      const files = document.getElementById('selected').files;
      if (files.length <= 0) {
        return false;
      }

      const fr = new FileReader();

      fr.onload = e => {
        const result = JSON.parse(e.target.result);
        //formatted = JSON.stringify(result, null, 2);

        //console.log(result.main);
        this.upload_main = result.main;
        this.upload_ex = result.ex;
        console.log(this.upload_main);
        console.log(this.upload_ex);
        console.log(this.upload_main.length);
      }
      fr.readAsText(files.item(0));

      console.log(this.upload_deck);
      console.log("jizzzzz");
    },
    shuffle(arr) {
      for(let i = arr.length - 1;i > 0;--i){
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i],arr[j]] = [arr[j],arr[i]];
      }
    },
    ok(bvModalEvt) {
      bvModalEvt.preventDefault();

      this.readDeck();

      // if deck is valid

      setTimeout(() => {
        if(!this.validDeck()){
          console.log("not valid!");
          console.log(this.deckErrMsg);

          var err_box = document.getElementById("error_notify");
          err_box.classList.add("deck_error_notify");
          return;
        }

        // emit to deck ,ex-card ,hand to load deck
        // first unfold upload_main into upload_deck
        // then split 7 cards from upload_deck to upload_hand
        // after reorder each card, we can emit finally

        // handle with main deck

        let upload_deck = [];
        let upload_hand = [];
        let upload_exdeck = [];
        let order_cnt = 0;

        for(let i = 0;i < this.upload_main.length;++i){
          for(let j = 0;j < this.upload_main[i].cnt;++j){
            let card = JSON.parse(JSON.stringify(this.upload_main[i]));
            card.order = order_cnt;
            upload_deck.push(card);
            order_cnt++;
          }
        }

        this.shuffle(upload_deck);

        for(let i = 0;i < 7;++i){
          let random = Math.floor(Math.random() * upload_deck.length);
          upload_hand.push(upload_deck[random]);
          console.log(upload_deck[random]);
          upload_deck.splice(random,1);
        }

        // handle with ex deck

        for(let i = 0;i < this.upload_ex.length;++i){
          for(let j = 0;j < this.upload_ex[i].cnt;++j){
            let card = JSON.parse(JSON.stringify(this.upload_ex[i]));
            card.order = order_cnt;
            upload_exdeck.push(card);
            order_cnt++;
            console.log(card);
          }
        }


        this.$bus.$emit("load-to-deck",upload_deck);
        this.$bus.$emit("load-to-hand",upload_hand);
        this.$bus.$emit("load-to-ex",upload_exdeck);

        console.log("upload_deck");
        console.log(upload_deck);
        console.log(upload_hand);
        console.log(order_cnt);

        this.$nextTick(() => {
          this.$bvModal.hide('deck-upload');
        });
      },50);
    },
    validDeck() {
      let valid = true;
      this.deckErrMsg = '';
      this.readDeck();

      setTimeout(() => {
        if(this.upload_main.length < 60){
          this.deckErrMsg = 'You need 60 cards in your main deck\n';
          valid = false;
        } else if(this.upload_main.length > 60){
          this.deckErrMsg = 'You only need 60 cards in your main deck\n';
          valid = false;
        }

        let card_cnt = 0;
        for(let i = 0;i < this.upload_main.length;++i){
          card_cnt += this.upload_main[i].cnt;
        }

        this.deckErrMsg += ' Your main deck: ' + card_cnt + '/60';
        console.log("valid:" + valid);
        console.log(this.deckErrMsg);
        return valid;
      },50);
      return true;
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  mounted() {

    // be opened

    this.$bus.$on("open-temp",(msg,card_list) => {
      this.title_from = msg;
      this.card_list = card_list;
      console.log("temp: receive!");
    });

    this.$bus.$on("cancel-temp-drop",(id) => {
      this.card_list.splice(id,1);
      console.log("temp: cancel " + id);
    });
  }
};
</script>

<style>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.card-list {
  min-height: 20px;
  max-width: 100%;
}
.item {
  cursor: move;
  float: left;
  //width: 50%;
  //height: 300px;
  //background-image: url("../PM_Back.jpg");
  //background-size: 100%;
  //background-repeat: no-repeat;
  //background-position: center;
  padding: 0;
}
.item i {
  cursor: pointer;
}
.item img {
  vertical-align: top;
  max-width: 100%;
  //opacity: 0;
}
.deck-img-tb {
  width:100%;
}
#pick {
  margin-bottom: 5px;
}
.deck_error_notify {
  border: 1px #FF2D2D solid;
}
</style>
