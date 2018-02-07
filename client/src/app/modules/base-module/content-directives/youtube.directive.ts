import { Directive, ElementRef } from '@angular/core';


@Directive({
  selector: '[href]',
  exportAs: 'href',
})
export class YoutubeDirective {

  constructor(private el: ElementRef<HTMLAnchorElement>) {
    // Checks for Validity of element
    if (!el.nativeElement || el.nativeElement.tagName !== "A") { return; }
    if (el.nativeElement.href === undefined || typeof el.nativeElement.href !== 'string') { return; }
    if (!el.nativeElement.parentNode) { return; } // to protect against template issues

    // Checks for Youtube specifically
    const url = el.nativeElement.href;
    if (!url.includes('youtube')) { return; }
    const split = el.nativeElement.href.split('v=');
    if (!split[0] || !split[1]) { return; }

    // Get vars
    const videoId = split[1].split('&')[0];

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + videoId;
    iframe.frameBorder = '0';
    iframe.setAttribute('allowfullscreen', 'allowfullscreen');

    // Create Thumbnail image (also required for aspect ratio)
    const img = document.createElement('img');
    img.src = 'https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg';

    const wrapper = document.createElement('div');
    wrapper.classList.add('video');

    // perform DOM manipulation
    wrapper.appendChild(img);
    wrapper.appendChild(iframe);
    el.nativeElement.parentNode.insertBefore(wrapper, el.nativeElement);
    el.nativeElement.remove();
  }
}
