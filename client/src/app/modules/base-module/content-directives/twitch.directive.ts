import { Directive, ElementRef } from '@angular/core';

enum TwitchType {
  Channel = 'channel',
  Video = 'video',
  Collection = 'collection'
}

@Directive({
  selector: '[href]',
  exportAs: 'href',
})
export class TwitchDirective {

  constructor(private el: ElementRef<HTMLAnchorElement>) {
    // Checks for Validity of element
    if (!el.nativeElement || el.nativeElement.tagName !== "A") { return; }
    if (el.nativeElement.href === undefined || typeof el.nativeElement.href !== 'string') { return; }
    if (!el.nativeElement.parentNode) { return; } // to protect against template issues

    // Checks for Twitch specifically
    const url = el.nativeElement.href;
    if (!url.includes('twitch')) { return; }
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
    const iframe = document.createElement('iframe');
    iframe.src = 'http://player.twitch.tv/?' + type + '=' + prefix + source;
    iframe.frameBorder = '0';
    iframe.setAttribute('allowfullscreen', 'allowfullscreen');
    iframe.setAttribute('scrolling', 'no');

    // Create Thumbnail image (also required for aspect ratio)
    const img = document.createElement('img'); // Creating a black 16 by 9 base64 image
    img.src = 'data:image/bmp;base64,Qk1YAQAAAAAAADYAAAAoAAAAEAAAAAkAAAABABAAAAAAACIBAAASCwAAEgs' + 'A'.repeat(400) + '=';

    const wrapper = document.createElement('div');
    wrapper.classList.add('video');

    // perform DOM manipulation
    wrapper.appendChild(img);
    wrapper.appendChild(iframe);
    el.nativeElement.parentNode.insertBefore(wrapper, el.nativeElement);
    el.nativeElement.remove();
  }
}
