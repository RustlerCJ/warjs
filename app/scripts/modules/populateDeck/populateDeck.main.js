/*global console, window*/
'use strict';
var $ = require('jquery');

module.exports = class PopulateDeck{
  constructor($el){
    this.$el = $el;
    this.method(this.$el);
  }
  method($element){

    // tools for creating deck
    var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    var suits = {
      spade: '♠',
      heart: '♥',
      diamond: '♦',
      club: '♣'
    };

    // card object
    function Card(suit, symbol, rank, value) {
      this.suit = suit;
      this.symbol = symbol;
      this.rank = rank;
      this.value = value;
    }

    var deck = [];
    var value = 1;

    //populate deck with card objects
    for (var suit in suits) {
      value = 1;
      for (var rank in ranks) {
        value++;
        deck.push(new Card(suit, suits[suit], ranks[rank], value ));
      }
    }

    // random shuffle
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

    // player object
    function warPlayer(name, hand, stash){
      this.name = name;
      this.hand = hand;
      this.stash = stash;
    }

    // push shuffled deck into player one's hand
    var playerOneHand = [];
    for(var card in deck) {
      playerOneHand.push(deck[card]);
    }
    // split player one's hand in half for player two's hand
    var playerTwoHand = playerOneHand.splice(0, Math.ceil(playerOneHand.length / 2));
    var playerOneStash = [];
    var playerTwoStash = [];

    // populate player objects
    var playerOne = new warPlayer('blue', playerOneHand, playerOneStash);
    var playerTwo = new warPlayer('red', playerTwoHand, playerTwoStash);
    var warPile = [];
    var handWinner;

    // check for minimum hand size
    function minHandSize(player, num){
      if (player.hand.length >= num) {
        return true;
      } else {
        return false;
      }
    }

    // check to see if player has lost
    function checkLoss(player) {
      if (player.stash.length === 0 && player.hand.length === 0) {
        $('.live').addClass('hidden');
        $('.stack').addClass('hidden');
        $('.winAlert').removeClass('hidden');
        $('.draw').off();
        $(window).off();
        if (player == playerOne) {
          $('.winAlert').html('game over!<br />'+playerTwo.name+' wins');
        } else {
          $('.winAlert').html('game over!<br />'+playerOne.name+' wins');
        }
        return true;
      } else {
        return false;
      }
    }

    // update the UI card stacks
    function updateStacks(){
      $('.playerOne.hand').html('<span class="content">hand<br />'+playerOne.hand.length+'</span>');
      $('.playerTwo.hand').html('<span class="content">hand<br />'+playerTwo.hand.length+'</span>');
      $('.playerOne.stash').html('<span class="content">stash<br />'+playerOne.stash.length+'</span>');
      $('.playerTwo.stash').html('<span class="content">stash<br />'+playerTwo.stash.length+'</span>');
    }

    // update cards on battlefield with current values
    function updateBattlefield(){
      $('.playerTwo.live .content').html('<span class=" '+playerTwo.hand[0].suit+'">'+playerTwo.hand[0].rank+' '+playerTwo.hand[0].symbol+'</span><span class=" upsidedown '+playerTwo.hand[0].suit+'">'+playerTwo.hand[0].rank+' '+playerTwo.hand[0].symbol+'</span>');
      $('.playerOne.live .content').html('<span class=" '+playerOne.hand[0].suit+'">'+playerOne.hand[0].rank+' '+playerOne.hand[0].symbol+'</span><span class=" upsidedown '+playerOne.hand[0].suit+'">'+playerOne.hand[0].rank+' '+playerOne.hand[0].symbol+'</span>');
    }

    // return standard controls to button and keypress after war
    function standardAction(){
      $('.draw').on('click', function(e){
        e.preventDefault();
        $('.live').removeClass('hidden');
        warTurn();
        if ( !$('.stack').hasClass('hidden') ) {
          $('.stack').addClass('hidden');
        }
      });
      $(window).on('keypress', function(e){
        e.preventDefault();
        $('.live').removeClass('hidden');
        warTurn();
        if ( !$('.stack').hasClass('hidden') ) {
          $('.stack').addClass('hidden');
        }
      });
    }

    // add a player's stash to their hand
    function addStash(player) {
      checkLoss(player);
      shuffle(player.stash);
      for(var card in player.stash) {
        player.hand.push(player.stash[card]);
      }
      player.stash.length = 0;
    }

    // make sure players can have a war
    function checkBattle(){
      if( !minHandSize(playerOne, 4) ){
        addStash(playerOne);
        continueBattle( playerOne.hand.length );
      } else if( !minHandSize(playerTwo, 4) ){
        addStash(playerTwo);
        continueBattle( playerTwo.hand.length );
      } else {
        continueBattle(4);
      }
    }

    // place cards down and have a war
    function continueBattle( numCards ){
      var cardsDown = numCards - 1;
      if(cardsDown >= 3) {
        for(var i = 0; i <= 3; i++ ){
          warPile.push(playerOne.hand[0]);
          warPile.push(playerTwo.hand[0]);
          playerOne.hand.shift();
          playerTwo.hand.shift();
        }
      } else {
        for(var i = 0; i <= cardsDown; i++ ){
          warPile.push(playerOne.hand[0]);
          warPile.push(playerTwo.hand[0]);
          playerOne.hand.shift();
          playerTwo.hand.shift();
        }
      }
      var warWinner = warTurn();
      if (warWinner == playerOne) {
        for (var i = 0; i < warPile.length; i++) {
          playerOne.stash.push(warPile[i]);
        }
      } else {
        for (var i = 0; i < warPile.length; i++) {
          playerTwo.stash.push(warPile[i]);
        }
      }
      warPile.length = 0;
      $('.stack').removeClass('hidden');
    }

    // change function of controls to button and keypress for war
    function battle(){
      updateBattlefield();
      $('.draw').off();
      $(window).off();
      $('.draw').on('click', function(e){
        e.preventDefault();
        checkBattle();
        $('.draw').off();
        $(window).off();
        standardAction();
      });
      $(window).on('keypress', function(e){
        e.preventDefault();
        checkBattle();
        $('.draw').off();
        $(window).off();
        standardAction();
      });
    }

    // standard turn
    function warTurn(){
      if( !minHandSize(playerOne, 1) ){
        addStash(playerOne);
        checkLoss(playerOne);
      }
      if( !minHandSize(playerTwo, 1) ){
        addStash(playerTwo);
        checkLoss(playerTwo);
      }
      if( playerOne.hand[0].value > playerTwo.hand[0].value ) {
        handWinner = playerOne;
      } else if ( playerOne.hand[0].value < playerTwo.hand[0].value ) {
        handWinner = playerTwo;
      } else {
        battle();
        return;
      }

      // log card values for debugging purposes
      console.log('r:'+playerTwo.hand[0].rank+'['+playerTwo.hand[0].value+'] vs b:'+playerOne.hand[0].rank+'['+playerOne.hand[0].value+'] = '+handWinner.name);

      updateBattlefield();
      updateStacks();

      // push battl cards into winners stash
      handWinner.stash.push(playerOne.hand[0]);
      handWinner.stash.push(playerTwo.hand[0]);
      playerOne.hand.shift();
      playerTwo.hand.shift();

      //check for losses
      if (checkLoss(playerOne) ) {
        return;
      }
      if (checkLoss(playerTwo) ) {
        return;
      }

      return handWinner;
    }

    updateStacks();
    standardAction();
  }
};
