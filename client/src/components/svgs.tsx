import * as React from "react";
import {ClassAndChildren} from "../core/reducers";

export interface SVGProps extends ClassAndChildren {
  width?: number
  height?: number
}

export const SVGCheckMark = (props: SVGProps) => {
  return <svg viewBox="0 0 640 640" width={32} height={32} {...props}>
    <path d="M471.59 151.75L301.75 404.13L217.62 296.19" opacity="1" fillOpacity="0" strokeWidth="20"
          strokeOpacity="1"/>
  </svg>
};

export const SVGUser = (props: SVGProps) => {
  return <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 84.75 117.58" width={20} height={20} {...props}>
    <title>user</title>
    <circle cx="43.8" cy="20.75" r="20.25" strokeMiterlimit="10"/>
    <path d="M137.16,152.93" transform="translate(-132.6 -53.28)" strokeMiterlimit="10"/>
    <path d="M142.65,160.11" transform="translate(-132.6 -53.28)" strokeMiterlimit="10"/>
    <path d="M135.9,168.54" transform="translate(-132.6 -53.28)" strokeMiterlimit="10"/>
    <path d="M133.11,170.85c-.15-46.33,25.33-76.94,43.3-76.57,17.75.37,41.41,31.29,40.41,76.38"
          transform="translate(-132.6 -53.28)" strokeMiterlimit="10"/>
    <path d="M233.89,120.92" transform="translate(-132.6 -53.28)" strokeMiterlimit="10"/>
    <path d="M124.73,77.33" transform="translate(-132.6 -53.28)" strokeMiterlimit="10"/>
    <path d="M250.84,102.48" transform="translate(-132.6 -53.28)" strokeMiterlimit="10"/>
    <path d="M231.09,96.52" transform="translate(-132.6 -53.28)" strokeMiterlimit="10"/>
  </svg>
};

export const SVGSoundOn = (props: SVGProps) => {
  return <svg id="squared" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 174.67 131.96" width={20}
              height={20} {...props}><title>sound-on-svg</title>
    <path
      d="M63,87.37H33.56a17.15,17.15,0,0,0-4.23,3.32A13.71,13.71,0,0,0,27,94.27v33.27a8.21,8.21,0,0,0,3,3.38,11,11,0,0,0,3.58,1.49H63l41.58,35.3a11.46,11.46,0,0,0,4.63.85,11.24,11.24,0,0,0,4-.85V42.33a8.11,8.11,0,0,0-4-1.19,8.28,8.28,0,0,0-4.63,1.19Z"
      transform="translate(-26.47 -40.63)" strokeMiterlimit="10"/>
    <path d="M118.29,160.61" transform="translate(-26.47 -40.63)" strokeMiterlimit="10"/>
    <path
      d="M129,144c-1.87-.7,4.58-13.54,4.73-35.24.16-22.58-6.63-36-4.73-36.72,2.21-.82,15.09,16.12,14.86,36.66C143.64,128.59,131.19,144.82,129,144Z"
      transform="translate(-26.47 -40.63)" strokeMiterlimit="10"/>
    <path
      d="M146.28,53.62c-2.08,1,12.66,21,13.25,52.2.55,30-12.36,49.65-10.29,50.55,2.34,1,22.33-22.35,21.66-51.6C170.22,75.09,148.58,52.45,146.28,53.62Z"
      transform="translate(-26.47 -40.63)" strokeMiterlimit="10"/>
    <path
      d="M173.45,41.16c-2.43,1.06,14.72,27.25,14.24,67.11-.46,38-16.66,62.72-14.24,63.78,2.66,1.18,26.49-27,27.17-63.48C201.34,70.24,176.13,40,173.45,41.16Z"
      transform="translate(-26.47 -40.63)" strokeMiterlimit="10"/>
  </svg>
};

export const SVGSoundOff = (props: SVGProps) => {
  return <svg id="off" data-name="squared copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118.57 148.75"
              width={20}
              height={20} {...props}>
    <title>sound-off-svg</title>
    <path
      d="M63,87.37H33.56a17.15,17.15,0,0,0-4.23,3.32A13.71,13.71,0,0,0,27,94.27v33.27a8.21,8.21,0,0,0,3,3.38,11,11,0,0,0,3.58,1.49H63l41.58,35.3a11.46,11.46,0,0,0,4.63.85,11.24,11.24,0,0,0,4-.85V42.33a8.11,8.11,0,0,0-4-1.19,8.28,8.28,0,0,0-4.63,1.19Z"
      transform="translate(-26.47 -31.47)" strokeMiterlimit="10"/>
    <path d="M118.29,160.61" transform="translate(-26.47 -31.47)" strokeMiterlimit="10"/>
    <polygon points="113.95 1.11 118.02 16.31 20.29 147.76 13.63 132.58 113.95 1.11"
             strokeMiterlimit="10"/>
  </svg>
};

export const SVGSine = (props: SVGProps) => {
  return <svg id="sine" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166.3 111.04" width={20}
              height={20} {...props}><title>sine</title>
    <path
      d="M30.09,113.22c7.65-24.1,19.07-49.86,34.53-50.75C97,60.61,117,169.59,151.41,168.47c10.45-.33,24.48-10.87,40.24-55.55"
      transform="translate(-27.71 -59.94)" fill="none" strokeMiterlimit="10" strokeWidth="15"/>
  </svg>
};

