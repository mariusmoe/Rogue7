import { Pipe, PipeTransform } from '@angular/core';
import * as timeAgo from 'date-fns/distance_in_words_to_now';

@Pipe({ name: 'TimeAgo' })
export class TimeAgo implements PipeTransform {

  transform(date: string | number | Date): string {
    if (!date) { throw new Error('timeAgo Pipe: Missing arg'); }
    return timeAgo(date, { addSuffix: true });
  }
}
