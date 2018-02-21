/*
 *  Power BI Background Visualization
 *
 *  Copyright (c) Tanzo Creative
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

    //#region data models
    import IVisual = powerbi.extensibility.visual.IVisual;
    import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
    import IInteractivityService = powerbi.extensibility.utils.interactivity.IInteractivityService;
    import createInteractivityService = powerbi.extensibility.utils.interactivity.createInteractivityService;
    import appendClearCatcher = powerbi.extensibility.utils.interactivity.appendClearCatcher;
    import ISelectableDataPoint = powerbi.extensibility.utils.interactivity.SelectableDataPoint;
    import ISelectionID = powerbi.extensibility.ISelectionId;
    import IVisualSelectionId = powerbi.visuals.ISelectionId;
    import ISemanticFilter = powerbi.data.ISemanticFilter;
    import svgUtils = powerbi.extensibility.utils.svg;

    class ChartViewModel {
        public dataPoints: DataPoint[] = [];
    }

    export interface IDataPoint extends ISelectableDataPoint {
        nullData: string;
    }

    export class DataPoint implements IDataPoint {
        public nullData: string;
        public selected: boolean;
        public identity: ISelectionId;
        public specificIdentity?: ISelectionId;
    }
    //#endregion

    export class Visual implements IVisual {
        private host: IVisualHost;
        private target: HTMLElement;
        private svg: d3.Selection<SVGElement>;
        private defs: d3.Selection<SVGElement>;
        private chart: d3.Selection<SVGElement>;
        private settings: VisualSettings = new VisualSettings();
        private viewModel: ChartViewModel = new ChartViewModel();
        private locale: string;

        constructor(options: VisualConstructorOptions) {
            this.target = options.element;
            this.host = options.host;
            this.locale = options.host.locale;

            this.svg = d3.select(this.target).append('svg');

        }

        public update(options: VisualUpdateOptions): void {

            this.settings = this.parseSettings(options && options.dataViews && options.dataViews[0]);
            this.backgroundVisual(options.viewport.width, options.viewport.height);
        }

        /**
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
         * objects and properties you want to expose to the users in the property pane.
         *
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {

            const objectName: string = options.objectName;
            const objectEnumeration: VisualObjectInstance[] = [];
            const settings: DataPointSettings = this.settings.dataPoint;

            // For each control object provie a link between the uer interface and the settings property
            switch (objectName) {
                /*                 case 'text':
                                    objectEnumeration.push({
                                        objectName: objectName,
                                        properties: {
                                            fontSize: this.settings.dataPoint.fontSize
                                        },
                                        selector: null
                                    }); */
                case 'visFill':
                    const formatProperties: {
                        showBackground: boolean,
                        fillType: string,
                        percentile?: number;
                        lowestColor?: { solid: { color: string } }, // Optional elements that will be displayed depending on colorScheme
                        midColor?: { solid: { color: string } },
                        highestColor?: { solid: { color: string } }
                    } = {
                            showBackground: this.settings.dataPoint.showBackground,
                            fillType: this.settings.dataPoint.fillType
                        };
                    switch (settings.fillType) {
                        case 'solid':
                            formatProperties['startColor'] = { solid: { color: settings.startColor } };
                            break;
                        case 'left':
                        case 'right':
                        case 'top':
                        case 'bottom':
                            formatProperties['startColor'] = { solid: { color: settings.startColor } };
                            formatProperties['endColor'] = { solid: { color: settings.endColor } };
                            break;
                        default:
                    }
                    formatProperties['percentile'] = this.settings.dataPoint.fillOpacity;
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: formatProperties,
                        selector: null
                    });
                case 'visBorder':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            showBorder: this.settings.dataPoint.showBorder,
                            borderColor: { solid: { color: this.settings.dataPoint.borderColor } },
                            borderWidth: this.settings.dataPoint.borderWidth,
                            borderFillet: this.settings.dataPoint.borderFillet
                        },
                        selector: null
                    });

                default:
            }
            return objectEnumeration;
        }

        /**
         *
         * The following functions extend the user interface in conjunction with settings.ts and capabilities.json
         *
         * For each control added on the interface:
         *  + Define the control in the capabilities.json file - this signals to the interface what is to be displayed
         *  + Added a property to the settings.ts (dataPointSettings class) to store the user interface state
         *  + Add an object to in enumerateObjectInstance to link the user interface to the settings variable
         *  + Add an assignment to parse the setting from the returned DataView object.
         *
         */
        private parseSettings(dataView: DataView): VisualSettings {

            const visualSettings: VisualSettings = <VisualSettings>VisualSettings.parse(dataView);

            const root: DataViewObjects = dataView.metadata.objects;
            const setting: DataPointSettings = visualSettings.dataPoint;

            if (root != null) {

                if ('text' in root) {
                    const options: DataViewObject = root['text'];

                    setting.fontSize = ('fontSize' in options) ? <number>options['fontSize'] : setting.fontSize;

                }
                if ('visFill' in root) {
                    const visBackground: DataViewObject = root['visFill'];

                    setting.showBackground = ('showBackground' in visBackground) ? <boolean>visBackground['showBackground'] : setting.showBackground;
                    setting.fillType = ('fillType' in visBackground) ? <string>visBackground['fillType'] : setting.fillType;
                    setting.startColor = ('startColor' in visBackground) ? <string>visBackground['startColor']['solid']['color'] : setting.startColor;
                    setting.midColor = ('midColor' in visBackground) ? <string>visBackground['midColor']['solid']['color'] : setting.midColor;
                    setting.endColor = ('endColor' in visBackground) ? <string>visBackground['endColor']['solid']['color'] : setting.endColor;

                    setting.fillOpacity = ('percentile' in visBackground) ? <number>visBackground['percentile'] : setting.fillOpacity;

                }
                if ('visBorder' in root) {
                    const visBorder: DataViewObject = root['visBorder'];

                    setting.showBorder = ('showBorder' in visBorder) ? <boolean>visBorder['showBorder'] : setting.showBorder;
                    setting.borderColor = ('borderColor' in visBorder) ? <string>visBorder['borderColor']['solid']['color'] : setting.borderColor;
                    setting.borderWidth = ('borderWidth' in visBorder) ? <number>visBorder['borderWidth'] : setting.borderWidth;
                    setting.borderFillet = ('borderFillet' in visBorder) ? <number>visBorder['borderFillet'] : setting.borderFillet;
                }

            }

            return visualSettings;
        }

        /**
         *  The following functions define the chart to be shown in the view.
         *
         * Javascript View to create a population pyramid
         * Create the main body of the chart
         */

        private backgroundVisual(windowWidth: number, windowHeight: number): void { //, data: DataPoint[]): void {

            const settings: DataPointSettings = this.settings.dataPoint;

            const allowInteractions: boolean = this.host.allowInteractions;

            const fontSize: string = settings.fontSize.toString().concat('pt');

            const showBackground: boolean = settings.showBackground;
            const fillType: string = settings.fillType;
            const startColor: string = settings.startColor;
            const midColor: string = settings.midColor;
            const endColor: string = settings.endColor;
            const fillOpacity: number = settings.fillOpacity / 100;

            const showBorder: Boolean = settings.showBorder;
            const borderColor: string = settings.borderColor;
            const borderWidth: number = settings.borderWidth;
            const borderFillet: number = settings.borderFillet;

            // RefTextSize is the size of a character on screen (used for adjusting chart for different type sizes)
            // const refTextSize: { width: number, height: number } = this.textSize('W', fontSize);

            const offset: number = showBorder ? borderWidth / 2 : 0;

            const margin: { top: number, right: number, bottom: number, left: number }
                = { top: offset, left: offset, bottom: offset, right: offset };

            const chartWidth: number = windowWidth - margin.left - margin.right;
            const chartHeight: number = windowHeight - margin.top - margin.bottom;

            //
            // CREATE SVG
            //
            this.svg
                .attr('width', windowWidth)
                .attr('height', windowHeight)
                .style('fill-opacity', settings.transparent);

            if (this.chart != null && !this.chart.empty()) {
                this.svg.selectAll('#chart').remove();
            }

            //Append a defs (for definition) element to your SVG
            if (this.defs != null && !this.defs.empty()) {
                this.svg.selectAll('#gradient').remove();
            }
            this.defs = this.svg.append('defs').attr('id', 'gradient');

            const direction: { left: number, top: number, right: number, bottom: number} = { left: 0, top: 0, right: 0, bottom: 0 };

            switch (fillType) {
                case 'left':
                direction.right = 100;
                break;

                case 'right':
                direction.left = 100;
                break;

                case 'top':
                direction.bottom = 100;
                break;

                case 'bottom':
                direction.top = 100;
                break;

                case 'solid':
                default:
                break;

            }

            //Append a linearGradient element to the defs and give it a unique id
            const linearGradient: d3.Selection<SVGElement> = this.defs.append('linearGradient')
                .attr('id', 'linearGradient')
                .attr('x1', direction.left + '%')
                .attr('y1', direction.top + '%')
                .attr('x2', direction.right + '%')
                .attr('y2', direction.bottom + '%');

            //Set the color for the start (0%)
            linearGradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', startColor); //light blue

            //Set the color for the end (100%)
            linearGradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', endColor); //dark blue

            this.chart = this.svg.append('rect')
                .attr('id', 'chart')
                .attr('width', chartWidth)
                .attr('height', chartHeight)
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('rx', showBorder ? borderFillet : 0)
                .attr('ry', showBorder ? borderFillet : 0)
                .style('fill', (fillType === 'solid') ? startColor : 'url(#linearGradient') //backgroundColor)
                .style('fill-opacity', showBackground ? fillOpacity : settings.transparent)
                .style('stroke', showBorder ? borderColor : '#b3b3b3')
                .style('stroke-width', showBorder ? borderWidth : 0);
        }

        /*
         * Method to return the size of a text node (Written for SVG1.1, with SVG2 could use SVGGraphicsElement more elegantly)
         *
         * @private
         * @param {string} text Text from which the screen width and height is required
         * @param {string} chartFontSize Font size of the text
         * @returns {{ width: number, height: number }} Width and Height of the bounding text box.
         * @memberof Visual
         */
        private textSize(text: string, chartFontSize: string): { width: number, height: number } {

            const docElement: HTMLDivElement = this.target.appendChild(document.createElement('div')) as HTMLDivElement;

            const svgDoc: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            docElement.appendChild(svgDoc);

            const textElement: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttributeNS(null, 'font-size', chartFontSize);
            textElement.textContent = text;

            svgDoc.appendChild(textElement);

            const size: { width: number, height: number } = textElement.getBBox();

            this.target.removeChild(docElement);

            return { width: size.width, height: size.height };
        }

    }
}
