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
    public background: boolean = true;
    // Tiles and legend background colour
    public backgroundColor: string = '#b3b3b3';
    // Tiles and legend backgound transparency
    public backgroundOpacity: number = 20;
    // Show border;
    public border: boolean = true;
    // Border colour
    public borderColor: string = '#b3b3b3';
    // Border width
    public borderWidth: number = 5;
    // Border fillet
    public borderFillet: number = 0;

    // Transparent Opacity
    public transparent: number = 0;
    // Opaque opacity
    public opaque: number = 0.5;
    // Solid Opacity
    public solid: number = 1.0;
  }
}