export const SVGTriangle = (props: SVGProps) => {
  return <svg width={20} height={20} {...props} id="triangle" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 111.74 91.51">
    <title>triangle</title>
    <polyline points="2.12 90.18 55.73 4.7 109.63 90.18" fill="none" strokeMiterlimit="10"
              strokeWidth="15"/>
  </svg>
};

export const SVGSawtooth = (props: SVGProps) => {
  return <svg width={20} height={20} {...props} id="sawtooth" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 105.34 112.57"><title>sawtooth</title>
    <polyline points="102.84 56.28 102.84 106.53 2.5 6.04 2.5 56.28" fill="none" strokeMiterlimit="10"
              strokeWidth="15"/>
  </svg>
};

export const SVGSquare = (props: SVGProps) => {
  return <svg width={20} height={20} {...props} id="square" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 112.9 112.51"><title>square</title>
    <polyline points="110.4 56.43 110.4 110.01 56.51 110.01 56.51 56.43 56.51 2.5 2.5 2.5 2.5 56.25" fill="none"
              strokeMiterlimit="10" strokeWidth="15"/>
  </svg>
};

export const SVGPlus = (props: SVGProps) => {
  return <svg width={12} height={12} {...props}
              id="plus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113.81 113.51"><title>plus</title>
    <line x1="56.91" x2="56.91" y2="113.51" fill="none" strokeMiterlimit="10" strokeWidth="15"/>
    <line y1="56.76" x2="113.81" y2="56.76" fill="none" strokeMiterlimit="10" strokeWidth="15"/>
  </svg>
};

export const SVGMinus = (props: SVGProps) => {
  return <svg width={12} height={12} {...props}
              id="minus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113.81 15"><title>minus</title>
    <line y1="7.5" x2="113.81" y2="7.5" fill="none" strokeMiterlimit="10" strokeWidth="15"/>
  </svg>
};

export const SVGChords = (props: SVGProps) => {
  return <svg width={32} height={32} {...props}
              id="chords" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113.28 75.85"><title>chords</title>
    <rect x="0.5" y="0.5" width="52.36" height="37.43" strokeMiterlimit="10"/>
    <rect x="0.5" y="37.93" width="37.43" height="37.43" fill="none" strokeMiterlimit="10"/>
    <rect x="37.93" y="37.93" width="37.43" height="37.43" fill="none" strokeMiterlimit="10"/>
    <rect x="75.35" y="37.93" width="37.43" height="37.43" fill="none" strokeMiterlimit="10"/>
    <circle cx="19.37" cy="57.77" r="8.55" strokeMiterlimit="10"/>
    <path d="M95.59,68.87V106.3h51.48V68.87Zm16,27.27a8.56,8.56,0,1,1,8.1-8.55A8.32,8.32,0,0,1,111.64,96.14Z"
          transform="translate(-34.29 -68.37)" strokeMiterlimit="10"/>
  </svg>
};

export const SVGSong = (props: SVGProps) => {
  return <svg width={16} height={16} {...props}
              id="songs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39.04 36.69"><title>writing</title>
    <path
      d="M72.11,85.29c1.31-2.13,3.43-4.88,6.1-5,4.22-.16,5.37,6.54,9.55,6.64,4.41.1,5.11-7.29,9.07-6.14,3.51,1,5.33,7.53,7.7,5.64A7,7,0,0,0,106.3,83"
      transform="translate(-70.94 -78.93)" fill="none" strokeMiterlimit="10" strokeWidth="2.75"/>
    <path
      d="M72.11,98.57c1.4-2.19,3.67-5,6.52-5.13,4.51-.16,5.73,6.75,10.21,6.85,4.71.1,5.46-7.52,9.69-6.34,3.76,1,5.7,7.77,8.23,5.82a7.12,7.12,0,0,0,1.89-3.59"
      transform="translate(-70.94 -78.93)" fill="none" strokeMiterlimit="10" strokeWidth="2.75"/>
    <path
      d="M72.11,112.54c1.4-2.2,3.67-5,6.52-5.14,4.51-.16,5.73,6.75,10.21,6.85,4.71.1,5.46-7.52,9.69-6.34,3.76,1,5.7,7.77,8.23,5.82a7.12,7.12,0,0,0,1.89-3.59"
      transform="translate(-70.94 -78.93)" fill="none" strokeMiterlimit="10" strokeWidth="2.75"/>
  </svg>
};

export const SVGOctave = (props: SVGProps) => {
  return <svg width={12} height={12} {...props}
              id="octave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74.81 74.81"><title>octave</title>
    <circle cx="37.41" cy="37.41" r="36.03" strokeMiterlimit="10" strokeWidth="2.75"/>
  </svg>
};

export const SVGBack = (props: SVGProps) => {
  return <svg width={12} height={12} {...props}
              id="back" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72.68 115.75"><title>back</title>
    <polyline points="69.38 3.75 7.59 58.13 69.38 111.98" fill="#fff" stroke="#000" strokeMiterlimit="10"
              strokeWidth="10"/>
  </svg>
};

