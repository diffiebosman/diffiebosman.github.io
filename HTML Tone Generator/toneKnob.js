export class ToneKnob{
	constructor(_id, _context, _freq){
		this.knobID = _id;
		this.context = _context;
		this.oscillator = this.context.createOscillator();
		this.gain = this.context.createGain();

		this.oscillator.frequency.value = _freq;
		this.oscillator.start();

		let now = this.context.currentTime;
		
		this.gain.gain.setValueAtTime(0, now);
		this.oscillator.connect(this.gain);
		this.gain.connect(this.context.destination);

		this.LFO = 0;
		this.count = 0;
		this.medianVolume = 0;

		// speed at which the LFO oscillates
		// min 0.01, max 0.1
		this._LFO_freq = 0.01;

		// amplitude of the LFO
		// min = 0, max = 1
		this._LFO_amp = 0;

		setInterval(() => {
			this.LFO = Math.sin(this.count) * this._LFO_amp;
			this.count += this._LFO_freq;
			if(this.count == 1) this.count = 0;
			this.setLFOAmplitude();
		}, 10);
	}

	// Sets the "anchoring" volume around which the actual volume oscillates
	setVolume(_amp){
		this.medianVolume = _amp;
	}

	set LFO_freq(_LFO_freq){
		this._LFO_freq = _LFO_freq;
	}

	set LFO_amp(_LFO_amp){
		this._LFO_amp = _LFO_amp;
		//console.log(this._LFO_amp);
	}

	// Use the LFO to set the amplitude for the current frequency
	// Also move amplitude-indicator on range according to amplitude
	setLFOAmplitude(){
		let now = this.context.currentTime;
		let newGain = parseFloat(this.medianVolume) + parseFloat(this.LFO); 
		newGain = clampNum(newGain, 0, 1);

		this.gain.gain.setValueAtTime(newGain, now);


		// Move amp-indicator dial up with amp dial and LFO. Even though the height of the range input is 300, 282 seems to be
		// the magic value here
		let amp_indicator_val = -25 - (this.medianVolume * 282) - (this.LFO * 282);
		// keep the amp-indicator within bounds
		amp_indicator_val = clampNum(amp_indicator_val, -300, -25);

		$("div.tones > div.col:nth-child("+(parseInt(this.knobID)+2)+") div.amp-indicator").css("top", amp_indicator_val + "px");
	}

	render(){
		let knobColor = "#56BF7B";

		return $("<div></div>")
		.addClass("col")
		.append(
			$("<input />")
			.attr("type", "range")
			.attr("orient", "vertical")
			.attr("step", "0.05")
			.attr("min", "0")
			.attr("max", "1")
			.attr("value", "0")
			.on("input", e => {
				let amp = e.currentTarget.value;
				this.setVolume(amp);
				$(e.currentTarget).siblings("span").html(amp);
			})
		)
		.append(
			$("<div></div>")
			.addClass("amp-indicator")
		)
		.append(
			$("<br />")
		)
		.append(
			$("<span></span>")
			.html("0")
		)
		.append(
			$("<br />")
		)
		.append(
			$("<input />")
			.attr("type", "text")
			.attr("value", "0")
			.data("width", "35")
			.data("height", "35")
			.attr("data-min", "0")
			.attr("data-max", "50")
			.attr("data-angleOffset", "-125")
			.attr("data-angleArc", "250")
			.attr("data-fgColor", knobColor)
			.attr("data-displayInput", "false")
			.addClass("LFO_amp_dial")
		)
		.append(
			$("<input />")
			.attr("type", "text")
			.attr("value", "1")
			.data("width", "35")
			.data("height", "35")
			.attr("data-min", "1")
			.attr("data-max", "100")
			.attr("data-angleOffset", "-125")
			.attr("data-angleArc", "250")
			.attr("data-fgColor", knobColor)
			.attr("data-displayInput", "false")
			.addClass("LFO_freq_dial")
		);
	}
}

function clampNum(num, min, max){
	return Math.min(Math.max(num, min), max);
}