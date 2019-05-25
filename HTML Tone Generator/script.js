import {ToneKnob} from "./toneKnob.js";

$(() => {
	let context = new (window.AudioContext || window.webkitAudioContext)();

	// Number of sine tones that will be generated
	let numTones = 14;

	let fundamentalFreq = 110;
	
	for(let i = 0; i < numTones; i++){
		let frequency = fundamentalFreq * (i + 1);
		let toneKnob = new ToneKnob(i, context, frequency);
		$("div.tones").append(toneKnob.render());
		
		$(".LFO_amp_dial").knob({
        	'change' : function (v) { 
        		toneKnob.LFO_amp = v / 100;
        	}
   		});
   		$(".LFO_freq_dial").knob({
        	'change' : function (v) { 
        		toneKnob.LFO_freq = v / 1000;
        	}
   		});
	}
});