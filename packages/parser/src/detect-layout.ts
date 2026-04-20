import { Slide } from '@mindfiredigital/mdslide-shared';

export function detectLayout(slide: Slide): Slide {
  //covert to bullet
  const hasList = slide.content.some((item) => item.type === 'list');

  if (hasList) {
    return {
      ...slide,
      type: 'bullets',
    };
  }

  //covert to main title
  if (slide.title && slide.content.length === 0) {
    return {
      ...slide,
      type: 'title',
    };
  }
  return slide;
}
