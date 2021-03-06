/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ''Software''), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
  'use strict';

  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

  export class VisualSettings extends DataViewObjectsParser {
    public dataPoint: DataPointSettings = new DataPointSettings();
  }

  export class DataPointSettings {
    // Text Size
    public fontSize: number = 12;
    // Show background;
    public showBackground: boolean = true;
    // Solid, Gradient (T->B), Gradient (L->R), etc..;
    public fillType: string = 'solid';
    // lowest colour background colour
    public startColor: string = '#b3b3b3';
    // mid colour background colour
    public midColor: string = '#b3b3b3';
    // highest colour background colour
    public endColor: string = '#b3b3b3';
    // Tiles and legend backgound transparency
    public fillOpacity: number = 20;
    // Show border;
    public showBorder: boolean = true;
    // Border colour
    public borderColor: string = '#b3b3b3';
    // Border width
    public borderWidth: number = 2;
    // Border fillet
    public borderFillet: number = 15;
    // Border colour
    public showDropShadow: boolean = false;
    // Border colour
    public dropShadowOffset: number = 10;
    // Border fillet
    public dropShadowBlur: number = 3;
    // Border fillet
    public dropShadowOpacity: number = 0.4;

    // Transparent Opacity
    public transparent: number = 0;
    // Opaque opacity
    public opaque: number = 0.5;
    // Solid Opacity
    public solid: number = 1.0;
  }
}
