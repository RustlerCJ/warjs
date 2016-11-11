'use strict';

var $ = require('jquery');

module.exports = class PopulateDeck{
  constructor($el){
    this.$el = $el;
    this.method(this.$el);
  }
  method($element){

    var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    var suits = {
      spade: '♠',
      heart: '♥',
      diamond: '♦',
      club: '♣'
    };

    function Card(suit, symbol, rank) {
        this.suit = suit;
        this.symbol = symbol;
        this.rank = rank;
    }

    var deck = [];

    for (var suit in suits) {
      for (var rank in ranks) {
        deck.push(new Card(suit, suits[suit], ranks[rank] ));
      }
    }

    function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
      }
    }
    shuffle(deck);

    for (var card in deck) {
      $element.append( '<div class="card '+deck[card].suit+'">'+deck[card].rank+' '+deck[card].symbol+'</div>' );
    }

  }










};
