 //UHEPRNG - Ultra High Entropy Pseudo-Random Number Generator
 function uheprng(){return function(){function i(){++c>=a&&(c=0);var e=1768863*d[c]+2.3283064365386963e-10*b;return d[c]=e-(b=0|e)}function k(){var b=Array.prototype.slice.call(arguments);for(e=0;e<b.length;e++)for(f=0;f<a;f++)d[f]-=h(b[e]),d[f]<0&&(d[f]+=1)}var e,f,a=48,b=1,c=a,d=new Array(a),g=0,h=Mash();for(e=0;e<a;e++)d[e]=h(Math.random());var j=function(a){return Math.floor(a*(i()+1.1102230246251565e-16*(2097152*i()|0)))};return j.string=function(a){var b,c="";for(b=0;b<a;b++)c+=String.fromCharCode(33+j(94));return c},j.cleanString=function(a){return a=a.replace(/(^\s*)|(\s*$)/gi,""),a=a.replace(/[\x00-\x1F]/gi,""),a=a.replace(/\n /,"\n")},j.hashString=function(b){for(b=j.cleanString(b),h(b),e=0;e<b.length;e++)for(g=b.charCodeAt(e),f=0;f<a;f++)d[f]-=h(g),d[f]<0&&(d[f]+=1)},j.addEntropy=function(){var a=[];for(e=0;e<arguments.length;e++)a.push(arguments[e]);k(g++ +(new Date).getTime()+a.join("")+Math.random())},j.initState=function(){for(h(),e=0;e<a;e++)d[e]=h(" ");b=1,c=a},j.done=function(){h=null},j}()}function Mash(){var a=4022871197,b=function(b){if(b){b=b.toString();for(var c=0;c<b.length;c++){a+=b.charCodeAt(c);var d=.02519603282416938*a;a=d>>>0,d-=a,d*=a,a=d>>>0,d-=a,a+=4294967296*d}return 2.3283064365386963e-10*(a>>>0)}a=4022871197};return b}
 
 

function browserRandomValues(wordCount) {
	var randomWords;

	if (window.crypto && window.crypto.getRandomValues) {
		randomWords = new Uint8Array(wordCount);
		window.crypto.getRandomValues(randomWords);
	}
	else if (window.msCrypto && window.msCrypto.getRandomValues) {
		randomWords = new Uint8Array(wordCount);
		window.msCrypto.getRandomValues(randomWords);
	}
	else {
		alert("your browser is not supported");
	}
	return randomWords;
};
 
 
var prng = uheprng();
var seed4random;
function Generate_random_UHEPRNG(count) {
		data = new Uint8Array(count);
		var range = 255;
		
		var NBaddEntropy = 0;
		while (NBaddEntropy == 0){	NBaddEntropy = prng(4);}
		for ( i = 0; i < NBaddEntropy; i++ ) {
			addEntropy();
		}
		

		prng.initState();
		prng.hashString( seed4random );
		
		for ( i = 0; i < data.length; i++ ) {
			data[i] = prng(range);
		}
		return data;
		
}	

function addEntropy() {
		prng.addEntropy();
		var prngState = prng.string(256);
		for ( var s='',i=0; i < 8; i++ ) {
			if ( i ) s += String.fromCharCode(10);
			s += prngState.substr(i*32,32);		
		}
		seed4random = s;
}


function Generate_Entropy(size) {
	//Generate Entropy
	var entropyBrowser = browserRandomValues(size/2);
	var entropyPRNG = Generate_random_UHEPRNG(size/2);
	
	//Concatenate Entropy
	var entropy = new Uint8Array(entropyBrowser.length + entropyPRNG.length);
	for (var i = 0; i < entropyBrowser.length; i++) {
		entropy[i] = entropyBrowser[i];
	}
	for (var i = entropyBrowser.length; i < entropyBrowser.length+entropyPRNG.length; i++) {
		entropy[i] = entropyPRNG[i-entropyBrowser.length];
	}
	return entropy;
}
