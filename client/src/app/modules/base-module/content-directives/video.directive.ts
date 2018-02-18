import { Directive, ElementRef, Renderer2 } from '@angular/core';

enum TwitchType {
	Channel = 'channel',
	Video = 'video',
	Collection = 'collection'
}

@Directive({
	selector: '[href]',
	exportAs: 'href',
})
export class VideoDirective {

	private _iframe: any;
	private _img: any;

	constructor(private el: ElementRef<HTMLAnchorElement>, private renderer: Renderer2) {
		// Checks for Validity of element
		if (!el.nativeElement || el.nativeElement.tagName !== 'A') { return; }
		if (el.nativeElement.href === undefined || typeof el.nativeElement.href !== 'string') { return; }
		if (!el.nativeElement.parentNode) { return; } // to protect against template issues

		// Checks for Youtube specifically
		const url = el.nativeElement.href;
		if (url.includes('youtube')) {
			this.createYoutubeVideo(el);

		} else if (url.includes('twitch')) {
			this.createTwitchVideo(el);

		} else {
			return; // Do nothing
		}

		// Create the wrapper
		const wrapper = this.renderer.createElement('div');
		this.renderer.addClass(wrapper, 'video');

		// Set common attributes
		this.renderer.setAttribute(this._iframe, 'frameBorder', '0');
		this.renderer.setAttribute(this._iframe, 'allowfullscreen', 'allowfullscreen');
		this.renderer.setAttribute(this._iframe, 'scrolling', 'no');

		// Add to DOM
		this.renderer.appendChild(wrapper, this._img);
		this.renderer.appendChild(wrapper, this._iframe);
		this.renderer.insertBefore(el.nativeElement.parentElement, wrapper, el.nativeElement);
		this.renderer.removeChild(this.renderer.parentNode(el.nativeElement), el.nativeElement);
		this.renderer.destroy();

	}

	/**
	 * Creates a youtube embed
	 * @param el the element to replace with the embed
	 */
	private createYoutubeVideo(el: ElementRef<HTMLAnchorElement>) {
		const split = el.nativeElement.href.split('v=');
		if (!split[0] || !split[1]) { return; }

		// Get vars
		const videoId = split[1].split('&')[0];

		// Create iframe
		this._iframe = this.renderer.createElement('iframe');
		this.renderer.setAttribute(this._iframe, 'src', 'https://www.youtube.com/embed/' + videoId);

		// Create Thumbnail image (also required for aspect ratio)
		this._img = this.renderer.createElement('img');
		this.renderer.setAttribute(this._img, 'src', 'https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg');
	}


	/**
	 * Creates a Twitch embed
	 * @param el the element to replace with the embed
	 */
	private createTwitchVideo(el: ElementRef<HTMLAnchorElement>) {
		const url = el.nativeElement.href;
		let type = '', prefix = '', source = '';

		if (url.includes('/videos/')) {
			type = TwitchType.Video;
			prefix = 'v';
			source = url.split('/videos/')[1];
		} else {
			// assume its a channel
			type = TwitchType.Channel;
			source = url.split('.tv/')[1];
		}

		// Create iframe
		this._iframe = this.renderer.createElement('iframe');
		this.renderer.setAttribute(this._iframe, 'src', 'http://player.twitch.tv/?' + type + '=' + prefix + source);

		// Create Thumbnail image (also required for aspect ratio)
		this._img = this.renderer.createElement('img');  // Creating a black 16 by 9 base64 image
		this.renderer.setAttribute(this._img, 'src',
			'data:image/bmp;base64,Qk1YAQAAAAAAADYAAAAoAAAAEAAAAAkAAAABABAAAAAAACIBAAASCwAAEgs' + 'A'.repeat(400) + '=');
	}
}
