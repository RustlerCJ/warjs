/*global console*/
'use strict';
var $ = require('jquery');

module.exports = class PopulateDeck{
  constructor($el){
    this.$el = $el;
    this.method(this.$el);
  }
  method($element){

    var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
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




    function warPlayer(hand, stash){
      this.hand = hand;
      this.stash = stash;
    }
    var playerOneHand = deck;
    var playerTwoHand = playerOneHand.splice(0, Math.ceil(playerOneHand.length / 2));
    var playerOneStash = [];
    var playerTwoStash = [];
    var playerOne = new warPlayer(playerOneHand, playerOneStash);
    var playerTwo = new warPlayer(playerTwoHand, playerTwoStash);
    var warPile = [];
    var handWinner;

    function playWar(){

      if( playerOne.hand[0].rank > playerTwo.hand[0].rank ) {
        handWinner = playerOne;
      } else if ( playerOne.hand[0].rank < playerTwo.hand[0].rank ) {
        handWinner = playerTwo;
      } else {
        console.log('war');
        console.log('p1 '+playerOne.hand.length+' '+playerOne.stash.length);
        console.log('p2 '+playerTwo.hand.length+' '+playerTwo.stash.length);

        for(var i = 0; i <= 3; i++ ){
          warPile.push(playerOne.hand[0]);
          warPile.push(playerTwo.hand[0]);
          playerOne.hand.shift();
          playerTwo.hand.shift();
        }
        var warWinner = playWar();
        if (warWinner == playerOne) {
          for (var i = 0; i < warPile.length; i++) {
            playerOne.stash.push(warPile[i]);
          }
          console.log('p1 '+playerOne.hand.length+' '+playerOne.stash.length);
        } else {
          for (var i = 0; i < warPile.length; i++) {
            playerTwo.stash.push(warPile[i]);
          }
          console.log('p2 '+playerTwo.hand.length+' '+playerTwo.stash.length);
        }
        return;
      }

      if (handWinner == playerOne) {
        playerOne.stash.push(playerOne.hand[0]);
        playerOne.stash.push(playerTwo.hand[0]);
        console.log('p1 '+playerOne.hand.length+' '+playerOne.stash.length);
      } else {
        playerTwo.stash.push(playerOne.hand[0]);
        playerTwo.stash.push(playerTwo.hand[0]);
        console.log('p2 '+playerTwo.hand.length+' '+playerTwo.stash.length);
      }

      if(playerOne.hand.length == 1){
        shuffle(playerOne.stash);
        for(var card in playerOne.stash) {
          playerOne.hand.push(playerOne.stash[card]);
        }
        playerOne.stash.length = 0;
      }
      if(playerTwo.hand.length == 1){
        shuffle(playerTwo.stash);
        for(var card in playerTwo.stash) {
          playerTwo.hand.push(playerTwo.stash[card]);
        }
        playerTwo.stash.length = 0;
      }

      playerOne.hand.shift();
      playerTwo.hand.shift();

      if(playerOne.hand.length == 0){
        console.log('player two wins');
      }
      if(playerTwo.hand.length == 0){
        console.log('player one wins');
      }

      return handWinner;
    }



    $('body, html').on('click', function(){
      playWar();
    });








    // for (var card in deck) {
    //   $element.append( '<div class="card '+deck[card].suit+'">'+deck[card].rank+' '+deck[card].symbol+'</div>' );
    // }

    // for (var card in playerOne) {
    //   $element.append( '<div class="card '+playerOne[card].suit+'">'+playerOne[card].rank+' '+playerOne[card].symbol+'</div>' );
    // }
    // $element.append('<br /> <hr /> <br />');
    // for (var card in playerTwo) {
    //   $element.append( '<div class="card '+playerTwo[card].suit+'">'+playerTwo[card].rank+' '+playerTwo[card].symbol+'</div>' );
    // }

  }










};
