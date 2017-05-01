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

    function Card(suit, symbol, rank, value) {
      this.suit = suit;
      this.symbol = symbol;
      this.rank = rank;
      this.value = value;
    }

    var deck = [];
    var value = 1;

    for (var suit in suits) {
      value = 1;
      for (var rank in ranks) {
        value++;
        deck.push(new Card(suit, suits[suit], ranks[rank], value ));
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




    function warPlayer(name, hand, stash){
      this.name = name;
      this.hand = hand;
      this.stash = stash;
    }

    var playerOneHand = [];
    for(var card in deck) {
      playerOneHand.push(deck[card]);
    }

    var playerTwoHand = playerOneHand.splice(0, Math.ceil(playerOneHand.length / 2));
    var playerOneStash = [];
    var playerTwoStash = [];
    var playerOne = new warPlayer('blue', playerOneHand, playerOneStash);
    var playerTwo = new warPlayer('red', playerTwoHand, playerTwoStash);
    var warPile = [];
    var handWinner;


    function minHandSize(player, num){
      if (player.hand.length >= num) {

        return true;
      } else {
        return false;
      }
    }

    function checkLoss(player) {
      if (player.stash.length === 0 && player.hand.length === 0) {
        $('.live').addClass('hidden');
        $('.stack').addClass('hidden');
        $('.winAlert').removeClass('hidden');
        $('.winAlert').html('game over!<br />'+player.name+' loses')
        return true;
      } else {
        return false;
      }
    }

    function updateStacks(){
      $('.playerOne.hand').html('<span class="content">hand<br />'+(playerOne.hand.length-1)+'</span>');
      $('.playerTwo.hand').html('<span class="content">hand<br />'+(playerTwo.hand.length-1)+'</span>');
      $('.playerOne.stash').html('<span class="content">stash<br />'+playerOne.stash.length+'</span>');
      $('.playerTwo.stash').html('<span class="content">stash<br />'+playerTwo.stash.length+'</span>');
    }

    function updateBattlefield(){
      $('.playerTwo.live .content').html('<span class=" '+playerTwo.hand[0].suit+'">'+playerTwo.hand[0].rank+' '+playerTwo.hand[0].symbol+'</span><span class=" upsidedown '+playerTwo.hand[0].suit+'">'+playerTwo.hand[0].rank+' '+playerTwo.hand[0].symbol+'</span>');
      $('.playerOne.live .content').html('<span class=" '+playerOne.hand[0].suit+'">'+playerOne.hand[0].rank+' '+playerOne.hand[0].symbol+'</span><span class=" upsidedown '+playerOne.hand[0].suit+'">'+playerOne.hand[0].rank+' '+playerOne.hand[0].symbol+'</span>');
    }

    function restartGame(){
      $('.winAlert').addClass('hidden');
      $('.live').addClass('hidden');
      $('.stack').addClass('hidden');
      shuffle(deck);
      playerOne.hand.length = 0;
      playerTwo.hand.length = 0;
      for(var card in deck) {
        playerOne.hand.push(deck[card]);
      }
      playerTwo.hand = playerOne.hand.splice(0, Math.ceil(playerOne.hand.length / 2));
      playerOne.stash.length = 0;
      playerTwo.stash.length = 0;
    }

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

    function addStash(player) {
      shuffle(player.stash);
      if (player.stash.length === 0) {
        checkLoss(player);
        // $('.live').addClass('hidden');
        // $('.stack').addClass('hidden');
        // $('.winAlert').removeClass('hidden');
        // $('.winAlert').html('game over!<br />'+player.name+' loses')
        return;
      } else {
        for(var card in player.stash) {
          player.hand.push(player.stash[card]);
        }
        player.stash.length = 0;
      }
    }

    function continueBattle(){
      if( !minHandSize(playerOne, 4) ){
        addStash(playerOne);
      }
      if( !minHandSize(playerTwo, 4) ){
        addStash(playerTwo);
      }
      for(var i = 0; i <= 3; i++ ){
        warPile.push(playerOne.hand[0]);
        warPile.push(playerTwo.hand[0]);
        playerOne.hand.shift();
        playerTwo.hand.shift();
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

    function battle(){
      updateBattlefield();

      $('.draw').off();
      $(window).off();

      $('.draw').on('click', function(e){
        e.preventDefault();
        continueBattle();
        $('.draw').off();
        $(window).off();
        standardAction();
      });

      $(window).on('keypress', function(e){
        e.preventDefault();
        continueBattle();
        $('.draw').off();
        $(window).off();
        standardAction();
      });
    }

    function warTurn(){

      if( !minHandSize(playerOne, 1) ){
        addStash(playerOne);
      }
      if( !minHandSize(playerTwo, 1) ){
        addStash(playerTwo);
      }
      if( playerOne.hand[0].value > playerTwo.hand[0].value ) {
        handWinner = playerOne;
      } else if ( playerOne.hand[0].value < playerTwo.hand[0].value ) {
        handWinner = playerTwo;
      } else {
        battle();
        return;
      }

      console.log('r:'+playerTwo.hand[0].rank+'['+playerTwo.hand[0].value+'] vs b:'+playerOne.hand[0].rank+'['+playerOne.hand[0].value+'] = '+handWinner.name);

      updateBattlefield();
      updateStacks();

      handWinner.stash.push(playerOne.hand[0]);
      handWinner.stash.push(playerTwo.hand[0]);
      playerOne.hand.shift();
      playerTwo.hand.shift();
      return handWinner;
    }

    $('.playerOne.hand').html('<span class="content">hand<br />'+playerOne.hand.length+'</span>');
    $('.playerTwo.hand').html('<span class="content">hand<br />'+playerTwo.hand.length+'</span>');
    $('.playerOne.stash').html('<span class="content">stash<br />'+playerOne.stash.length+'</span>');
    $('.playerTwo.stash').html('<span class="content">stash<br />'+playerTwo.stash.length+'</span>');

    standardAction();

    $('.restart').on('click', function(e){
      e.preventDefault();
      restartGame();
    });

  }
};
