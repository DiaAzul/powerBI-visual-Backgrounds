# powerBI-visual-Background3
Power BI custom visual showing a customisable rectangle

![Build Status](https://travis-ci.org/DiaAzul/powerBI-visual-Heatmap3.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/DiaAzul/powerBI-visual-Heatmap3/badge.svg?branch=master)](https://coveralls.io/github/DiaAzul/powerBI-visual-Heatmap3?branch=master) [![dependencies Status](https://david-dm.org/diaazul/powerBI-visual-Heatmap3/status.svg)](https://david-dm.org/diaazul/powerBI-visual-Heatmap3)

<img src="./assets/backgroundVisual.png" width="600">

This custom visual for Microsoft Power BI displays a rectange and is intended to replace the rectangle shape within Power BI. The visual above shows a population pyramid in front of a rounded rectangle with gradient fill. This custom visual is different from the built in Power BI rectangle shape:
+ It provides a choice of solid and gradient fills
+ Fixed fillet radius (pixels). The Power BI rectangle shape sets the fillet radius as a percentage of the edge dimension, therefore, the size of the fillet changes as the shape is resized and it is difficult to get consistency of fillet across shapes on a page.
+ The visual is flush with the top and left of the frame - note the Power BI rectangle has a variable margin that increases as the rectangle gets larger - this makes it difficult to align the edges of rectangles of different size.


**Configuration Options**

<img src="./assets/settings.png" width="200">

This visual does not require any data.
