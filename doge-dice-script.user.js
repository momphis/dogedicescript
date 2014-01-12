// ==UserScript==
// @name       doge dice conversion
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  script to convert dogecoin into btc/usd
// @require     http://code.jquery.com/jquery-latest.min.js
// @match      https://doge-dice.com/*
// @grant       GM_xmlhttpRequest
// @copyright  2014+, momphis.justdice@gmail.com
// ==/UserScript==
// 16D5URtvvyMwnnG6kXUSJSd3ajx7WFYqBf for btc donations
// DBjd7Hxv7gRk1pkJXLu17z4NF2f4TRx1Ed for doge donations
var convertDiv;

// Socket code
function Socket () {
    var lastResponse;
    var attempts = 0;
    priceData = ({ });
      // GM_xmlhttpRequest synchronous mode locks up the browser UI so all requests come here, async request, then pass to the handling function 
      // wish sync mode worked :(
       this.connect = function ( type, myCurr, second ) {
           var inurl, meth = "GET", d = "";

           switch ( type ) {
               case "btc" : 
                                inurl = "https://api.bitcoinaverage.com/ticker/"+myCurr;
                   				//meth = "GET";
                                break;
               case "doge":		inurl = "http://www.cryptocoincharts.info/v2/api/tradingPair/doge_"+myCurr;
                   				//inurl = "http://www.cryptocoincharts.info/v2/api/tradingPairs/"; // can't get pairs working meh.
                   				//d = "pairs=doge_btc,doge_ltc";
                                //meth = "POST";
                                break;
           }
            GM_xmlhttpRequest( {
                method: meth,
                url: inurl,
               // data: d,
                onload: function( resp ) { console.log("Socket success"); console.log(resp); 
                   var respP = JSON.parse(resp['responseText']);
                    if ( !second ) {
                       
                       priceData['btc'] = respP['last'];
                       socket.connect( 'doge', 'btc', true );
                    }
                    else {
                       priceData['doge'] = respP['price'];
                       priceData['market'] = respP['best_market'];            
                       socket.writePrice( priceData );
                    }
					return resp;
                },
                onerror: function( resp ) { console.log("Socket error"); console.log(resp);  $('.chatinput').val( "error connecting to cryptocoincharts" ); }
            } );
        }
        
        this.writePrice = function ( priceData ) { 
			var doge = $( '#dogeValue' ).val(), total = doge*priceData['doge'];
            console.log(priceData);
            
            $('.chatinput').val( doge+" DOGE is currently worth "+total+" BTC ($"+(parseInt(total)*parseInt(priceData['btc']))+") on "+priceData['market']+" (1 DOGE = "+priceData['doge']+" BTC)" );
        }
}

function convertPopup () {

	var div = document.createElement( 'div' );
    // $( div ).css({ 'z-index':1,'position':'fixed','top':200,'left':200,'background':'#fff'});
    $( div ).css({ 'float':'right' });
	$( '.chatbutton' ).after( div ); 
    $( '.fright' ).hide();
    
    var input = document.createElement( 'input' );
    $( input ).attr({ 'id':'dogeValue' });
    $( input ).val( 'Convert Doge?' );
    $( input ).focus( function () { if ( $( this ).val() == "Convert Doge?" ) $( this ).val(""); } );
    var button = document.createElement( 'button' );
    $( button ).text( 'Go?' );
    $( button ).click( function ( e ) { 
        var doge = $( '#dogeValue' ).val();
        doge = parseInt( doge );
       
        var lastBtc = socket.connect( "btc", "USD", false );


    });
       // console.log( socket.connect( "btc" ,"USD") );
	//	console.log( socket.connect( "doge",'btc' ) );
                                           //console.log( socket.connect( "doge",'ltc' ) ); } );
    $( div ).append( input );
    $( div ).append( button );
    //    convertDiv = div;
}

var socket = new Socket();
//console.log( socket.connect( "btc" ,"USD") );
//console.log( socket.connect( "doge",'btc' ) );
//console.log( socket.connect( "doge",'ltc' ) );

convertPopup();


